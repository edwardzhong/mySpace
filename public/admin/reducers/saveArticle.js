import * as types from '../constants/saveArticleType';

const saveArticle=(state={
  isFetching:false,
  param:{},
  data:{}
},action) => {
  switch(action.type){
    case types.REQUEST_SAVE_ARTICLE:
      return Object.assign({},state,{
        isFetching:true,
        param:action.param
      });
    case types.RECEIVE_SAVE_ARTICLE:
      return Object.assign({},state,{
        isFetching:false,
        data:action.data
      });
    case types.REQUEST_SAVE_ERROR:
      return Object.assign({},state,{
        isFetching:false,
        err:action.err
      });
    default:return state;
  }
};

export default saveArticle;