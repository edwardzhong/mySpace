const toolCtr=require('./controllers/tool');
const indexCtr=require('./controllers/index');
const userCtr=require('./controllers/user');
const articleCtr=require('./controllers/article');
const fileCtr=require('./controllers/file');
const writerCtr=require('./controllers/writer');

module.exports=function(router){
	router.get('/', indexCtr.index)
		.get('/page/:index',indexCtr.index)
		.get('/tag/:id/:index',indexCtr.tag)
		.get('/article/:id',articleCtr.article)
		.get('/tool',async (ctx,next)=>{
			ctx.body = await ctx.render('tool',{title:'tool'});
		})
		.get('/sign',async ctx=>{
			ctx.body= await ctx.render('sign');
		})
		.get('/about',async (ctx,next)=>{
			ctx.body=await ctx.render('about');
		})
		.get('/writer',writerCtr.writer)
		.post('/addTag',writerCtr.addTag)
		.delete('/deleteTag',writerCtr.deleteTag)
		.post('/uploadFile',fileCtr.uploadFile)
		.get('/downloadFile',fileCtr.downloadFile)
		.get('/createNew',articleCtr.create)
		.get('/getArticle',articleCtr.getArticle)
		.get('/getUserArticles',articleCtr.getUserArticles)
		.post('/saveArticle',articleCtr.saveArticle)
		.put('/publish',articleCtr.setPublish)
		.put('/delete',articleCtr.setDelete)
		.delete('/realDelete',articleCtr.realDelete)
		.post('/postComment',articleCtr.postComment)
		.get('/getComments',articleCtr.getComments)
		.post('/login',userCtr.login)
		.post('/register',userCtr.register)
		.get('/sql',toolCtr.query);
};