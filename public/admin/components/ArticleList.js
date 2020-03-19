import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { htmlDecode } from '../util';

class ArticleList extends Component {
  showMenu(item, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.menuOption.show) {
      this.props.hideMenu();
      return false;
    }

    const top = $(e.target).offset().top;
    const wrapTop = $('.article-list')[0].clientHeight;
    let menuTop = top + 30;
    let arrowDown = false;
    if (wrapTop - top < 100) {
      menuTop = top - 138;
      arrowDown = true;
    }
    this.props.showMenu(item, arrowDown, menuTop);
  }

  selectArticle(id) {
    this.props.hideMenu();
    this.props.selectArticle(id);
    // location.hash='/write/'+id;
  }

  render() {
    const { list } = this.props;
    return (
      <div className="article-list">
        {list.map((item, index) => (
          <a
            key={index}
            onClick={() => this.selectArticle(item.id)}
            href="javascript:;"
            className={item.isSelect ? 'article-item active' : 'article-item'}>
            <i className="set-article fa fa-gear" onClick={e => this.showMenu(item, e)}></i>
            <div>
              <i className={item.is_publish == 1 ? 'file-type fa fa-file is-publish' : 'file-type fa fa-file'}></i>
              <p className="title">{item.title || '无标题文章'}</p>
              <p className="desc">{item.summary}</p>
              <p className="word-count">字数：{item.words || 0}</p>
            </div>
          </a>
        ))}
      </div>
    );
  }
}

ArticleList.propTypes = {
  list: PropTypes.array.isRequired,
  showMenu: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired,
  selectArticle: PropTypes.func.isRequired,
};

export default ArticleList;
