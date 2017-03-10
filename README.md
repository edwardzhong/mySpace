### 调试
node --harmony --inspect app

### 博客
#### 系统
1. 日志功能
2. 图片拖拽上传
3. md文件导入导出

#### 首页
1. 面包屑导航
2. 设置
> 阅读模式：白天/黑夜
> 关注 微博
> 关于我
3. 微博、github地址

#### 文章页
1. 面包屑导航
2. 分享到微博、微信
3. 评论功能

#### 关于我页面
1. 面包屑导航

#### 下一步计划
1. rss
2. 代码库
3. 图库
4. 歌单

#### 编辑器功能
1. 图片上传
2. 导入导出md文件 
<!-- 3. 大纲 -->


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