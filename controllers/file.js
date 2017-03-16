const articleDao=require('../daos/article');
const util=require('../common/util');
const log=require('../common/logger').logger();
const fs=require('fs');

/**
 * 图片上传
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.uploadFile=async function(ctx,next){
	let form=ctx.request.body;
	let fileName=form.name.substr(0,form.name.lastIndexOf('.'))+new Date().getTime();
	let extName=form.name.substr(form.name.lastIndexOf('.')+1);
	let filePath=__dirname.substr(0,__dirname.lastIndexOf('/'))+"/public/upload/"+fileName+'.'+extName;
	try{
		//同步写入上传文件夹
	    fs.writeFileSync(filePath, form.data, "binary", function(err){
	        if(err){log.error(err); }
	    });
	    ctx.body= await {
	    	status:0,
	    	src:'/upload/'+fileName+'.'+extName,
	    	ret:'success'
	    };
	} catch(err){
		ctx.body=await {
			status:-1,
			error:err,
			msg:'系统错误'
		};
	}
};

/**
 * 下载markdown
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.downloadFile=async function(ctx,next){
	let articleId = ctx.query.id;
	if(!articleId) return;
  	ctx.res.setHeader('Content-type', 'text/plain;charset=utf-8');
	try{
		let [article]=await articleDao.getArticleById(articleId);
		if(article){
			article.content=util.htmlDecode(article.content);
		}
		ctx.status = 200;
		ctx.res.setHeader('Content-disposition', 'attachment; filename=' + article.title+'.md');
  		ctx.res.write(article.content);
	} catch(err){
		log.error(err);
		ctx.res.setHeader('Content-disposition', 'attachment; filename=error.md');
  		ctx.res.write(err.message);
	}
	ctx.res.end();
}