import * as types from '../constants/articleType'

const list = (state=[], action) => {
  switch (action.type) {
    case types.CLEAR_ARTICLES:
      return [];
    case types.ADD_ARTICLE: 
      if(Array.isArray(action.article)){
        return [...action.article,...state];
      } else {
        return [action.article,...state];
      }
    case types.DELETE_ARTICLE:
      // select next Article
      let len=state.length,
          index=state.findIndex((item, index)=> item.id==action.id);
      if(len>1){
        if(len-1>index){
          state[index+1].isSelect=true;
        } else {
          state[index-1].isSelect=true;
        }
      }

      return state.filter(item=>item.id!=action.id);
    case types.SELECT_ARTICLE:
      for(let [i,obj] of state.entries()){
        if(action.id==obj.id) obj.isSelect=true;
        else obj.isSelect=false;
      }
      return [...state];
    case types.SETPUBLISH_ARTICLE:
      for(let [i,obj] of state.entries()){
        if(action.id==obj.id) obj.is_publish=1-obj.is_publish;
      }
      return [...state];
    case types.SETDELETE_ARTICLE:
      for(let [i,obj] of state.entries()){
        if(action.id==obj.id) obj.is_delete=1-obj.is_delete;
      }
      return [...state];
    case types.UPDATE_ARTICLE:
      let i=state.findIndex(item => item.id==action.article.id);
      if(i>-1){
        Object.assign(state[i],action.article);
      }
      return [...state];
    case types.ADD_ARTICLE_TAG:
      let aArticles=state.filter(item=>item.id==action.tag.article_id);
      if(aArticles.length){
        aArticles[0].tags.push(action.tag);
      }
      return [...state];      
    case types.DELETE_ARTICLE_TAG:
      let dArticles=state.filter(item=>item.id==action.articleId);
      if(dArticles.length){
        let tIndex=dArticles[0].tags.findIndex(tag=>tag.tag_id==action.tagId);
        if(tIndex>-1){
          dArticles[0].tags.splice(tIndex,1);
        }
      }
      return [...state];
    default: return state;
  }
};

export default list;