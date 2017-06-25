import * as types from '../constants/setDeleteArticleType'

export function requestSetDeleteArticle(param) {
  return {
    type: types.REQUEST_SETDELETE_ARTICLE,
    param
  }
}

export function receiveSetDeleteArticle(data) {
  return {
    type: types.RECEIVE_SETDELETE_ARTICLE,
    data
  }
}

export function requestSetDeleteError(err){
  return {
    type:types.REQUEST_SETDELETE_ERROR,
    err
  }
}