import React ,{Component} from 'react'
import { connect } from 'react-redux'
import * as requestActions from '../actions/requestArticleAction'
import * as deleteArticleActions from '../actions/deleteArticleAction'
import * as setDeleteArticleActions from '../actions/setDeleteArticleAction'
import * as articleActions from '../actions/articleAction'
import TrashList from '../components/TrashList'
import TrashArticle from '../components/TrashArticle'
import {showCommonDialog} from '../util'

export class TrashMode extends Component{
	componentDidMount() {
		this.props.clearArticles();
		this.props.requestArticles({is_delete:1});
	}

	requestDeleteArticle(id,title){
		let self=this;
		if(id<0) return false;
		showCommonDialog(`确定彻底删除文章《${title}》？`,function(){
			self.props.requestDeleteArticle({id:id});
			this.remove();
		});
	}

	recoverArticle(id){
		if(id<0) return false;
		this.props.requestSetDeleteArticle({articleId:id,isDelete:1})
	}
	render(){
		const {list,selectArticle,recoverArticle}=this.props;
		let sel=list.filter((item)=>item.isSelect)[0]||{id:-1,title:'',content:''};
		return (
			<div className="trash-mode">
				<aside>
					<h2 className="title"><i className="fa fa-trash"></i> 回收站(<span id="trashNum">{list.length||0}</span>)</h2>
					<TrashList list={list} selectArticle={selectArticle} />
				</aside>
				<div className="main">
					<TrashArticle aId={sel.id} title={sel.title} content={sel.content} 
						recoverArticle={this.recoverArticle.bind(this)} 
						deleteArticle={this.requestDeleteArticle.bind(this)} 
					/>
				</div>
			</div>
		)
	}
}

export default connect(
  	(state) => {
  		return {
  			list:state.list
  		};
  	},
  	(dispatch) => { 
	  return {
	  	clearArticles:() => dispatch(articleActions.clearArticles()),
	  	requestArticles: (param) => dispatch(requestActions.requestArticles(param)),
	  	receiveArticles: (data) => dispatch(requestActions.receiveArticles(data)),
	  	requestError: (err) => dispatch(requestActions.requestError(err)),
	  	selectArticle:(id) => dispatch(articleActions.selectArticle(id)),
	  	setDeleteArticle:(id) => dispatch(articleActions.setDeleteArticle(id)),
	  	deleteArticle:(id) => dispatch(articleActions.deleteArticle(id)),
	  	requestDeleteArticle:(param) => dispatch(deleteArticleActions.requestDeleteArticle(param)),
	  	receiveDeleteArticle:(data) => dispatch(deleteArticleActions.receiveDeleteArticle(data)),
	  	requestDeleteError:(err) => dispatch(deleteArticleActions.requestDeleteError(err)),
	  	requestSetDeleteArticle:(param) => dispatch(setDeleteArticleActions.requestSetDeleteArticle(param)),
	  	receiveSetDeleteArticle:(data) => dispatch(setDeleteArticleActions.receiveSetDeleteArticle(data)),
	  	requestSetDeleteError:(err) => dispatch(setDeleteArticleActions.requestSetDeleteError(err))
	  };
	}
)(TrashMode);
