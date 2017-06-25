import * as types from '../constants/setPublishType';

const setPublishArticle=(state={
  isFetching:false,
  param:{},
  data:{}
},action) => {
  switch(action.type){
    case types.REQUEST_SETPUBLISH_ARTICLE:
      return Object.assign({},state,{
        isFetching:true,
        param:action.param
      });
    case types.RECEIVE_SETPUBLISH_ARTICLE:
      return Object.assign({},state,{
        isFetching:false,
        data:action.data
      });
    case types.REQUEST_SETPUBLISH_ERROR:
      return Object.assign({},state,{
        isFetching:false,
        err:action.err
      });
    default:return state;
  }
};

export default setPublishArticle;