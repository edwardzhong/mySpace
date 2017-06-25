### 启动项目(run project)

```
npm start (normal mode)
//正常启动，不带调试

npm run dev (debug mode)
//调试模式，使用chrome内置的inspector进行调试：node --harmony --inspect app 
```
### 单人博客(mySpace)
#### 系统
1. node的版本 v7.5.0
2. web框架koa2, 使用最新的 async/await 解决异步回调
3. 数据库mysql v5.6.22
4. 服务端模版引擎swig
5. 日志组件log4.js
6. 定时任务组件schedule.js

#### 前端
1. jquery
2. 兼容移动端
3. 预编辑器使用less
4. 图标使用font-awesome 4.7.0
5. simplemde编辑器，基于codeMirror的，markdown格式

#### 页面
1. 首页／文章列表页: /page/:index
2. 标签导航页: /tag/:id:/:index
3. 文章详情页: /article/:id
4. 登录／注册页: /sign
5. 后台编辑器页面: /writer
6. 数据库工具页面: /tool

#### 业务功能
1. 面包屑导航
2. 设置
> 阅读模式：白天/黑夜
> 关注 微博,github
3. 文章评论功能
4. 标签设置
5. markdown格式的编辑器

#### 编辑器功能
1. webapp 单页面方式
2. 图片拖拽上传
3. 导入导出markdown文件 
4. 大纲预览导航

#### 下一步计划
1. rss
2. 代码库
3. 图库

#### codemirror高度相关的api

``` javascript
simplemde.codemirror.eachLine(0,20,function(obj){console.log(obj);}) //遍历指定的行集合
simplemde.codemirror.getLineHandle(0) //指定行的信息
simplemde.codemirror.getScrollInfo() //编辑器高度位置信息
	// height:相当于scrollHeight
	// clientHeight:相当于clientHeight
	// top:相当于scrollTop 
simplemde.codemirror.lineCount() //共多少行
simplemde.codemirror.lastLine() //lineCount-1
simplemde.codemirror.lineAtHeight(300) //指定高度有多少行
simplemde.codemirror.heightAtLine(100) //指定行的高度 

$('.main').scrollTop(2613) //滚动到指定高度

var height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
var ratio = parseFloat(v.getScrollInfo().top) / height;
var move = (preview.scrollHeight - preview.clientHeight) * ratio;
preview.scrollTop = move;
```