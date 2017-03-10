const articleDao=require('../daos/article');
const tagDao=require('../daos/tag');
const util=require('../common/util');
const marked = require('marked');
const hl=require('highlight.js');
const log=require('../logger').logger();

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks:true,
  highlight:function(code){return hl.highlightAuto(code).value; }
});

/**
 * 获取文章内容
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.article=async function(ctx,next){
	let articleId=ctx.params.id;
	if(!articleId)return;
	try{
		let [article]=await articleDao.getArticleById(articleId);
		let tags=await tagDao.getTagsByArticleId(articleId);
		if(article){
			article.content=marked(util.htmlDecode(article.content));
		}
		article.tags=tags;
		ctx.body=await ctx.render('article',{article:article,isLogin:ctx.session&&ctx.session.user});
	} catch(err){
		log.error(err);
        ctx.status = 500;
        ctx.statusText = 'Internal Server Error';
        ctx.res.end(err.message);
	}
};

/**
 * 获取插入的id
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.create=async function(ctx,next){
	if(!ctx.session||!ctx.session.user){
		ctx.body=await {
			status:1,
			msg:'未登录'
		};
		return;
	}
	let user=ctx.session.user;
	try{
		let ret=await articleDao.createNew({author_id:user.id});
		ctx.body=await {
			status:0,
			insert_id:ret.insertId,
			msg:'文章新增成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await{
			status:-1,
			error:err,
			msg:'系统错误'
		};
	}

};

/**
 * 根据文章id获取内容
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getArticle=async function(ctx,next){
	let articleId = ctx.query.id;
	if(!articleId) return;
	try{
		let [article]=await articleDao.getArticleById(articleId);
		let tags=await tagDao.getTagsByArticleId(articleId);
		if(article){
			article.content=util.htmlDecode(article.content);
		}
		article.tags=tags;
		ctx.body=await {
			status:0,
			article:article,
			msg:'获取成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await{
			status:-1,
			error:err,
			msg:'系统错误'
		};
	}
};

/**
 * 保存
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.saveArticle =async function(ctx,next){
	let form=ctx.request.body;
	if(!form) return;
	if(!ctx.session||!ctx.session.user){
		ctx.body=await {
			status:1,
			msg:'未登录'
		};
		return;
	}
	try{
		let ret=await articleDao.save([form.title,util.htmlEncode(form.content),form.articleId]);
		ctx.body=await{
			status:0,
			msg:'保存成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await{
			status:-1,
			error:err,
			msg:'系统错误'
		};
	}
};

/**
 * 获取用户的文章信息
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getUserArticles=async function(ctx,next){
	if(!ctx.session||!ctx.session.user){
		ctx.body=await {
			status:1,
			msg:'未登录'
		};
		return;
	}
	let user=ctx.session.user,
		form=ctx.query;
	try{
		let tags=await tagDao.getTagsByUser(user.id);
		let ret=await articleDao.getArticleByUserId([user.id,form.is_delete]);
		for(let [i,obj] of ret.entries()){
			obj.tags=tags.filter(tag=>tag.article_id==obj.id);
			obj.summary=util.getContentSummary(marked,obj.content,20);
			obj.content=util.htmlDecode(obj.content);
		}
		ctx.body=await{
			status:0,
			list:ret,
			msg:'获取成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await{
			status:-1,
			err:err,
			msg:'系统错误'
		};
	}

};

/**
 * 设置发布标志
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.setPublish=async function(ctx,next){
	if(!ctx.session||!ctx.session.user){
		ctx.body=await {
			status:1,
			msg:'未登录'
		};
		return;
	}
	let form=ctx.query,
		isPublish=parseInt(form.isPublish,10),
		articleId=parseInt(form.articleId,10),
		newPublish=1-isPublish;

	try{
		let ret=await articleDao.setPublish([newPublish,articleId]);
		ctx.body=await{
			status:0,
			isPublish:newPublish,
			msg:'设置成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await{
			status:0,
			isPublish:isPublish,
			msg:'设置失败',
			err:err
		};
	}
};

/**
 * 设置删除标志
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.setDelete=async function(ctx,next){
	if(!ctx.session||!ctx.session.user){
		ctx.body=await {
			status:1,
			msg:'未登录'
		};
		return;
	}
	let form=ctx.query,
		isDelete=parseInt(form.isDelete,10),
		articleId=parseInt(form.articleId,10),
		newDelete=1-isDelete;

	try{
		let ret=await articleDao.setDelete([newDelete,articleId]);
		ctx.body=await{
			status:0,
			isDelete:newDelete,
			msg:newDelete==1?'删除成功':'恢复成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await{
			status:0,
			isDelete:isDelete,
			msg:newDelete==1?'删除失败':'恢复失败',
			err:err
		};
	}
};

/**
 * 彻底删除
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.realDelete=async function(ctx,next){
	if(!ctx.session||!ctx.session.user){
		ctx.body=await {
			status:1,
			msg:'未登录'
		};
		return;
	}
	let form=ctx.query,
		user=ctx.session.user;
	try{
		await articleDao.realDelete(form.id);
		await tagDao.deleteTagArticleByArticleId([user.id,form.id]);
		await tagDao.deleteEmptyTag();
		ctx.body=await {
			status:0,
			msg:'删除成功'
		};
	} catch(err){
		log.error(err);
		ctx.body=await {
			status:0,
			msg:'删除失败',
			err:err
		};
	}
};
