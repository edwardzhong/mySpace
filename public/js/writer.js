	var simplemde = new SimpleMDE({
		element: $("#article")[0],
		autoDownloadFontAwesome:false,
	 	renderingConfig:{//配置代码语法高亮
	 		singleLineBreaks:true,
	 		codeSyntaxHighlighting:true
	 	},
	 	// autofocus: true,
	 	// autosave: {
	 	// 	enabled: true,
	 	// 	uniqueId: new Date().getTime(),
	 	// 	delay: 1000,
	 	// },
	 	showIcons: ["code", "table","undo","redo","save","upload","download","publish","outline"],
	 	hideIcons: ["guide"],
	 	spellChecker: false,
	 	placeholder:'这里填写文章内容...'
	}),codeMirror=simplemde.codemirror;

	var dataHash={},
		selectArticleId='',
		changeEvent= 'oninput' in window?'input':'onpropertychange' in window?'propertychange':'keyup',
		liTpl = obj => `<li data-articleId="${obj.id}">
							<i class="set-article fa fa-gear"></i>
							<div>
								<i class="file-type fa fa-file ${obj.is_publish==1?'is-publish':''}"></i>
								<a href="javascript:;">${obj.title||'无标题文章'}</a>
								<p class="desc">${obj.summary}</p>
								<p class="word-count">字数：0</p>
							</div>
						</li>`,
		tLiTpl=obj=>`<li data-articleId="${obj.id}"><i class="fa fa-file-text"></i><span>${obj.days}天后清除</span><p>${obj.title}</p></li>`;

    function Controller(){
    	this.prevHash='';
    	this.currHash='';
    	this.args=[];
    }

    Controller.prototype.selectHash=function(hash){//调用对应的子页面，同时同步url的hash
		var self=this,
			actionName='';
        if (location.hash.substr(1) != hash) {//同步hash
            location.hash = hash;
            return;
        }
        self.args=hash.split('/');
        actionName=self.args[0];
        if (!actionName || !(actionName in Actions)) {
            self.selectHash('article');
        } else {
        	self.currHash=actionName;
            Actions[actionName].apply(self,self.args);
            self.prevHash=self.currHash;
        }
        return self;
	};    

    Actions={
    	article:function(hash,id){
    		var self=this,lis=[],li;
    		if(self.prevHash!='article'){
    			getDatas({is_delete:0},function(data){
					data.forEach(function(obj,i){
						dataHash[obj.id]=obj;
						obj.delete_date=new Date(obj.update_date)
						if(obj.is_delete!=1){
							lis.push(liTpl(obj));
						}
					});
					$('.write-mode').show().siblings().hide();
					if(lis.length){
						$('.article-list').html(lis.join(''));
						select();
					}
				});
    		} else {
    			select();
    		}
	    	function select(){
				// if(!id){
	   //  			li=$('.article-list').find('li').first();
	   //  			if(li.length){
	   //  				articleHash(li.attr('data-articleId'));
	   //  			}
	   //  		} else 
	    		if(id){
	    			li=$('.article-list').find('[data-articleId='+id+']');
	    			if(li.length){
	    				selectArticle(id);
	    			} else {
	    				self.selectHash('article');
	    			}
	    		}
	    	}
    	},
    	trash:function(hash){
    		getDatas({is_delete:1},function(data){
	    		var lis=[],d;
				data.forEach(function(obj,i){
					d=getDateString(obj.update_date,30);
					dataHash[obj.id]=obj;
					if(obj.is_delete==1){
						dataHash[obj.id].is_save=dataHash[obj.id].title?true:false;
						dataHash[obj.id].title=dataHash[obj.id].title||'无标题文章';
						dataHash[obj.id].days=d.days;
						dataHash[obj.id].delete_date=d.date;
						lis.push(tLiTpl(obj));
					}
				});
				if(lis.length){
					$('.tArticle-list').html(lis.join(''));
					selectTrashArticle(0);
				}
				$('#trashNum').html(lis.length);
	    		$('.trash-mode').show().siblings().hide();
	    	});
    	},
    	tags:function(hash){

    	}
    };

function getDateString(str,days){
	var date=new Date(str).getTime(),
		day=1000*3600*24,
		dDate=new Date(date+day*days),
		curr=new Date();

	return{
		date:dDate.getFullYear()+'/'+('0'+(dDate.getMonth()+1)).slice(-2)+'/'+('0'+dDate.getDate()).slice(-2),
		days:Math.floor((dDate-curr)/day)
	};
}

function selectTrashArticle(i){
	var lis=$('.tArticle-list').find('li'),
		li=lis.eq(i),
		$title=$('#trashTitle'),
		$content=$('#trashContent');
	$title.empty();
	$content.empty();
	selectArticleId='';
	if(li.length){
		selectArticleId=li.attr('data-articleId'), article=dataHash[selectArticleId];
		li.addClass('active').siblings().removeClass('active');
		$title.html(article.title);
		$content.html(article.content.replace(/\n/g,'<br/>'));
	}
}
$('.tArticle-list').on('click','li',function(e){
	var self=$(this);
	selectTrashArticle(self.index());
}).on('mouseover','li',function(e){
	var self=$(this), id=self.attr('data-articleId'), article=dataHash[id];
	self.find('span').html(article.delete_date+'后清除');
}).on('mouseout','li',function(e){
	var self=$(this), id=self.attr('data-articleId'), article=dataHash[id];
	self.find('span').html(article.days+'天后清除');
});
$('#recover').on('click',function(e){
	$.get('/delete?_t='+Math.random(),{articleId:selectArticleId,isDelete:dataHash[selectArticleId].is_delete}).done(function(data){
		if(data.status==1){
			redirectLogin();
		} else if(data.status==0){
			trashDeleteFn(data);
		}
	});
});
$('#rDelete').on('click',function(e){
	var article=dataHash[selectArticleId];
	if(!article) return;
	showCommonDialog(`确定彻底删除文章《${article.title}》？`,function(){
		var dialog=this;
		$.get('/realDelete',{id:selectArticleId}).done(function(data){
			if(data.status==1){
				redirectLogin();
			} else if(data.status==0){
				trashDeleteFn(data,true);
				dialog.remove();
			}
		});
	});
});

function trashDeleteFn(data,realDelete){
	if(data.status==0){
		var $li=$('.tArticle-list').find('[data-articleId='+selectArticleId+']'),
		index=$li.next().length?$li.index():$li.prev().length?$li.prev().index():0;
		dataHash[selectArticleId].is_delete=data.isDelete;
		if(realDelete){
			delete dataHash[selectArticleId];
			// Datas.forEach(function(item,i){
			// 	if(item.id==selectArticleId){
			// 		Datas.splice(i,1);
			// 		return false;
			// 	}
			// });
		}
		$li.remove();
		selectTrashArticle(index);
		$('#trashNum').html($('.tArticle-list').find('li').length);
	} else {
		alert(data.msg);
	}
}

function dialog(txt,cancelFn,confirmFn){
	var tpl=`<div class="dialog-wrap">
		<div class="dialog">
				<div class="txt-wrap">
					<p>${txt}</p>
				</div>
				<div class="btn-wrap">
					<button class="cancel">取消</button>
					<button class="confirm">确定</button>
				</div>
			</div>
		</div>`;
	var $elem=$(tpl);
	$(document.body).append($elem);
	$elem.find('.cancel').on('click',function(){
		cancelFn.call($elem);
	});
	$elem.find('.confirm').on('click',function(){
		confirmFn.call($elem);
	});
}

function showCommonDialog(txt,fn){
	dialog(txt,function(){
		this.remove();
	},fn);
}
function redirectLogin(){
	location.href='/sign?returnUrl='+encodeURIComponent(location.pathname+location.search+location.hash);
}
	/***************************
    			初始化
    ****************************/
    var App = new Controller();
    $(window).on('hashchange', function(e) {
        App.selectHash(location.hash.replace('#', ''));
    });
    App.selectHash(location.hash.substr(1));

    function getDatas(params,cb){
    	$.get('/getUserArticles?_t='+Math.random(),params).done(function(data){
			if(data.status==1){
				redirectLogin();
			} else if(data.status==0){
				cb(data.list);
			}
	    });
    }

	codeMirror.on("change", function(){
		dataHash[selectArticleId].content=simplemde.value();
		var $selectLi=$('.article-list').find(`[data-articleId=${selectArticleId}]`);
		$selectLi.find('.word-count').html(`字数：${simplemde.wordCount()}`);
		var desc=getContentSummary(simplemde.value()||'');
		$selectLi.find('.desc').html(desc);
		var $elem=$('#outline');
		if($elem.hasClass('active')){
			renderOutline($elem);
		}
	});

	$('#title').on(changeEvent,function(){
		var val=$(this).val()||'';
		dataHash[selectArticleId].title=val;
		$('.article-list').find(`[data-articleId=${selectArticleId}]`).find('a').html(val);
	});

	// 展示大纲
	$('[data-tag=outline]').on('click',function(e){
		$elem=$('#outline');
		$(this).toggleClass('active');
		$elem.toggleClass('active');
		if($elem.hasClass('active')){
			renderOutline($elem);
		}
	});
	//大纲导航
	$('#outline').on('click','li',function(e){
		var top=this.oTop,
			$preview=$('.editor-preview');
		codeMirror.scrollTo(0, top);

		if($preview&&$preview.css('display')=='block'){
			var	scrollInfo=codeMirror.getScrollInfo(),
			ratio = parseFloat(scrollInfo.top) / (scrollInfo.height - scrollInfo.clientHeight),
			move = ($preview[0].scrollHeight - $preview[0].clientHeight) * ratio;
			$preview.scrollTop(move);
		}
	});

	//展示大纲
	function renderOutline($elem){
		var index=0,
			li=null,
			pattren=new RegExp('^\\s*?([\\#]{1,6})\\s+(.*\\S)$'),
			top=0,
			fragment=document.createDocumentFragment();
		codeMirror.eachLine(function(line){
			if(pattren.test(line.text.trim())){
				li=document.createElement('li');
				li.className=`h${RegExp.$1.length}`;
				li.innerHTML = RegExp.$2;
				li.oTop=codeMirror.heightAtLine(index)+codeMirror.getScrollInfo().top;
				if(index==0){top=li.oTop; }
				li.oTop-=top;
				// console.log(li.oTop);
				// console.log(top);
				fragment.appendChild(li);
			}
			
			index++;
			// top+=line.height;
		});
		$elem.find('ul').empty().append(fragment);
	}
	$('[data-tag=download]').on('click',function(e){
		if(!selectArticleId)return;
		location.href='/downloadFile?id='+selectArticleId;
	});
	// 上传文件
	$('[data-tag=upload]').on('click',function(e){
		var fileElem=document.createElement('input');
		fileElem.setAttribute('type','file');
		$(fileElem).on('change',uploadFile);
		fileElem.click();
	});

	//读取文件内容
    function uploadFile(e){
        var file=e.target.files[0],
            fileSize=file.size,
            fileType=file.type,
            reader;

        $(this).remove();
        if(!window.FileReader) {
        	alert('您的浏览器不支持上传哦！');
        	return;
        }
        if(!/text|json|xml/.test(fileType)){//只能文本类型
            alert('只能上传文本内容！');
            return;
        } 
        if(fileSize>1024*1024*5){//不能大于5M
            alert('您上传的文件太大了，不能超过5M哦！');
            return;
        }

    	reader = new FileReader();
        reader.onloadend=function(e){
        	simplemde.value(e.target.result);
        	simplemde.focus();
        };
        reader.readAsText(file);
    };
    // 保存
    $('[data-tag=save]').on('click',function(){
    	saveFn(function(data){
    		if(data.status==0){
    			showSucc(data.msg);
    		} else {
    			showError(data.msg);
    		}
    	})
    });
    // 发布
    $('.main [data-tag=publish]').on('click',publishFn);
    $('#articleMenu').on('click','[data-tag=publish]',publishFn);
    $('#articleMenu').on('click','[data-tag=delete]',deleteFn);

    function publishFn(){
    	if(!dataHash[selectArticleId].is_save){saveFn(); }
    	$.get('/publish',{articleId:selectArticleId,isPublish:dataHash[selectArticleId].is_publish}).done(function(data){
    		if(data.status==1){
				redirectLogin();
			} else if(data.status==0){
	    		dataHash[selectArticleId].is_publish=data.isPublish;
	    		setPublishStatus(dataHash[selectArticleId]);
	    		if(data.isPublish==1){
	    			$('[data-tag=publish]').attr('class','hover fa fa-remove no-disable').html(' 取消发布');
	    		}
			}
    	});
    }

    function deleteFn(){
    	$.get('/delete?_t='+Math.random(),{articleId:selectArticleId,isDelete:dataHash[selectArticleId].is_delete}).done(function(data){
    		$('#articleMenu').hide();
    		if(data.status==1){
    			redirectLogin();
    		} else if(data.status==0){
    			dataHash[selectArticleId].is_delete=data.isDelete;
    			var $elem=$('.article-list').find('[data-articleId='+selectArticleId+']'),
    			nextId=$elem.next().length?$elem.next().attr('data-articleId'):$elem.prev().length?$elem.prev().attr('data-articleId'):-1;
    			$elem.remove();
    			articleHash(nextId);
    		}
    	});
    }

    function saveFn(cb){
    	$('#loading').show();
    	dataHash[selectArticleId].is_save=true;
    	$.post('/saveArticle?_t='+Math.random(),{title:$('#title').val(),content:dataHash[selectArticleId].content,articleId:selectArticleId}).done(function(data){
    		if(data.status==1){
    			redirectLogin();
    		} else if(data.status==0){
    			$('#loading').hide();
    			cb&&cb(data);
    		}
    	});
    }

    function showError(txt){
    	showMsg('error',txt);
    }
    function showSucc(txt){
    	showMsg('succ',txt);
    }
    function showMsg(cls,txt){
    	var $elem=$('#msg');
    	$elem.html(txt)[0].className='msg show '+cls;
    	setTimeout(function() {
    		$elem.html('').removeClass('show');
    	}, 1500);
    }

    // 添加文章
    $('#addArticle,#tailAdd').on('click',function(){
    	var $list=$('.article-list'),
    		self=this;

		$.get('/createNew?_t='+Math.random()).done(function(data){
			if(data.status==1){
				redirectLogin();
			} else if(data.status==0){
				var article={
		    		id:data.insert_id,
		    		title:'无标题文章',
		    		content:'',
		    		summary:'',
		    		is_publish:0,
		    		is_delete:0,
		    		is_save:false,
		    		tags:[],
		    		update_date:new Date().getTime(),
		    		create_date:new Date().getTime()
		    	};
		    	var	liTemp=liTpl(article);
		    	// Datas.unshift(article);
		    	dataHash[article.id]=article;

				var $li=$(liTemp);
				if(self.id=='tailAdd'){
					$li.appendTo($list);
				} else {
					$li.prependTo($list);
				}
				articleHash(article.id);
			} else {
				alert(data.msg);
			}
		});
    });

    //文章操作弹出框
    $('.article-list').on('click','.set-article',function(e){
    	e.stopPropagation();
    	var self=$(this),
    		$menu=$('#articleMenu'),
    		top=self.offset().top,
    		scrollTop=$('.middle').scrollTop(),
    		html='<ul>';

    	if($menu.css('display')=='block'){
    		$menu.css('display','none');
    	} else {
    		article=dataHash[selectArticleId];
    		$menu.empty();

    		if(article.is_publish==0){
    			html+='<li data-tag="publish" class="can-hover"><i class="fa fa-mail-forward"></i> 直接发布</li>';
    		} else {
    			html+='<li><i class="fa fa-check"></i> 已经发布</li>';
    		}
    		html+='<li data-tag="history" class="can-hover"><i class="fa fa-clock-o"></i> 历史版本</li>';
    		html+='<li data-tag="delete" class="can-hover"><i class="fa fa-trash"></i> 删除文章</li></ul>';

	    	$menu.html(html).css({
	    		display:'block',
	    		top:(top+scrollTop+30)+'px'
	    	});
    	}
    });

    $('.main').on('mouseover','[data-tag=publish]',function(e){
    	var self=$(this);
    	if(self.hasClass('fa-check')){
    		self.attr('class','hover fa fa-remove no-disable').html(' 取消发布');
    	}
    });

    $('.main').on('mouseout','[data-tag=publish]',function(e){
    	var self=$(this);
    	if(self.hasClass('hover')){
    		self.attr('class','fa fa-check no-disable').html(' 已经发布');
    	}
    });

    //文章列表
    $('.article-list').on('click','li',function(e){
    	var id=$(this).attr('data-articleId');
    	articleHash(id);
    });

	function articleHash(id){
		App.selectHash('article/'+id);
	}

    function selectArticle(id){
    	var $li=$('.article-list').find('[data-articleId='+id+']');
    	if(!$li.length){
    		$('#title').val('');
    		simplemde.value('');
    		emptyTags();
    		return;
    	}
	    var	article=dataHash[id];

    	selectArticleId=id;
    	$li.addClass('active').siblings('.active').removeClass('active');
    	
    	if(!article){
    		$.get('/getArticle',{id:id}).done(function(data){
    			if(data.status==1){
    				redirectLogin();
    			} else if(data.status==0){
    				article=data.article;
    				setArticle(article);
    			}
    		});
    	} else {
	    	setArticle(article);
    	}

		// 设置编辑器高度
		$('.CodeMirror').height($(window).height()-$('.CodeMirror').offset().top-$('.editor-statusbar').outerHeight()-50);

		function setArticle(obj){
			title=obj.title||'无标题文章';
			content=obj.content||'';
			$li.find('a').html(title);
			$li.find('desc').html(content);
			$('#title').val(title);
			simplemde.value(content);

			setPublishStatus(obj);
			emptyTags();
			if(obj.tags.length){
				var html='';
				obj.tags.forEach(function(item,i){
					html+=`<li data-id="${item.tag_id}" data-name="${item.name}">${item.name} <i class="fa fa-remove"></i></li>`;
				});
				$('#tagList').prepend(html);
			}
		}

		function emptyTags(){
			$('#tagList').children('li').each(function(i,item){
				if(item.className=='input') return true;
				$(item).remove();
			});
		}
    }


    function setPublishStatus(article){
    	$('#articleMenu').hide();
    	var icon=$('[data-articleid='+selectArticleId+']').find('.file-type');
    	if(article.is_publish==0){
    		$('.main').find('[data-tag=publish]').attr({'title':'发布到前端','class':'fa fa-mail-forward no-disable'}).html(' 发布文章');
    		icon.attr('class','file-type fa fa-file');
    	} else {
    		$('.main').find('[data-tag=publish]').attr({'title':'取消发布','class':'fa fa-check no-disable'}).html(' 已经发布');
    		icon.attr('class','file-type fa fa-file is-publish');
    	}
    }

/**
 * html解码
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function htmlDecode (str){  
	if(!str) return '';
	return str.replace(/&amp;/g,"&")
		.replace(/&lt;/g,'<')
		.replace(/&gt;/g,'>')
		.replace(/&nbsp;/g,' ')
		.replace(/&#39;/g,'\'')
		.replace(/&quot;/g,'\"');
}

function getContentSummary(str,n){
	let replaceHtmlTags=str=>str.replace(/<\s*\/?\s*\w+[\S\s]*?>/g,''),//过滤掉html标签
	pattern=/^[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+/,
	ret='',count=0,m;
	str=replaceHtmlTags(htmlDecode(str));

	while(str.length){
		if((m=str.match(pattern))){//拉丁文字
			count++;
			ret+=m[0];
			str=str.substr(m[0].length);
		} else {
			if(str.charCodeAt(0)>=0x4E00){//中日韩文字
				count++;
			}
			ret+=str.charAt(0);
			str=str.substr(1);
		}
		if(count>n){
			ret+='...';
			break;
		}
	}
	return ret;	
}

/**
 * 标签下拉结果提示
 */
function Tag(){
	this.input=document.getElementById('tag');
	this.ul=document.getElementById('suggest');
	this.lis=[];
	this.tags=[];
	this.index=-1;
	this.bindEvent();
}
Tag.prototype={
	bindEvent:function(){
		var self=this;
		$(self.input).on(changeEvent,function(event){
			if(this.value){
				self.showList(this.value);
			} else {
				self.ul.style.display='';
			}
		});
		self.ul.addEventListener('mouseover',function(event){
			event=event||window.event;
			var target=event.target||event.srcElement;
			if(target.nodeName=='LI'){
				self.index=target.index;
				self.activeLi();
			}
		});
		self.ul.addEventListener('mousedown',function(event){
			event=event||window.event;
			var target=event.target||event.srcElement;
			if(target.nodeName=='LI'){
				self.ul.style.display='';
				var val=$(self.input).val().trim();
				if(val){
					self.appendTag(val);
				}

			}
		});
		document.addEventListener('keydown', function(event) {
			event=event||window.event;
			var val=$(self.input).val().trim();
			if(!val)return;
			if(event.keyCode==13){//回车
				self.ul.style.display='';
				self.appendTag(val);
			}
			if(!self.lis.length){return;}
			if(event.keyCode==38){//向上
				if(self.index<0) return;
				self.index--;
				self.activeLi();
			}else if(event.keyCode==40){//向下
				if(self.index>=self.lis.length-1) return;
				self.index++;
				self.activeLi();
			} else if(event.keyCode==8){//退格
				self.index=-1;
			}

			// console.log(event.keyCode);	
		});
	},
	showList:function(val){
		if(/^([\*\^\/\\\?\+\$\|]+)/.test(val)){
			val=val.replace(RegExp.$1,'');
		}
		var self=this,
		reg=new RegExp('^'+val),
		li=null;
		self.lis.length=0;
		self.tags.length=0;
		self.ul.innerHTML = '';
		self.index=-1;

		for(var v in Tags){
			if(reg.test(v)&&Tags[v].tags.indexOf(selectArticleId)<0){
				li=document.createElement('li');
				li.innerText=v;
				li.index=++self.index;
				self.ul.appendChild(li);
				self.lis.push(li);
				self.tags.push(v);
			}
		}

		if(self.lis.length){
			self.ul.style.display='block';
			if((self.index=self.tags.indexOf(val))>-1){
				self.activeLi();
			}
		}
	},
	activeLi:function(){
		var self=this;
		for (var i = 0; i < self.lis.length; i++) {
			self.lis[i].className='';
		};
		if(self.index<0) return;
		self.lis[self.index].className='active';
		self.input.value=self.lis[self.index].innerText;
	},
	appendTag:function (val){
		var self=this,obj=Tags[val];
		$(self.input).val('');
		if(obj&&obj.tags.indexOf(selectArticleId)>-1){return;}
		if(!obj){
			obj=Tags[val]={
				id:0,
				name:val,
				tags:[selectArticleId]
			};
		} else {
			obj.tags.push(selectArticleId);
		}
		$.get('/addTag',{name:val,articleId:selectArticleId,tagId:obj.id}).done(function(data){
			if(data.status==1){
				redirectLogin();
			} else if(data.status==0){
				Tags[val].id=data.tagId;
				$('.input').before(`<li data-id="${data.tagId}" data-name="${val}">${val} <i class="fa fa-remove"></i></li>`);
				dataHash[selectArticleId].tags.push({
					name:val,
					article_id:selectArticleId,
					tag_id:data.tagId
				});
			}
		});
	}
};

new Tag();

$('#tagList').on('click','i',function(){
	var $li=$(this).parent(),
		name=$li.attr('data-name'),
		obj=null,
		isDeleteTag=0,
		tagId=$li.attr('data-id');

	if((obj=Tags[name])){
		if(obj.tags.length==1){
			isDeleteTag=1;
			delete Tags[name];
		} else {
			obj.tags.splice(obj.tags.indexOf(selectArticleId),1);
		}
		$.get('/deleteTag?_t='+Math.random(),{articleId:selectArticleId,tagId:tagId,isDeleteTag:isDeleteTag}).done(function(data){
			if(data.status==1){
				redirectLogin();
			} else if(data.status==0){
				dataHash[selectArticleId].tags.forEach(function(item,i){
					if(item.tag_id==tagId){
						dataHash[selectArticleId].tags.splice(i,1);return false;
					}
				});
			}
		});
	}
	$li.remove();
});

/**
 * 拖拽上传
 */
//阻止浏览器默认行。 
$(document).on({ 
    dragleave:function(e){  //拖离 
        e.preventDefault(); 
    }, 
    drop:function(e){  //拖后放 
        e.preventDefault(); 
    }, 
    dragenter:function(e){  //拖进 
        e.preventDefault(); 
    }, 
    dragover:function(e){  //拖来拖去 
        e.preventDefault(); 
    } 
}); 
$('.CodeMirror-code')[0].addEventListener("drop",function(e){ 
    e.preventDefault(); //取消默认浏览器拖拽效果 
    if(!(e.dataTransfer&&e.dataTransfer.files)){
    	showError("浏览器不支持拖拽上传");
    	return false;
    }
    var files = e.dataTransfer.files; //获取文件对象 
    //检测是否是拖拽文件到页面的操作 
    if(files.length == 0){return false; }
    //检测文件是不是图片 
    if(files[0].type.indexOf('image') === -1){ 
        alert("您拖的不是图片！"); 
        return false; 
    } 
     
    //拖拉图片到浏览器，可以实现预览功能 
    // var url = window.URL.createObjectURL(files[0]); 
    var fileName = files[0].name; //图片名称 
    var sname=fileName.substr(0,fileName.lastIndexOf('.'));
    var fileSize = Math.floor((files[0].size)/1024);  
    if(fileSize>500){ 
        showError("上传大小不能超过500K."); 
        return false; 
    }

	var startPoint = codeMirror.getCursor("start");
	var endPoint = codeMirror.getCursor("end");
	var text = codeMirror.getLine(startPoint.line);
	var start = text.slice(0, startPoint.ch);
	var end = text.slice(startPoint.ch);
	var insert='!['+sname+'](http://)';
	startPoint.ch+=2;
	endPoint.ch+=sname.length;
	replaceRange(insert);

	if(!window.FileReader) {
		showError("浏览器不支持上传");
		return false;
	}
	var fr = new FileReader();
	//加载完成后显示图片
	fr.onloadend=function(e){
		$.post('/uploadFile',{data:e.target.result,name:fileName}).done(function(data){
			console.log(data);
			insert='!['+sname+']('+location.origin+data.src+')';
			replaceRange(insert);
		});
	};
    fr.readAsBinaryString(files[0]);

	function replaceRange(txt){
		codeMirror.replaceRange(start +txt+ end, {
			line: startPoint.line,
			ch: 0
		}, {
			line: startPoint.line,
			ch: 99999999999999
		});

		codeMirror.setSelection(startPoint, endPoint);
		codeMirror.focus();
	}
},false); 

