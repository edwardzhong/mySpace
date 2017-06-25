import * as types from '../constants/articleType'

export function clearArticles(){
  return {
    type:types.CLEAR_ARTICLES
  }
}

export function addArticle(article) {
  return {
    type: types.ADD_ARTICLE,
    article
  }
}

export function deleteArticle(id) {
  return {
    type: types.DELETE_ARTICLE,
    id
  }
}


export function selectArticle(id) {
  return {
    type: types.SELECT_ARTICLE,
    id
  }
}


export function setPublishArticle(id) {
  return {
    type: types.SETPUBLISH_ARTICLE,
    id
  }
}

export function setDeleteArticle(id) {
  return {
    type: types.SETDELETE_ARTICLE,
    id
  }
}

export function updateArticle(article){
  return {
    type:types.UPDATE_ARTICLE,
    article,
  }
}

export function addArticleTag(tag){
  return {
    type:types.ADD_ARTICLE_TAG,
    tag
  }
}

export function deleteArticleTag(articleId,tagId){
  return {
    type:types.DELETE_ARTICLE_TAG,
    articleId,
    tagId
  }
}