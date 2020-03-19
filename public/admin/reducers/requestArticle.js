import * as types from '../constants/requestArticleType';

const requestArticle = (
  state = {
    isFetching: false,
    param: {},
    data: {},
  },
  action,
) => {
  switch (action.type) {
    case types.REQUEST_ARTICLES:
      return Object.assign({}, state, {
        isFetching: true,
        param: action.param,
      });
    case types.RECEIVE_ARTICLES:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
      });
    case types.REQUEST_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export default requestArticle;
