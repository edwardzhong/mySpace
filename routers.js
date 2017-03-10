const toolCtr=require('./controllers/tool');
const indexCtr=require('./controllers/index');
const userCtr=require('./controllers/user');
const articleCtr=require('./controllers/article');
const fileCtr=require('./controllers/file');
const writerCtr=require('./controllers/writer');

module.exports=function(router){
	router.get('/', indexCtr.index)
		.get('/about',async (ctx,next)=>{
			ctx.body=await ctx.render('about');
		})
		.get('/page/:index',indexCtr.index)
		.get('/tag/:id/:index',indexCtr.tag)
		.get('/article/:id',articleCtr.article)
		.get('/tool',async (ctx,next)=>{
			ctx.body = await ctx.render('tool',{title:'tool'});
		})
		.get('/sign',async ctx=>{
			ctx.body= await ctx.render('sign');
		})
		.get('/writer',writerCtr.writer)
		.post('/uploadFile',fileCtr.uploadFile)
		.get('/downloadFile',fileCtr.downloadFile)
		.get('/createNew',articleCtr.create)
		.get('/getArticle',articleCtr.getArticle)
		.get('/getUserArticles',articleCtr.getUserArticles)
		.post('/saveArticle',articleCtr.saveArticle)
		.get('/addTag',writerCtr.addTag)
		.get('/deleteTag',writerCtr.deleteTag)
		.get('/publish',articleCtr.setPublish)
		.get('/delete',articleCtr.setDelete)
		.get('/realDelete',articleCtr.realDelete)
		.post('/login',userCtr.login)
		.post('/register',userCtr.register)
		.post('/sql',toolCtr.query);

};