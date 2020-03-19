import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as requestTypes from '../constants/requestArticleType';
import * as articleTypes from '../constants/articleType';

export function fetchData(param) {
  return new Promise((resolve, reject) => {
    $.get('/getUserArticles?_t=' + Math.random(), param).done(function(data) {
      if (data.status == 1) {
        alert('no login');
      } else if (data.status == 0) {
        resolve(data);
      } else {
        reject(data);
      }
    });

    // return fetch('/getUserArticles?_t='+Math.random())
    //   .then(response => response.json())
    //   .then(json=>{
    //     if(json.ret==0){
    //       resolve(json);
    //     } else {
    //       reject(json);
    //     }
    //   })
    //   .catch(err=>{
    //     reject(err);
    //   });
  });
}

export default function* loadArticles(action) {
  try {
    const data = yield call(fetchData, action.param);
    yield put({ type: requestTypes.RECEIVE_ARTICLES, data: data });
    yield put({ type: articleTypes.ADD_ARTICLE, article: data.list });
  } catch (error) {
    yield put({ type: requestTypes.REQUEST_ERROR, err: error });
  }
}
