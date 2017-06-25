import * as types from '../constants/requestArticleType'

export function requestArticles(param) {
  return {
    type: types.REQUEST_ARTICLES,
    param
  }
}

export function receiveArticles(data) {
  return {
    type: types.RECEIVE_ARTICLES,
    data
  }
}

export function requestError(err){
  return {
    type:types.REQUEST_ERROR,
    err
  }
}