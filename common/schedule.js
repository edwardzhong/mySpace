const schedule = require('node-schedule');
const toolDao=require('../daos/tool');
const config = require('../config/app');
const log=require('./logger').logger();

/**
 * 定时任务
 */
exports.execute=function(){
	let jobs = schedule.scheduleJob(config.cron,function(){
		checkDelete();
	});
}

/**
 * 清除回收站状态的文章（超过一定天数）
 */
async function checkDelete(){
	let days=config.days;
	try{
		log.info('\s:check Delete',new Date());
		await toolDao.query(`delete from tag_article where article_id in(select id from article where datediff(now(),FROM_UNIXTIME(update_date))>=${days})`);
		await toolDao.query(`delete from article where datediff(now(),FROM_UNIXTIME(update_date))>=${days}`);
		await toolDao.query(`delete from tag where id not in (SELECT tag_id from tag_article)`);
	} catch(err){
		log.error(err);
	}
}