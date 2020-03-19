import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as requestTypes from '../constants/createArticleType';
import * as articleTypes from '../constants/articleType';

// {articleId:'',isDelete:''}
function createNew() {
  return new Promise((resolve, reject) => {
    $.get('/createNew?_t=' + Math.random()).done(function(data) {
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

export default function* createArticle() {
  try {
    const data = yield call(createNew);
    yield put({ type: requestTypes.RECEIVE_CREATE_ARTICLE, data: data });
    yield put({
      type: articleTypes.ADD_ARTICLE,
      article: {
        id: data.insert_id,
        title: '无标题文章',
        content: '',
        summary: '',
        is_publish: 0,
        is_delete: 0,
        is_save: false,
        isSelect: true,
        tags: [],
        update_date: new Date().getTime(),
        create_date: new Date().getTime(),
      },
    });
    yield put({ type: articleTypes.SELECT_ARTICLE, id: data.insert_id });
  } catch (error) {
    yield put({ type: requestTypes.REQUEST_CREATE_ERROR, err: error });
  }
}
