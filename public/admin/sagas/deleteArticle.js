import {call, put, takeEvery,takeLatest} from 'redux-saga/effects';
import * as requestTypes from '../constants/deleteArticleType'
import * as articleTypes from '../constants/articleType'


//{id:''}
function deleteArticleById(param){
	return new Promise((resolve,reject)=>{
        $.ajax({
            type:'DELETE',
            dataType:'json',
            url:'/realDelete',
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

export default function* deleteArticle(action) {
  try {
    const data = yield call(deleteArticleById,action.param);
    yield put({type: requestTypes.RECEIVE_DELETE_ARTICLE, data:data});
	yield put({type: articleTypes.DELETE_ARTICLE,id:action.param.id});
  } catch (error) {
    yield put({type: requestTypes.REQUEST_DELETE_ERROR, err:error})
  }
}