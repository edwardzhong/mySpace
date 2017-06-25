import * as types from '../constants/setPublishType'

export function requestSetPublishArticle(param) {
  return {
    type: types.REQUEST_SETPUBLISH_ARTICLE,
    param
  }
}

export function receiveSetPublishArticle(data) {
  return {
    type: types.RECEIVE_SETPUBLISH_ARTICLE,
    data
  }
}

export function requestSetPublishError(err){
  return {
    type:types.REQUEST_SETPUBLISH_ERROR,
    err
  }
}