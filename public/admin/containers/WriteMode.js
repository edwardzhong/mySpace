import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ArticleList from '../components/ArticleList';
import ArticleMenu from '../components/ArticleMenu';
import ArticleEdit from '../components/ArticleEdit';
import * as requestActions from '../actions/requestArticleAction';
import * as articleActions from '../actions/articleAction';
import * as menuOptionActions from '../actions/menuOptionAction';
import * as setDeleteArticleAction from '../actions/setDeleteArticleAction';
import * as setPublishArticleAction from '../actions/setPublishArticleAction';
import * as createArticleActions from '../actions/createArticleAction';
import * as saveArticleActions from '../actions/saveArticleAction';

export class WriteMode extends Component {
  componentDidMount() {
    this.props.clearArticles();
    this.props.requestArticles({ is_delete: 0 });
  }

  createNewArticle() {
    this.props.requestCreateArticle();
    $('.article-list').scrollTop(0);
  }

  render() {
    const {
      match,
      list,
      menuOption,
      showMenu,
      hideMenu,
      selectArticle,
      updateArticle,
      requestSetDeleteArticle,
      requestSetPublishArticle,
      requestCreateArticle,
      requestSaveArticle,
      addArticleTag,
      deleteArticleTag,
    } = this.props;
    let selArticle = Object.assign(
      {},
      list.filter(item => item.isSelect)[0] || {
        id: -1,
        title: '无标题文章',
        content: '',
        is_publish: 0,
        tags: [],
      },
    );

    selArticle.aId = selArticle.id;
    delete selArticle.id;

    return (
      <div className="write-mode">
        <aside className="aside">
          <div className="btn-wrap">
            <a className="btn" href="/">
              回首页
            </a>
          </div>
          <ul className="notes-list">
            <li className="active">
              <a href="javascript:;">
                <i className="fa fa-book"></i> 文章
              </a>
            </li>
            <li>
              <Link to="/trash">
                <i className="fa fa-trash-o"></i> 回收站
              </Link>
            </li>
          </ul>
        </aside>
        <div className="middle">
          <a onClick={() => this.createNewArticle()} id="addArticle" href="javascript:;" className="add-article">
            <i className="fa fa-plus-circle"></i> 新建文章
          </a>
          <ArticleList
            list={list}
            selectArticle={selectArticle}
            showMenu={showMenu}
            hideMenu={hideMenu}
            menuOption={menuOption}
          />
          <ArticleMenu
            menuOption={menuOption}
            hideMenu={hideMenu}
            requestSetDeleteArticle={requestSetDeleteArticle}
            requestSetPublishArticle={requestSetPublishArticle}
          />
        </div>
        <div className="main">
          <ArticleEdit
            {...selArticle}
            updateArticle={updateArticle}
            requestSaveArticle={requestSaveArticle}
            requestSetPublishArticle={requestSetPublishArticle}
            addArticleTag={addArticleTag}
            deleteArticleTag={deleteArticleTag}
          />
          <div id="outline" className="outline" title="大纲">
            <h3>文章大纲</h3>
            <ul></ul>
          </div>
          <i id="loading" className="loading fa fa-spinner fa-pulse"></i>
          <div id="msg" className="msg">
            保存成功
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      list: state.list,
      menuOption: state.menuOption,
    };
  },
  dispatch => {
    return {
      updateArticle: article => dispatch(articleActions.updateArticle(article)),
      clearArticles: () => dispatch(articleActions.clearArticles()),
      requestArticles: param => dispatch(requestActions.requestArticles(param)),
      receiveArticles: data => dispatch(requestActions.receiveArticles(data)),
      requestError: err => dispatch(requestActions.requestError(err)),
      addArticle: article => dispatch(articleActions.addArticle(article)),
      deleteArticle: id => dispatch(articleActions.deleteArticle(id)),
      selectArticle: id => dispatch(articleActions.selectArticle(id)),
      setPublishArticle: id => dispatch(articleActions.setPublishArticle(id)),
      setDeleteArticle: id => dispatch(articleActions.setDeleteArticle(id)),
      hideMenu: () => dispatch(menuOptionActions.hideMenu()),
      showMenu: (article, arrowDown, top) => dispatch(menuOptionActions.showMenu(article, arrowDown, top)),
      requestSetDeleteArticle: param => dispatch(setDeleteArticleAction.requestSetDeleteArticle(param)),
      receiveSetDeleteArticle: data => dispatch(setDeleteArticleAction.receiveSetDeleteArticle(data)),
      requestSetDeleteError: err => dispatch(setDeleteArticleAction.requestSetDeleteError(err)),
      requestSetPublishArticle: param => dispatch(setPublishArticleAction.requestSetPublishArticle(param)),
      receiveSetPublishArticle: data => dispatch(setPublishArticleAction.receiveSetPublishArticle(data)),
      requestSetPublishError: err => dispatch(setPublishArticleAction.requestSetPublishError(err)),
      requestCreateArticle: () => dispatch(createArticleActions.requestCreateArticle()),
      receiveCreateArticle: data => dispatch(createArticleActions.receiveCreateArticle(data)),
      requestCreateError: err => dispatch(createArticleActions.requestCreateError(err)),
      requestSaveArticle: param => dispatch(saveArticleActions.requestSaveArticle(param)),
      receiveSaveArticle: data => dispatch(saveArticleActions.receiveSaveArticle(data)),
      requestSaveError: err => dispatch(saveArticleActions.requestSaveError(err)),
      addArticleTag: tag => dispatch(articleActions.addArticleTag(tag)),
      deleteArticleTag: (articleId, tagId) => dispatch(articleActions.deleteArticleTag(articleId, tagId)),
    };
  },
)(WriteMode);
