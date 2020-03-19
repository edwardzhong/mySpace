import { combineReducers } from 'redux';
import list from './list';
import requestArticle from './requestArticle';
import setDeleteArticle from './setDeleteArticle';
import setPublishArticle from './setPublishArticle';
import createArticle from './createArticle';
import deleteArticle from './deleteArticle';
import saveArticle from './saveArticle';
import menuOption from './menuOption';

const rootReducer = combineReducers({
  list,
  requestArticle,
  setDeleteArticle,
  setPublishArticle,
  createArticle,
  deleteArticle,
  saveArticle,
  menuOption,
});

export default rootReducer;
