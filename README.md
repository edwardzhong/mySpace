start app
node --harmony --inspect app

编辑器功能
1.图片上传
2.导入导出md文件
3.导入导出html文件
4.自动保存 localstorage
5.大纲功能，可以预览和调换顺序


博客
一、首页功能
1.面包屑导航
2.侧边栏设置
    首页
    设置
       白天》黑夜
       字体选择
    关注
       微博
    关于我
3.微博、github

二、文章页面
1.面包屑导航
2.分享到微博、微信
3.评论功能

三、关于我页面
1.面包屑导航
2.评论功能

四、rss

图库
歌单
代码库


simplemde.codemirror.eachLine(0,20,function(obj){console.log(obj);}) 遍历指定的行集合
simplemde.codemirror.getLineHandle(0) 指定行的信息
simplemde.codemirror.getScrollInfo() 编辑器高度位置信息
	height:相当于scrollHeight
	clientHeight:相当于clientHeight
	top:相当于scrollTop 
simplemde.codemirror.lineCount() 共多少行
simplemde.codemirror.lastLine() lineCount-1
simplemde.codemirror.lineAtHeight(300) 指定高度有多少行
simplemde.codemirror.heightAtLine(100) 指定行的高度 

$('.main').scrollTop(2613) 滚动到指定高度

		var height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
		var ratio = parseFloat(v.getScrollInfo().top) / height;
		var move = (preview.scrollHeight - preview.clientHeight) * ratio;
		preview.scrollTop = move;