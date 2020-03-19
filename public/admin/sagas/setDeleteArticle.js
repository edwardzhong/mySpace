import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as requestTypes from '../constants/setDeleteArticleType';
import * as articleTypes from '../constants/articleType';

// {articleId:'',isDelete:''}
function setDelete(param) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      url: '/delete?_t=' + Math.random(),
      data: param,
    }).done(function(data) {
      if (data.status == 1) {
        alert('no login');
      } else if (data.status == 0) {
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
}

export default function* setDeleteArticle(action) {
  try {
    const data = yield call(setDelete, action.param);
    yield put({ type: requestTypes.RECEIVE_SETDELETE_ARTICLE, data: data });
    yield put({ type: articleTypes.DELETE_ARTICLE, id: action.param.articleId });
  } catch (error) {
    yield put({ type: requestTypes.REQUEST_SETDELETE_ERROR, err: error });
  }
}
