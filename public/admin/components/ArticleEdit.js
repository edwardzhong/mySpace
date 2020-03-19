import React, { Component } from 'react';
import { is } from 'immutable';
import PropTypes from 'prop-types';
import { getContentSummary, wordCount, showSucc, showError, redirectLogin } from '../util';

class ArticleEdit extends Component {
  componentDidMount() {
    let self = this,
      changeEvent = 'oninput' in window ? 'input' : 'onpropertychange' in window ? 'propertychange' : 'keyup',
      simplemde = new SimpleMDE({
        element: this.refs.content,
        autoDownloadFontAwesome: false,
        renderingConfig: {
          //配置代码语法高亮
          singleLineBreaks: true,
          codeSyntaxHighlighting: true,
        },
        showIcons: ['code', 'table', 'undo', 'redo', 'save', 'upload', 'download', 'publish', 'outline'],
        hideIcons: ['guide'],
        spellChecker: false,
        placeholder: '这里填写文章内容...',
      }),
      codeMirror = simplemde.codemirror;

    this.simplemde = simplemde;
    this.codeMirror = codeMirror;

    // {articleId:'',title:'',content:''}
    // save
    $('[data-tag=save]').on('click', saveFn);

    //publish
    $('[data-tag=publish]')
      .on('click', function(e) {
        if (self.props.aId <= 0) {
          return;
        }
        self.props.requestSetPublishArticle({
          articleId: self.props.aId,
          isPublish: self.props.is_publish,
        });
      })
      .on('mouseover', function(e) {
        var that = $(this);
        if (self.props.is_publish == 1) {
          that.attr('class', 'hover fa fa-remove no-disable').html(' 取消发布');
        }
      })
      .on('mouseout', function(e) {
        var that = $(this);
        if (self.props.is_publish == 1) {
          that.attr('class', 'fa fa-check no-disable').html(' 已经发布');
        }
      });

    //download
    $('[data-tag=download]').on('click', function(e) {
      if (self.props.aId <= 0) {
        return;
      }
      location.href = '/downloadFile?id=' + self.props.aId;
    });
    // upload
    $('[data-tag=upload]').on('click', function(e) {
      var fileElem = document.createElement('input');
      fileElem.setAttribute('type', 'file');
      $(fileElem).on('change', uploadFile);
      fileElem.click();
    });

    //read the file content
    function uploadFile(e) {
      var file = e.target.files[0],
        fileSize = file.size,
        fileType = file.type,
        reader;

      $(this).remove();
      if (!window.FileReader) {
        alert('您的浏览器不支持上传哦！');
        return;
      }
      if (!/text|json|xml/.test(fileType)) {
        //只能文本类型
        alert('只能上传文本内容！');
        return;
      }
      if (fileSize > 1024 * 1024 * 5) {
        //不能大于5M
        alert('您上传的文件太大了，不能超过5M哦！');
        return;
      }

      reader = new FileReader();
      reader.onloadend = function(e) {
        simplemde.value(e.target.result);
        saveFn();
      };
      reader.readAsText(file);
    }

    function saveFn() {
      let val = simplemde.value();
      self.props.requestSaveArticle({
        id: self.props.aId,
        articleId: self.props.aId,
        title: self.refs.title.value,
        content: val,
        words: wordCount(val),
        summary: getContentSummary(val, 20),
      });
    }

    /**
     * 标签下拉结果提示
     */
    class Tag {
      input = $('#tag');
      ul = $('#suggest')[0];
      lis = [];
      tags = [];
      index = -1;

      bindEvent() {
        let that = this;
        that.input.on(changeEvent, function(event) {
          if (this.value) {
            that.showList(this.value);
          } else {
            that.ul.style.display = '';
          }
        });
        that.ul.addEventListener('mouseover', function(event) {
          event = event || window.event;
          let target = event.target || event.srcElement;
          if (target.nodeName == 'LI') {
            that.index = target.index;
            that.activeLi();
          }
        });
        that.ul.addEventListener('mousedown', function(event) {
          event = event || window.event;
          let target = event.target || event.srcElement;
          if (target.nodeName == 'LI') {
            that.ul.style.display = '';
            let val = that.input.val().trim();
            if (val) {
              that.appendTag(val);
            }
          }
        });
        document.addEventListener('keydown', function(event) {
          event = event || window.event;
          let val = that.input.val().trim();
          if (!val) return;
          if (event.keyCode == 13) {
            //回车
            that.ul.style.display = '';
            that.appendTag(val);
          }
          if (!that.lis.length) {
            return;
          }
          if (event.keyCode == 38) {
            //向上
            if (that.index < 0) return;
            that.index--;
            that.activeLi();
          } else if (event.keyCode == 40) {
            //向下
            if (that.index >= that.lis.length - 1) return;
            that.index++;
            that.activeLi();
          } else if (event.keyCode == 8) {
            //退格
            that.index = -1;
          }
        });
      }

      showList(val) {
        if (/^([\*\^\/\\\?\+\$\|]+)/.test(val)) {
          val = val.replace(RegExp.$1, '');
        }
        let that = this,
          reg = new RegExp('^' + val),
          li = null;
        that.lis.length = 0;
        that.tags.length = 0;
        that.ul.innerHTML = '';
        that.index = -1;

        for (let [key, item] of Object.entries(Tags)) {
          if (reg.test(key) && item.tags.indexOf(self.props.aId) < 0) {
            li = document.createElement('li');
            li.innerText = key;
            li.index = ++that.index;
            that.ul.appendChild(li);
            that.lis.push(li);
            that.tags.push(key);
          }
        }

        if (that.lis.length) {
          that.ul.style.display = 'block';
          if ((that.index = that.tags.indexOf(val)) > -1) {
            that.activeLi();
          }
        }
      }

      activeLi() {
        let that = this;
        for (let li of that.lis) {
          li.className = '';
        }
        if (that.index < 0) return;
        that.lis[that.index].className = 'active';
        that.input.val(that.lis[that.index].innerText);
      }

      appendTag(val) {
        let that = this,
          obj = Tags[val],
          id = self.props.aId;

        that.input.val('');
        // if curr article exist the tag,then break
        if (obj && obj.tags.indexOf(id) > -1) {
          return;
        }
        if (!obj) {
          obj = Tags[val] = {
            id: 0,
            name: val,
            tags: [id],
          };
        } else {
          obj.tags.push(id);
        }

        $.post('/addTag', { name: val, articleId: id, tagId: obj.id }).done(function(data) {
          if (data.status == 1) {
            redirectLogin();
          } else if (data.status == 0) {
            Tags[val].id = data.tagId;
            self.props.addArticleTag({
              article_id: id,
              tag_id: data.tagId,
              name: val,
            });
          }
        });
      }
    }

    let tag = new Tag();
    tag.bindEvent();
  }

  componentWillReceiveProps(nextProps) {
    this.simplemde.value(nextProps.content);
    if (nextProps.is_publish == 1) {
      $('[data-tag=publish]')
        .attr('class', 'fa fa-check no-disable')
        .html(' 已经发布');
    } else {
      $('[data-tag=publish]')
        .attr('class', 'fa fa-check no-disable')
        .html(' 开始发布');
    }
    $('.CodeMirror').height(
      $(window).height() - $('.CodeMirror').offset().top - $('.editor-statusbar').outerHeight() - 50,
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !(this.props === nextProps || is(this.props, nextProps)) ||
      !(this.state === nextState || is(this.state, nextState))
    );
  }

  changeTitle() {}

  deleteTag(articleId, tagId, tagName) {
    let self = this,
      obj = null,
      isDeleteTag = 0;
    if ((obj = Tags[tagName])) {
      if (obj.tags.length == 1) {
        isDeleteTag = 1;
        delete Tags[name];
      } else {
        obj.tags.splice(obj.tags.indexOf(articleId), 1);
      }

      $.ajax({
        type: 'DELETE',
        url: '/deleteTag?_t=' + Math.random(),
        dateType: 'json',
        data: { articleId: articleId, tagId: tagId, isDeleteTag: isDeleteTag },
      }).done(function(data) {
        if (data.status == 1) {
          redirectLogin();
        } else if (data.status == 0) {
          self.props.deleteArticleTag(articleId, tagId);
        }
      });
    }
  }

  render() {
    const { aId, title, content, tags } = this.props;
    return (
      <div>
        <div className="title-wrap">
          <input
            ref="title"
            className="title"
            type="text"
            name="title"
            id="title"
            onChange={this.changeTitle}
            value={title || '无标题文章'}
            placeholder="这是标题"
          />
        </div>
        <div className="tag-wrap">
          <i className="fa fa-tags"></i>
          <ul id="tagList">
            {tags.map((item, index) => (
              <li key={item.tag_id}>
                {item.name}&nbsp;
                <i className="fa fa-remove" onClick={() => this.deleteTag(aId, item.tag_id, item.name)}></i>
              </li>
            ))}
            <li className="input" key="999999">
              <input id="tag" className="tag-input" type="text" placeholder="添加标签" />
              <ul className="suggest" id="suggest"></ul>
            </li>
          </ul>
        </div>
        <textarea ref="content" name="article" id="article" cols="30" rows="10" className="text"></textarea>
      </div>
    );
  }
}

ArticleEdit.propTypes = {
  aId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  deleteArticleTag: PropTypes.func.isRequired,
  addArticleTag: PropTypes.func.isRequired,
};

export default ArticleEdit;
