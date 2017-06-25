import * as types from '../constants/saveArticleType'

export function requestSaveArticle(param) {
  return {
    type: types.REQUEST_SAVE_ARTICLE,
    param
  }
}

export function receiveSaveArticle(data) {
  return {
    type: types.RECEIVE_SAVE_ARTICLE,
    data
  }
}

export function requestSaveError(err){
  return {
    type:types.REQUEST_SAVE_ERROR,
    err
  }
}