import * as types from '../constants/createArticleType';

const createArticle=(state={
  isFetching:false,
  data:{}
},action) => {
  switch(action.type){
    case types.REQUEST_CREATE_ARTICLE:
      return Object.assign({},state,{
        isFetching:true
      });
    case types.RECEIVE_CREATE_ARTICLE:
      return Object.assign({},state,{
        isFetching:false,
        data:action.data
      });
    case types.REQUEST_CREATE_ERROR:
      return Object.assign({},state,{
        isFetching:false,
        err:action.err
      });
    default:return state;
  }
};

export default createArticle;