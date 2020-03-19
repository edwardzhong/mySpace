const articleDao = require('../daos/article');
const tagDao = require('../daos/tag');
const commentDao = require('../daos/comment');
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
 * return article page by article Id
 * 通过文章Id获取文章内容
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.article = async function(ctx, next) {
  let articleId = ctx.params.id;
  if (!articleId) return;
  try {
    let [article] = await articleDao.getArticleById(articleId);
    let tags = await tagDao.getTagsByArticleId(articleId);
    if (article) {
      article.content = marked(util.htmlDecode(article.content));
    }
    article.tags = tags;
    ctx.body = await ctx.render('article', { article: article, isLogin: ctx.session && ctx.session.user });
  } catch (err) {
    log.error(err);
    ctx.status = 500;
    ctx.statusText = 'Internal Server Error';
    ctx.res.end(err.message);
  }
};

/**
 * get the inserted id
 * 获取插入的id
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.create = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  let user = ctx.session.user;
  try {
    let ret = await articleDao.createNew({ author_id: user.id });
    ctx.body = await {
      status: 0,
      insert_id: ret.insertId,
      msg: '文章新增成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      err: err,
      msg: '系统错误',
    };
  }
};

/**
 * get article content by id
 * 通过文章id获取文章内容
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getArticle = async function(ctx, next) {
  let articleId = ctx.query.id;
  if (!articleId) return;
  try {
    let [article] = await articleDao.getArticleById(articleId);
    let tags = await tagDao.getTagsByArticleId(articleId);
    if (article) {
      article.content = util.htmlDecode(article.content);
    }
    article.tags = tags;
    ctx.body = await {
      status: 0,
      article: article,
      msg: '获取成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      err: err,
      msg: '系统错误',
    };
  }
};

/**
 * save article
 * 保存文章
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.saveArticle = async function(ctx, next) {
  let form = ctx.request.body;
  if (!form) return;
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  try {
    let ret = await articleDao.save([form.title, util.htmlEncode(form.content), form.articleId]);
    ctx.body = await {
      status: 0,
      msg: '保存成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      err: err,
      msg: '系统错误',
    };
  }
};

/**
 * get the article list by userId
 * 获取用户的文章信息
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getUserArticles = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  let user = ctx.session.user,
    form = ctx.query;
  try {
    let tags = await tagDao.getTagsByUser(user.id);
    let rows = await articleDao.getArticleByUserId([user.id, form.is_delete]);
    for (let [i, obj] of rows.entries()) {
      obj.tags = tags.filter(tag => tag.article_id == obj.id);
      obj.summary = util.getContentSummary(marked, obj.content, 20);
      obj.content = util.htmlDecode(obj.content);
      obj.words = util.wordCount(obj.content);
    }
    ctx.body = await {
      status: 0,
      list: rows,
      msg: '获取成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      err: err,
      msg: '系统错误',
    };
  }
};

/**
 * set the is_publish
 * 设置发布标志
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.setPublish = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  // let form=ctx.query,
  let form = ctx.request.body,
    isPublish = parseInt(form.isPublish, 10),
    articleId = parseInt(form.articleId, 10),
    newPublish = 1 - isPublish;

  try {
    let ret = await articleDao.setPublish([newPublish, articleId]);
    ctx.body = await {
      status: 0,
      isPublish: newPublish,
      msg: '设置成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      isPublish: isPublish,
      msg: '设置失败',
      err: err,
    };
  }
};

/**
 * set the is_delete
 * 设置删除标志
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.setDelete = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  let form = ctx.request.body,
    // let form=ctx.query,
    isDelete = parseInt(form.isDelete, 10),
    articleId = parseInt(form.articleId, 10),
    newDelete = 1 - isDelete;

  try {
    let ret = await articleDao.setDelete([newDelete, articleId]);
    ctx.body = await {
      status: 0,
      isDelete: newDelete,
      msg: newDelete == 1 ? '删除成功' : '恢复成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      isDelete: isDelete,
      msg: newDelete == 1 ? '删除失败' : '恢复失败',
      err: err,
    };
  }
};

/**
 * delete the article
 * 彻底删除
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.realDelete = async function(ctx, next) {
  if (!ctx.session || !ctx.session.user) {
    ctx.body = await {
      status: 1,
      msg: '未登录',
    };
    return;
  }
  // let form=ctx.query,
  let form = ctx.request.body,
    user = ctx.session.user;
  try {
    await articleDao.realDelete(form.id);
    await tagDao.deleteTagArticleByArticleId([user.id, form.id]);
    await tagDao.deleteEmptyTag();
    ctx.body = await {
      status: 0,
      msg: '删除成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      msg: '删除失败',
      err: err,
    };
  }
};

/**
 * add the comment
 * 添加评论
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.postComment = async function(ctx, next) {
  let form = ctx.request.body;
  try {
    let ret = await commentDao.create(form);
    form.id = ret.insertId;
    form.time = util.soFarDateString(new Date().getTime() / 1000 - 1);
    if (form.reply_id) {
      let [rComment] = await commentDao.getById(form.reply_id);
      form.reply_nick = rComment.nick;
    }

    ctx.body = await {
      status: 0,
      comment: form,
      msg: '评论成功',
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      msg: '评论失败',
      err: err,
    };
  }
};

/**
 * get the comment list
 * 获取评论列表
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getComments = async function(ctx, next) {
  let form = ctx.query;
  if (!form.id) {
    return;
  }
  try {
    let rows = await commentDao.getByArticleId(form.id);
    // 构建评论列表
    let list = [];
    for (let [i, row] of rows.entries()) {
      row.time = util.soFarDateString(row.create_date);
      if (!row.reply_id) {
        row.hash = {};
        row.hash[row.id] = true;
        row.subList = [];
        list.push(row);
      } else {
        let parent = list.filter(li => li.hash && li.hash[row.reply_id]);
        if (parent.length) {
          let prev = rows.filter(li => li.id == row.reply_id);
          if (prev.length) {
            row.reply_nick = prev[0].nick;
          }
          parent[0].subList.push(row);
          parent[0].hash[row.id] = true;
        }
      }
    }
    ctx.body = await {
      status: 0,
      msg: '获取评论成功',
      list: list,
      len: rows.length,
    };
  } catch (err) {
    log.error(err);
    ctx.body = await {
      status: -1,
      msg: '获取评论失败',
      err: err,
    };
  }
};
