const toolDao=require('../daos/tool');

/**
 * 执行sql语句
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.query=async function (ctx,next){
	let form=ctx.request.body;
	let ret= await toolDao.query(form.cmd);
	ctx.body=await {
		status:0,
		ret:ret
	};
};