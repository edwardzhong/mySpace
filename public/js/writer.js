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

	var Datas=[],
		dataHash={},
		selectArticleId='',
		changeEvent= 'oninput' in window?'input':'onpropertychange' in window?'propertychange':'keyup',
		liTpl = obj => `<li data-articleId="${obj.id}" class="active">
							<i class="set-article fa fa-gear"></i>
							<div>
								<i class="file-type fa fa-file ${obj.is_publish==1?'is-publish':''}"></i>
								<a href="javascript:;">${obj.title||'无标题文章'}</a>
								<p class="desc">${obj.summary}</p>
								<p class="word-count">字数：0</p>
							</div>
						</li>`;

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
				Datas.forEach(function(obj,i){
					dataHash[obj.id]=obj;
					if(obj.is_delete!=1){
						lis.push(liTpl(obj));
					}
				});
				if(lis.length){
					$('.article-list').html(lis.join(''));
				}
				$('.write-mode').show().siblings().hide();
    		}

    		if(!id){
    			li=$('.article-list').find('li').first();
    			if(li.length){
    				articleHash(li.attr('data-articleId'));
    			}
    		} else {
    			li=$('.article-list').find('[data-articleId='+id+']');
    			if(li.length){
    				selectArticle(id);
    			}
    		}
    	},
    	trash:function(hash){
    		$('.trash-mode').show().siblings().hide();
    	},
    	tags:function(hash){

    	}
    };

	/***************************
    			初始化
    ****************************/
    var App = new Controller();
    $(window).on('hashchange', function(e) {
        App.selectHash(location.hash.replace('#', ''));
    });

    $.get('/getUserArticles').done(function(data){
		if(data.status==1){
			location.href='/signIn?returnUrl=/writer';
		} else if(data.status==0){
			Datas=data.list;
			App.selectHash(location.hash.substr(1));
		}
    });

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
        };
        reader.readAsText(file);
    };
    // 保存
    $('[data-tag=save]').on('click',function(e){
    	$('#loading').show();
    	$.post('/saveArticle',{title:$('#title').val(),content:dataHash[selectArticleId].content,articleId:selectArticleId}).done(function(data){
    		$('#loading').hide();
    		if(data.status==0){
    			showSucc(data.msg);
    		} else {
    			showError(data.msg);
    		}
    	});
    });
    // 发布
    $('.main [data-tag=publish]').on('click',publishFn);
    $('#articleMenu').on('click','[data-tag=publish]',publishFn);
    $('#articleMenu').on('click','[data-tag=delete]',deleteFn);
    function publishFn(){
    	$.get('/publish',{articleId:selectArticleId,isPublish:dataHash[selectArticleId].is_publish}).done(function(data){
    		dataHash[selectArticleId].is_publish=data.isPublish;
    		setPublishStatus(dataHash[selectArticleId]);
    	});
    }

    function deleteFn(){
    	$.get('/delete',{articleId:selectArticleId,isDelete:dataHash[selectArticleId].is_delete}).done(function(data){
    		$('#articleMenu').hide();
    		dataHash[selectArticleId].is_delete=data.isDelete;
    		var $elem=$('.article-list').find('[data-articleId='+selectArticleId+']'),
    			nextId=$elem.next().length?$elem.next().attr('data-articleId'):$elem.prev().length?$elem.prev().attr('data-articleId'):-1;
    		$elem.remove();
    		articleHash(nextId);
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

		$.get('/createNew').done(function(data){
			if(data.status==0){
				var article={
		    		id:data.insert_id,
		    		title:'无标题文章',
		    		content:'',
		    		summary:'',
		    		is_publish:0,
		    		is_delete:0,
		    		tags:[]
		    	};
		    	var	liTemp=liTpl(article);
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
	    		article=data.article;
	    		setArticle(article);
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
			console.log(data);
			if(status==0){
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
		$.get('/deleteTag',{articleId:selectArticleId,tagId:tagId,isDeleteTag:isDeleteTag}).done(function(data){
			console.log(data);
			dataHash[selectArticleId].tags.forEach(function(item,i){
				if(item.tag_id==tagId){
					dataHash[selectArticleId].tags.splice(i,1);return false;
				}
			});
		});
	}
	$li.remove();
});