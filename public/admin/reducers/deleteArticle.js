import * as types from '../constants/deleteArticleType';

const deleteArticle=(state={
  isFetching:false,
  param:{},
  data:{}
},action) => {
  switch(action.type){
    case types.REQUEST_DELETE_ARTICLE:
      return Object.assign({},state,{
        isFetching:true,
        param:action.param
      });
    case types.RECEIVE_DELETE_ARTICLE:
      return Object.assign({},state,{
        isFetching:false,
        data:action.data
      });
    case types.REQUEST_DELETE_ERROR:
      return Object.assign({},state,{
        isFetching:false,
        err:action.err
      });
    default:return state;
  }
};

export default deleteArticle;