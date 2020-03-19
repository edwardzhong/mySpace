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
 * home and article list(pagination)
 * 主页和文章列表（分页）
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.index = async function(ctx, next) {
  let listInfo = {
    index: parseInt(ctx.params.index, 10) || 1,
    size: 10,
    pages: 0,
    total: 0,
  };
  try {
    //调用分页存储过程
    let [rows, effects] = await articleDao.query(
      `call getpage('article','is_publish=1 and is_delete=0 order by id desc',${listInfo.index},${listInfo.size},@pages,@total)`,
    );
    if (rows.length) {
      await processRows(rows, listInfo);
    }
    ctx.body = await ctx.render('index', { list: rows, listInfo: listInfo, isLogin: ctx.session && ctx.session.user });
  } catch (err) {
    log.error(err);
    ctx.status = 500;
    ctx.statusText = 'Internal Server Error';
    ctx.res.end(err.message);
  }
};

/**
 * get article list by tagId(pagination)
 * 通过标签id获取文章列表（分页）
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.tag = async function(ctx, next) {
  let listInfo = {
    id: ctx.params.id,
    tagName: '',
    index: parseInt(ctx.params.index, 10) || 1,
    size: 10,
    pages: 0,
    total: 0,
  };
  if (!listInfo.id) return;
  try {
    // excute mysql procedure
    let [rows, effects] = await articleDao.query(
      `call getpage('article a join tag_article b on a.id=b.article_id','b.tag_id=${listInfo.id} and a.is_publish=1 and a.is_delete=0 order by a.id desc',${listInfo.index},${listInfo.size},@pages,@total)`,
    );
    if (rows.length) {
      await processRows(rows, listInfo);
    }
    ctx.body = await ctx.render('tag', { list: rows, listInfo: listInfo, isLogin: ctx.session && ctx.session.user });
  } catch (err) {
    log.error(err);
    ctx.status = 500;
    ctx.statusText = 'Internal Server Error';
    ctx.res.end(err.message);
  }
};

/**
 * process article list:add tags, Conversion time format, add pagination info
 * 处理文章列表：添加标签，转换时间格式，添加分页信息
 * @param  {[type]} rows [description]
 * @return {[type]}      [description]
 */
async function processRows(rows, listInfo) {
  await articleDao.query('select @pages as pages,@total as total');
  let [pageInfo] = await articleDao.query('select @pages as pages,@total as total');
  Object.assign(listInfo, pageInfo); //类似 JQ 的 extend 用法
  let ids = rows.map(row => row.id);
  let tags = await tagDao.getTagsByArticleId(ids.join(','));
  if (listInfo.id) {
    let selTag = tags.filter(tag => tag.id == listInfo.id);
    if (selTag.length) {
      listInfo.tagName = selTag[0].name;
    }
  }

  for (let [i, row] of rows.entries()) {
    row.create_date = util.soFarDateString(row.create_date);
    row.update_date = util.soFarDateString(row.update_date);
    row.content = util.getContentSummary(marked, row.content, 100);
    row.tags = tags.filter(tag => tag.article_id == row.id);
  }
}
