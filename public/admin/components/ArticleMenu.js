import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ArticleMenu extends Component {
  setDelete(id, isDelete) {
    this.props.hideMenu();
    this.props.requestSetDeleteArticle({ articleId: id, isDelete: isDelete });
  }

  setPublish(id, isPublish) {
    this.props.hideMenu();
    this.props.requestSetPublishArticle({ articleId: id, isPublish: isPublish });
  }

  render() {
    const { menuOption } = this.props;
    const { article, show, arrowDown, top } = menuOption;
    return (
      <div id="articleMenu"
        className={arrowDown ? 'menu arrow-down' : 'menu'}
        style={{
          display: show ? 'block' : 'none',
          top: top + 'px',
        }}>
        {article ? (
          <ul>
            {article.is_publish == 0 ? (
              <li
                onClick={() => this.setPublish(article.id, article.is_publish)}
                data-tag="publish"
                className="can-hover">
                <i className="fa fa-mail-forward"></i> 直接发布
              </li>
            ) : (
              <li>
                <i className="fa fa-check"></i> 已经发布
              </li>
            )}
            <li data-tag="history" className="can-hover">
              <i className="fa fa-clock-o"></i> 历史版本
            </li>
            <li onClick={() => this.setDelete(article.id, article.is_delete)} data-tag="delete" className="can-hover">
              <i className="fa fa-trash"></i> 删除文章
            </li>
          </ul>
        ) : (
          <ul></ul>
        )}
      </div>
    );
  }
}

ArticleMenu.propTypes = {
  menuOption: PropTypes.object.isRequired,
  requestSetPublishArticle: PropTypes.func.isRequired,
  requestSetDeleteArticle: PropTypes.func.isRequired,
};

export default ArticleMenu;
