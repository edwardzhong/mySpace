/**
 * page article 
 */
	let articleId=$('#articleId').val();
	let liTpl=(obj)=>`<li data-commentId="${obj.id}">
						<i class="fa fa-user-circle-o"></i>
						<div class="com-content">
							<h5 data-tag="nick">${obj.nick}</h5>
							<p>${obj.content}</p>
							<div class="com-footer">
								<time>${obj.time}</time>
								<span>
									<i data-tag="reply" class="fa fa-reply"> 回复</i>
									<!-- <i data-tag="praise" class="fa fa-thumbs-o-up"> 赞</i>-->
								</span>
							</div>
							<ul class="sub-list"></ul>
						</div>
					</li>`;
	let subTpl=(obj)=>`<li data-commentId="${obj.id}">
						<p><a data-tag="nick" href="javascript:;">${obj.nick}</a>:<a href="javascript:;">@${obj.reply_nick}</a> <span>${obj.content}</span></p>
						<div class="com-footer">
							<time>${obj.time}</time>
							<span> <i data-tag="reply" class="fa fa-reply"> 回复</i></span>
						</div>
					</li>`;

	$.get('/getComments?_t='+Math.random(),{id:articleId}).done(function(data){
		if(data.status==0){
			$('#listNum').html(data.len+'条评论');
			let html=[],li='',subLis='';
			data.list.reverse().forEach(function(row,i){
				li=$(liTpl(row));
				subLis='';
				if(row.subList.length){
					row.subList.forEach(function(obj,j){
						subLis+=subTpl(obj);
					});
				}
				li.find('.sub-list').html(subLis);
				html.push(li);
			});
			$('#commentList').html(html);
		}
	});

	$('#mainEditer').on('click','[data-tag]',async function(){
		let self=$(this),
			tag=self.attr('data-tag');
		if(tag=='cancel'){
			self.parent().hide();
		} else if(tag=='post'){
			postComment.call(self,function(data){
				let li=$(liTpl(data.comment));
				$('#commentList').prepend(li);
				// 执行动画
				let h=li.height();
				li.css({opacity:0,height:0});
				li.animate({height:h,opacity:1}, 500);
				setTimeout(function() {
					li.css({height:''});
				}, 510);
			});
		}
	});
	$('#mainEditer textarea').on('focus',function(){
		$(this).next('.comment-actions').show();
	});
	$('.comment-list').on('mouseover','.com-footer',function(){
		$(this).children('span').show();
	});
	$('.comment-list').on('mouseout','.com-footer',function(){
		$(this).children('span').hide();
	});

	$('#commentList').on('click','[data-tag]',function(e){
		e.stopPropagation();
		let self=$(this),
			tag=self.attr('data-tag'),
			li=self.parents('li');

		switch(tag){
			case 'cancel':self.parent().parent().remove();break;
			case 'post':
				let currBlock=self.parent().parent();
				postComment.call(self,function(data){
					let subLi=$(subTpl(data.comment))
					li.last().find('.sub-list').append(subLi);
					let h=subLi.height();
					subLi.css({opacity:0,height:0});
					subLi.animate({height:h,opacity:1}, 500);
					currBlock.remove();
				},currBlock.attr('data-commentId'));
				break;
			case 'reply':
				appendEditer.call(li,li.first().attr('data-commentId'),li.first().find('[data-tag=nick]').html());
				break;
			case 'praise':
				console.log('praise');
				break;
			default:break;
		}
	});

	function appendEditer(commentId,nick){
		let editer=this.find('.editer');
		editer.remove();
		if(editer.length&&editer.attr('data-commentId')==commentId) {return; }
		this.find('.com-content').append('<div class="editer" data-commentId='+commentId+'><input class="nick-input" type="text" placeholder="你的昵称"><textarea name="comment" data-tag="text" cols="80" rows="3" placeholder="@'+nick+'"></textarea> <div class="comment-actions"> <a data-tag="cancel" class="cancel-btn" href="javascript:;">取消</a> <a data-tag="post" class="post-btn" href="javascript:;">评论</a> </div> </div>');
	}

	function postComment(cb,replyId){
		let txtElem=this.parent().prev('textarea'),
			nickElem=txtElem.prev('input'),
			content=txtElem.val().trim(),
			nick=nickElem.val().trim();

		if(!nick){nickElem.focus();return; }
		if(!content){txtElem.focus();return;}
		let param={
			article_id:articleId,
			content:content,
			nick:nick
		};
		if(replyId){param.reply_id=replyId; }
		$.post('/postComment',param).done(function(data){
			if(data.status==0){
				nickElem.val('');
				txtElem.val('');
				cb&&cb(data);
			}
		});
	}

	