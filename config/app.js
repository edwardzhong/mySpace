/**
 * app config
 * @type {Object}
 */
module.exports={
	env:'produce',//develop mode/dev为开发模式
	port:3002,
	cron:'0 30 0 * * *',//It's triggered every day at zero thirty/每天的凌晨0点30分触发
	deleteDays:30
};