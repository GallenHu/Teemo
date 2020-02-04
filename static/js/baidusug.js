/**
 * 百度搜索建议，百度搜索提示
 * 用法：new BaiduSug(domId, config)
 * BaiduSuggestionCB 为全局变量，用于搜索建议回调函数
 *
 * 支持的参数：
 * config.callback      选中结果回调函数
 * config.className     额外的class name
 * config.width
 * config.xOffset
 * config.yOffset
 * config.background
 * config.zIndex
 * config.shadow
 * config.border
 * config.liPadding
 * config.liColor
 * config.maxCount      显示的最多结果数量
 *
 */
function BaiduSug(domId, config) {
  this.domId = domId;
  this.domInput = document.getElementById(domId);
  this.config = config || {};
  this.config.maxCount = this.config.maxCount || 10;
  this.resultClassName = 'baidu-sug-result-' + Date.now(); // uid
  this.currentLiIndex = -1;
  this.isMovingCursor = false;

  this.debounce = function(fun, delay) {
    return function(args) {
      let that = this;
      let _args = args;
      clearTimeout(fun.id);
      fun.id = setTimeout(function() {
        fun.call(that, _args);
      }, delay);
    };
  };

  this.getSearchText = function() {
    return document.getElementById(this.domId).value.trim();
  };

  this.loadScript = function(url) {
    var script = document.createElement('script');
    var uid = 'script_' + Date.now;
    script.onload = function() {
      document.getElementById(uid).remove();
    };
    script.src = url;
    script.id = uid;
    document.body.appendChild(script);
  };

  this.debounceSearchSuggest = function() {
    var self = this;

    return this.debounce(function() {
      // 移动光标操作，不要进行后续搜索
      if (self.isMovingCursor) {
        self.isMovingCursor = false;
        return;
      }

      var searchText = self.getSearchText();
      var t = Date.now();

      self.loadScript(
        'https://www.baidu.com/su?cb=BaiduSuggestionCB&t=' +
          t +
          '&wd=' +
          searchText
      );
    }, 400);
  };

  this.showResult = function(result, config) {
    this.currentLiIndex = -1; // showResult会重新生成内容，所以要重置 LiIndex

    var self = this;
    var resultLen = result.length;
    var maxCount = config.maxCount;
    var domInput = this.domInput;
    var domWidth = domInput.offsetWidth;
    var defaultClassName = this.resultClassName;
    var resultDom = document.querySelector('.' + this.resultClassName);

    function createLayer(config) {
      var div = document.createElement('div');
      div.className = config.className
        ? config.className + ' ' + defaultClassName
        : defaultClassName;
      div.style = [
        'width: ' + (config.width ? config.width : domWidth) + 'px',
        'position: absolute',
        'left: 0',
        'top: 100%',
        'transform:' + 'translateX('+ (config.xOffset || 0) +'px)'
          + ' translateY('+ (config.yOffset || 0) +'px)',
        'background: ' + (config.background ? config.background : '#fff'),
        'z-index: ' + (config.zIndex ? config.zIndex : '999'),
        'box-shadow: ' +
          (config.shadow ? config.shadow : '1px 1px 3px rgba(0, 0, 0, .1)'),
        'border: ' + (config.border ? config.border : '1px solid #ddd')
      ].join(';');

      domInput.parentNode.appendChild(div);
      return div;
    }

    function getResultContent(result) {
      var ul = ['<ul style="list-style:none;cursor:default;padding:0">'];
      for (var i = 0; i < Math.min(resultLen, maxCount); i++) {
        ul.push('<li data-i="' + i + '">' + result[i] + '</li>');
      }
      ul.push('</ul>');
      return ul.join('');
    }

    if (resultDom) {
      resultDom.innerHTML = getResultContent(result);
    } else {
      createLayer(
        config
      ).innerHTML = getResultContent(result);
    }

    var lis = document.querySelectorAll('.' + this.resultClassName + ' li');
    var onMouseEnter = function(e) {
      var i = e.target.getAttribute('data-i');
      self.setCurrentLi(i, true);
    };
    var onClick = function(e) {
      self.onSubmit(e.target.innerText);
      self.currentLiIndex = -1;
      self.clearResult();
    };
    for (var i = 0; i < lis.length; i++) {
      lis[i].removeEventListener('mouseenter', onMouseEnter);
      lis[i].addEventListener('mouseenter', onMouseEnter);
      lis[i].addEventListener('click', onClick);
      lis[i].addEventListener('click', onClick);
    }
  };

  this.clearResult = function() {
    var resultDom = document.querySelector('.' + this.resultClassName);
    if (resultDom) resultDom.remove();
  };

  // 添加全局样式
  this.addStyle = function() {
    var headStyle = document.createElement('style');
    var liSelector = '.' + this.resultClassName + ' li';
    var liStyle = [
      'height:30px',
      'line-height:30px',
      'padding:' + (config.liPadding ? config.liPadding : '0 6px'),
      'color:' + (config.liColor ? config.liColor : '#000')
    ].join(';');
    var headStyleContent = liSelector + '{' + liStyle + '}';
    headStyleContent += liSelector + '.current { background: #ccc; }';

    headStyle.innerHTML = headStyleContent;
    document.head.appendChild(headStyle);
  };

  // 添加全局按键监听
  this.addKeydownListener = function () {
    var self = this;
    document.onkeydown = function (e) {
      if (e.keyCode === 27) { // esc
        self.clearResult();
        if (e.target.id === self.domId) {
          self.isMovingCursor = true; // esc 也要禁止后续搜索
        }
      }
    }
  }

  this.setCurrentLi = function(index, disableInputChange) {
    var resultLiDoms = document.querySelectorAll(
      '.' + this.resultClassName + ' li'
    );
    var currentLi = document.querySelector(
      '.' + this.resultClassName + ' li.current'
    );
    var resultLen = resultLiDoms.length;

    if (resultLen) {
      if (index < 0) index = resultLen + index;
      if (index > resultLen - 1) index = index - resultLen;

      if (currentLi) currentLi.classList.remove('current');
      resultLiDoms[index].classList.add('current');

      // 是否只改变高亮状态，不改变输入内容
      if (!disableInputChange) {
        this.domInput.value = resultLiDoms[index].innerText;
        this.currentLiIndex = index;
      }
    }
  };

  this.onSubmit = function(text) {
    var cb =
      this.config.callback ||
      function() {
        console.log('submit text: ' + text);
      };
    cb(text);
    this.domInput.blur();
  };

  this.init = function() {
    var self = this;

    window.BaiduSuggestionCB = function(res) {
      if (res && res.s && res.s.length) {
        self.showResult(res.s, self.config);
      } else {
        self.clearResult();
      }
    };

    if (this.domInput) {
      self.domInput.addEventListener('keyup', function(e) {
        // enter
        if (e.keyCode === 13) {
          self.currentLiIndex = -1;
          self.clearResult();
          self.onSubmit(self.getSearchText());
          self.isMovingCursor = true; // 回车也要禁止后续搜索
        }
        // up
        else if (e.keyCode === 38) {
          self.setCurrentLi(self.currentLiIndex - 1);
          self.isMovingCursor = true;
        }
        // down
        else if (e.keyCode === 40) {
          self.setCurrentLi(self.currentLiIndex + 1);
          self.isMovingCursor = true;
        }
        // left, right
        else if (e.keyCode === 37 || e.keyCode === 39) {
          self.isMovingCursor = true;
        }
      });

      self.domInput.addEventListener('keyup', this.debounceSearchSuggest());
      self.domInput.addEventListener('keydown', function(e) {
        if (e.keyCode === 38) e.preventDefault(); // 禁止方向上键移动光标到句首
      });
      self.domInput.addEventListener('focus', function(e) {
        e.target.select();
      });

      self.addStyle();
      self.addKeydownListener();
    }
  };

  // start
  this.init();
}
