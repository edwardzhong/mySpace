const koa = require('koa');
const app = new koa();
const logger = require('koa-logger');
const server = require('koa-static');
const render = require('koa-swig');
const koaBody = require('koa-body');
const session = require('koa-session2');
const co = require('co');
const router = require('koa-router')();
const addRouters = require('./routers');
const appConfig = require('./config/app');
const favicon = require('koa-favicon');
const cluster = require('cluster');
const schedule = require('./common/schedule');
const log=require('./common/logger').logger();
const connectLog= require('./common/connectLog');

// 定时任务，只在主进程执行
if(cluster.isMaster) {
    schedule.execute();
}

// 显示访问连接记录
app.use(logger());
// 记录访问连接日志
app.use(connectLog());

// session
app.use(session({
	key:'sessionID',
	maxAge:1000*60*30
}));

// parse request请求信息
app.use(koaBody({ 
    jsonLimit:1024*1024*5,
    formLimit:1024*1024*5,
    textLimit:1024*1024*5,
    formidable: { uploadDir: __dirname + '/public/upload' } 
}));


// 设置静态目录
app.use(server(__dirname + '/public'));
// favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// 设置模版引擎
app.context.render = co.wrap(render({
    root: __dirname + (appConfig.env === 'dev'?'/views':'/dist_views'),
    cache: false, // disable, set to false
    autoescape: false,
    ext: 'html',
    writeBody: false //是否自动写入response的body中
}));


// 添加路由
addRouters(router);
app.use(router.routes())
    .use(router.allowedMethods());

// koa已经有默认的中间件onerror对错误进行了处理，注册其中的error事件
app.on('error', (err, ctx) => {
        // ctx.body=err;
        ctx.status = 500;
        ctx.statusText = 'Internal Server Error';
        log.error(err);
    if (appConfig.env === 'dev') { //dev环境错误抛出到前端
        ctx.res.end(err.message); //使用end结束输出
    }
});

// 处理404
app.use(async(ctx, next) => {
    ctx.status = 404;
    ctx.body = await ctx.render('404');
});

if (!module.parent) {
    //启动服务
    let port = appConfig.port || 3002;
    app.listen(port);
    log.info('app start');
    console.log('Running site at: http://localhost:%d', port);
}
