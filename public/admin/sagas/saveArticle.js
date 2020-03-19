import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as requestTypes from '../constants/saveArticleType';
import * as articleTypes from '../constants/articleType';
import { redirectLogin, showLoading, hideLoading } from '../util';

// {articleId:'',title:'',content:''}
function save(param) {
  return new Promise((resolve, reject) => {
    showLoading();
    $.post('/saveArticle?_t=' + Math.random(), param).done(function(data) {
      hideLoading();
      if (data.status == 1) {
        redirectLogin();
      } else if (data.status == 0) {
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
}

export default function* saveArticle(action) {
  try {
    const data = yield call(save, action.param);
    yield put({ type: requestTypes.RECEIVE_SAVE_ARTICLE, data: data });
    yield put({ type: articleTypes.UPDATE_ARTICLE, article: action.param });
  } catch (error) {
    yield put({ type: requestTypes.REQUEST_SAVE_ERROR, err: error });
  }
}
