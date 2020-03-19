import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as requestTypes from '../constants/requestArticleType';
import * as setDeleteTypes from '../constants/setDeleteArticleType';
import * as setPublishTypes from '../constants/setPublishType';
import * as createArticleTypes from '../constants/createArticleType';
import * as deleteArticleTypes from '../constants/deleteArticleType';
import * as saveArticleTypes from '../constants/saveArticleType';
import loadArticles from './loadArticles';
import setDeleteArticle from './setDeleteArticle';
import setPublishArticle from './setPublishArticle';
import createArticle from './createArticle';
import deleteArticle from './deleteArticle';
import saveArticle from './saveArticle';

function* loadSagas() {
  yield takeEvery(requestTypes.REQUEST_ARTICLES, loadArticles);
  yield takeEvery(setDeleteTypes.REQUEST_SETDELETE_ARTICLE, setDeleteArticle);
  yield takeEvery(createArticleTypes.REQUEST_CREATE_ARTICLE, createArticle);
  yield takeEvery(deleteArticleTypes.REQUEST_DELETE_ARTICLE, deleteArticle);
  yield takeEvery(setPublishTypes.REQUEST_SETPUBLISH_ARTICLE, setPublishArticle);
  yield takeEvery(saveArticleTypes.REQUEST_SAVE_ARTICLE, saveArticle);
}

export default loadSagas;
