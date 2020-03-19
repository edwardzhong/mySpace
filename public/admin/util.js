export function dialog(txt, cancelFn, confirmFn) {
  var tpl = `<div class="dialog-wrap">
			<div class="dialog">
				<div class="txt-wrap">
					<p>${txt}</p>
				</div>
				<div class="btn-wrap">
					<button class="cancel">取消</button>
					<button class="confirm">确定</button>
				</div>
			</div>
		</div>`;
  var $elem = $(tpl);
  $(document.body).append($elem);
  $elem.find('.cancel').on('click', function() {
    cancelFn.call($elem);
  });
  $elem.find('.confirm').on('click', function() {
    confirmFn.call($elem);
  });
}

export function showCommonDialog(txt, fn) {
  dialog(
    txt,
    function() {
      this.remove();
    },
    fn,
  );
}

export function redirectLogin() {
  location.href = '/sign?returnUrl=' + encodeURIComponent(location.pathname + location.search + location.hash);
}

export function showError(txt) {
  showMsg('error', txt);
}

export function showSucc(txt) {
  showMsg('succ', txt);
}

export function showMsg(cls, txt) {
  var $elem = $('#msg');
  $elem.html(txt)[0].className = 'msg show ' + cls;
  setTimeout(function() {
    $elem.html('').removeClass('show');
  }, 1500);
}

export function showLoading() {
  $('#loading').show();
}

export function hideLoading() {
  $('#loading').hide();
}

/**
 * html解码
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function htmlDecode(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

export function getContentSummary(str, n) {
  let replaceHtmlTags = str => str.replace(/<\s*\/?\s*\w+[\S\s]*?>/g, ''), //过滤掉html标签
    pattern = /^[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+/,
    ret = '',
    count = 0,
    m;
  str = replaceHtmlTags(htmlDecode(str));

  while (str.length) {
    if ((m = str.match(pattern))) {
      //拉丁文字
      count++;
      ret += m[0];
      str = str.substr(m[0].length);
    } else {
      if (str.charCodeAt(0) >= 0x4e00) {
        //中日韩文字
        count++;
      }
      ret += str.charAt(0);
      str = str.substr(1);
    }
    if (count > n) {
      ret += '...';
      break;
    }
  }
  return ret;
}

/**
 * Count the number of string
 * 计算字符串文字数量(拉丁中日韩字符)
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function wordCount(data) {
  var pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
  var m = data.match(pattern);
  var count = 0;
  if (m === null) return count;
  for (var i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}
