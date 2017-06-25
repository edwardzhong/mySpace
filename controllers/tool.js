// const toolDao=require('../daos/tool');
const log=require('../common/logger').logger();

/**
 * excute sql
 * 执行sql语句
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.query=async function (ctx,next){
	let form=ctx.request.body;
	try{
		let ret= await toolDao.query(form.cmd);
		ctx.body=await {
			status:0,
			ret:ret
		};
	} catch(err){
		log.error(err);
		ctx.body=await {
			status:-1,
			error:err,
			msg:'系统错误'
		};
	}

};