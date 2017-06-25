import * as types from '../constants/deleteArticleType'

export function requestDeleteArticle(param) {
  return {
    type: types.REQUEST_DELETE_ARTICLE,
    param
  }
}

export function receiveDeleteArticle(data) {
  return {
    type: types.RECEIVE_DELETE_ARTICLE,
    data
  }
}

export function requestDeleteError(err){
  return {
    type:types.REQUEST_DELETE_ERROR,
    err
  }
}