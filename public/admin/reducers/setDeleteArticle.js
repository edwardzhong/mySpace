import * as types from '../constants/setDeleteArticleType';

const setDeleteArticle = (
  state = {
    isFetching: false,
    param: {},
    data: {},
  },
  action,
) => {
  switch (action.type) {
    case types.REQUEST_SETDELETE_ARTICLE:
      return Object.assign({}, state, {
        isFetching: true,
        param: action.param,
      });
    case types.RECEIVE_SETDELETE_ARTICLE:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
      });
    case types.REQUEST_SETDELETE_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export default setDeleteArticle;
