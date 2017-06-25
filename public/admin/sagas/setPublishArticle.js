import {call, put, takeEvery,takeLatest} from 'redux-saga/effects';
import * as requestTypes from '../constants/setPublishType'
import * as articleTypes from '../constants/articleType'

// {articleId:'',isPublish:''}
function setPublish(param){
 return new Promise((resolve,reject)=>{
   $.ajax({
     type:'PUT',
     dataType:'json',
     url:'/publish',
     data:param
   }).done(function(data){
     if(data.status==1){
       alert('no login');
     } else if(data.status==0){
        resolve(data);
     } else {
        reject(data);
     }
   });
 });
}

export default function* setPublishArticle(action) {
  try {
    const data = yield call(setPublish,action.param);
    yield put({type: requestTypes.RECEIVE_SETPUBLISH_ARTICLE, data:data});
    yield put({type: articleTypes.SETPUBLISH_ARTICLE, id:action.param.articleId})
  } catch (error) {
    yield put({type: requestTypes.REQUEST_SETPUBLISH_ERROR, err:error})
  }
}


