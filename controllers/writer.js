const articleDao = require('../daos/article');
const tagDao = require('../daos/tag');
const util = require('../common/util');
const marked = require('marked');
const hl = require('highlight.js');
const log = require('../common/logger').logger();

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  highlight: function(code) {
    return hl.highlightAuto(code).value;
  },
});

/**
 * return writer page
 * 编辑器页面
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.writer = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    return ctx.redirect('/sign?returnUrl=' + decodeURIComponent('/writer'));
  }
  let user_id = ctx.session.user.id;
  let tags = await tagDao.getTagsByUser(user_id);
  // let articles=await articleDao.getArticleByUserId(user_id);
  // for(let [i,obj] of articles.entries()){
  // 	obj.tags=tags.filter(tag=>tag.article_id=obj.id);
  // 	obj.summary=util.getContentSummary(marked,obj.content,20);
  // 	obj.content=util.htmlDecode(obj.content);
  // }
  ctx.body = await ctx.render('writer', { tags: tags });
};

/**
 * delete tag
 * 删除标签
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.deleteTag = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  try {
    // let form=ctx.query,
    let form = ctx.request.body,
      user = ctx.session.user,
      tagRet;
    if (form.isDeleteTag == 1) {
      tagRet = await tagDao.deleteTag(form.tagId);
    }
    let ret = await tagDao.deleteTagArticle([user.id, form.articleId, form.tagId]);
    ctx.body = await {
      status: 0,
      tagId: form.tagId,
      msg: '删除标签成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      error: err,
      msg: '系统错误',
    };
  }
};

/**
 * add tag
 * 增加标签
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.addTag = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  try {
    // let form=ctx.query,
    let form = ctx.request.body,
      user = ctx.session.user,
      tagRet;

    if (form.tagId == 0) {
      tagRet = await tagDao.addTag(form.name);
      form.tagId = tagRet.insertId;
    }
    let ret = await tagDao.addTagArticle([user.id, form.articleId, form.tagId]);
    ctx.body = await {
      status: 0,
      tagId: form.tagId,
      msg: '添加标签成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      error: err,
      msg: '系统错误',
    };
  }
};
