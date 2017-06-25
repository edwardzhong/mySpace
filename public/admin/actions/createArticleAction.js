import * as types from '../constants/createArticleType'

export function requestCreateArticle(param) {
  return {
    type: types.REQUEST_CREATE_ARTICLE,
    param
  }
}

export function receiveCreateArticle(data) {
  return {
    type: types.RECEIVE_CREATE_ARTICLE,
    data
  }
}

export function requestCreateError(err){
  return {
    type:types.REQUEST_CREATE_ERROR,
    err
  }
}