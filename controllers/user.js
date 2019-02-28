const userDao = require('../daos/user');
const crypto = require('crypto');
const log = require('../common/logger').logger();

/**
 * user login
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.login = async function (ctx, next) {
	try {
		let form = ctx.request.body;
		let users = await userDao.query({ email: form.email });
		let ret = { status: -1, msg: 'error' };

		if (!users.length) {
			ret.status = 1;
			ret.msg = '用户不存在';
		} else {
			const user = users[0];
			if (user.hash_password !== encryptPass(form.password, user.salt)) {
				ret.status = 2;
				ret.msg = '密码错误';
			} else {
				ret.status = 0;
				ret.msg = '登录成功';
			}
		}
		ctx.body = await ret;
	} catch (err) {
		log.error(err);
		ctx.body = await {
			status: -1,
			error: err,
			msg: '系统错误'
		};
	}
};

/**
 * user register
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.register = async function (ctx, next) {
	let form = ctx.request.body;
	try {
		form.salt = makeSalt();
		form.hash_password = encryptPass(form.password, form.salt);
		delete form.password;

		let result = await userDao.insert(form);
		ctx.body = await {
			status: 0,
			msg: '注册成功！',
			result: result
		}
	} catch (err) {
		log.error(err);
		ctx.body = await {
			status: -1,
			error: err,
			msg: '系统错误'
		};
	}
};

/**
 * user logout
 * 注销
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.logout = async function (ctx, next) {
	let form = ctx.request.body;
	ctx.session = null;
	ctx.state = null;
	ctx.body = await {
		status: 0,
		msg: '注销成功'
	}
};

// generate	 salt/生成salt
let makeSalt = () => Math.round((new Date().valueOf() * Math.random())) + '';

// generate md5/生成md5
let encryptPass = (pass, salt) => crypto.createHash('md5').update(pass + salt).digest('hex');