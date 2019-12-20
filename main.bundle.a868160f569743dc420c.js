/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/asserts/svg/add.svg":
/*!*********************************!*\
  !*** ./src/asserts/svg/add.svg ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2NTcyOTE2OTkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0NjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTE2MCA2NEMxMDcuMjY0IDY0IDY0IDEwNy4yNjQgNjQgMTYwdjY0MGMwIDUyLjczNiA0My4yNjQgOTYgOTYgOTZoNjQwYzUyLjczNiAwIDk2LTQzLjI2NCA5Ni05NnYtNjQwYzAtNTIuNzM2LTQzLjI2NC05Ni05Ni05NnogbTAgNjRoNjQwYzE3Ljk4NCAwIDMyIDE0LjAxNiAzMiAzMnY2NDBjMCAxNy45ODQtMTQuMDE2IDMyLTMyIDMyaC02NDBhMzEuNjE2IDMxLjYxNiAwIDAgMS0zMi0zMnYtNjQwYzAtMTcuOTg0IDE0LjAxNi0zMiAzMi0zMnpNNDQ4IDI1NnYxOTJIMjU2djY0aDE5MnYxOTJoNjRWNTEyaDE5MlY0NDhINTEyVjI1NnoiIGZpbGw9IiNjZGNkY2QiIHAtaWQ9IjI0NjgiPjwvcGF0aD48L3N2Zz4=");

/***/ }),

/***/ "./src/asserts/svg/heart.svg":
/*!***********************************!*\
  !*** ./src/asserts/svg/heart.svg ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2NjM4NzIyODU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg0NjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTEwMDAgMjQ4UTk3Ni45OTIgMTkyIDkzMy45ODQgMTQ4Ljk5MiA4NDkuOTg0IDY0IDczMi45OTIgNjRxLTY0IDAtMTIxLjUwNCAyOFQ1MTIgMTcxLjAwOHEtNDIuMDE2LTUxLjAwOC05OS40ODgtNzkuMDA4VDI5MS4wMDggNjRRMTc0LjAxNiA2NCA5MC4wMTYgMTUwLjAxNiA0Ny4wMDggMTkzLjAyNCAyNCAyNDkuMDI0LTAuOTkyIDMwOC4wMzIgMCAzNzEuMDRxMC45OTIgNjguOTkyIDI4Ljk5MiAxMzAuNDk2dDc5LjAwOCAxMDQuNTEycTQuOTkyIDQgOC45OTIgOCAxNC4wMTYgMTIgMTEyLjk5MiAxMDIuMDE2IDIwOCAxOTEuMDA4IDI1Ni45OTIgMjM1LjAwOCAxMS4wMDggOC45OTIgMjQuOTkyIDguOTkydDI0Ljk5Mi04Ljk5MnEzMi45OTItMzAuMDE2IDE4MC45OTItMTY0Ljk5MiAxNTguMDE2LTE0NCAxOTYtMTc5LjAwOCA1Mi00My4wMDggODAuOTkyLTEwNC45OTJ0MjguOTkyLTEzMnEwLTY0LTI0LTEyMi4wMTZ6IiBwLWlkPSI4NDYyIiBmaWxsPSIjZTIwMDAwIj48L3BhdGg+PC9zdmc+");

/***/ }),

/***/ "./src/js/advance-config.js":
/*!**********************************!*\
  !*** ./src/js/advance-config.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/js/consts.js");

/* harmony default export */ __webpack_exports__["default"] = (function (conofigJson, callback) {
  if (window.APP.isDialogOpen) return;
  var tpl = "\n    <div>\n      <div>\n        <label style=\"vertical-align: top;\">\u914D\u7F6E\u6587\u4EF6\uFF1A</label>\n        <textarea class=\"advance-config-input\" style=\"width: 400px;height: 200px; padding: 10px;\">\n        ".concat(JSON.stringify(conofigJson, null, 2), "\n        </textarea>\n      </div>\n      <div style=\"margin-top: 10px\">\n        <label style=\"vertical-align: top;\">\u5728\u7EBF\u5DE5\u5177\uFF1A</label>\n        <span style=\"margin-right: 10px\">\n          <a href=\"http://bejson.com\" style=\"color: #666;\" target=\"_blank\" rel=\"nofollow\">\u5728\u7EBFJSON\u683C\u5F0F\u5316\u6821\u9A8C</a>\n        </span>\n        <span style=\"margin-right: 10px\">\n          <a href=\"https://sm.ms\" style=\"color: #666;\" target=\"_blank\" rel=\"nofollow\">\u514D\u8D39\u56FE\u5E8A</a>\n        </span>\n        <span style=\"margin-right: 10px\">\n          <a href=\"https://gist.github.com/\" style=\"color: #666;\" target=\"_blank\" rel=\"nofollow\">\u524D\u5F80Gist\u4FDD\u5B58\u672C\u914D\u7F6E</a>\n        </span>\n      </div>\n      <div style=\"margin-top: 10px\">\n        <label style=\"vertical-align: top;\">\u5FEB\u6377\u64CD\u4F5C\uFF1A</label>\n        <span style=\"margin-right: 10px\">\n          <a href=\"javascript:;\" class=\"j-clear-custom\" style=\"color: #666;\" rel=\"nofollow\">\u8FD8\u539F\u9ED8\u8BA4(\u6E05\u7A7A\u81EA\u5B9A\u4E49\u7F51\u5740)</a>\n        </span>\n      </div>\n    </div>\n  ");
  var d = dialog({
    title: '  ',
    width: 500,
    skin: 'dialog-advance-config dialog-common',
    content: tpl,
    statusbar: '<div class="dialog-error hide">Error</div>',
    okValue: '确定',
    onshow: function onshow() {
      $('body').on('click', '.j-clear-custom', function () {
        localStorage.removeItem(_consts__WEBPACK_IMPORTED_MODULE_0__["default"].STORAGE_NAME);
        location.reload();
      });
    },
    onclose: function onclose() {
      window.APP.isDialogOpen = false;
    },
    ok: function ok() {
      var content = $('.dialog-advance-config .advance-config-input').val().trim();

      var showError = function showError(msg) {
        var $error = $('.dialog-common .dialog-error');
        $error.html(msg).removeClass('hide');
        setTimeout(function () {
          $error.html('').addClass('hide');
        }, 3000);
      };

      var json;

      try {
        json = JSON.parse(content);
      } catch (err) {
        showError('输入的JSON格式有误');
        return false;
      }

      callback && callback(json);
    }
  });
  d.show();
  window.APP.isDialogOpen = true;
});

/***/ }),

/***/ "./src/js/baidusug.js":
/*!****************************!*\
  !*** ./src/js/baidusug.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
 *
 */
function BaiduSug(domId, config) {
  this.domId = domId;
  this.domInput = document.getElementById(domId);
  this.config = config;
  this.resultClassName = 'baidu-sug-result-' + Date.now(); // uid

  this.currentLiIndex = -1;
  this.isMovingCursor = false;

  this.debounce = function (fun, delay) {
    return function (args) {
      var that = this;
      var _args = args;
      clearTimeout(fun.id);
      fun.id = setTimeout(function () {
        fun.call(that, _args);
      }, delay);
    };
  };

  this.getSearchText = function () {
    return document.getElementById(this.domId).value.trim();
  };

  this.loadScript = function (url) {
    var script = document.createElement('script');
    var uid = 'script_' + Date.now;

    script.onload = function () {
      document.getElementById(uid).remove();
    };

    script.src = url;
    script.id = uid;
    document.body.appendChild(script);
  };

  this.debounceSearchSuggest = function () {
    var self = this;
    return this.debounce(function () {
      // 移动光标操作，不要进行后续搜索
      if (self.isMovingCursor) {
        self.isMovingCursor = false;
        return;
      }

      var searchText = self.getSearchText();
      var t = Date.now();
      self.loadScript('https://www.baidu.com/su?cb=BaiduSuggestionCB&t=' + t + '&wd=' + searchText);
    }, 400);
  };

  this.showResult = function (result, config) {
    this.currentLiIndex = -1; // showResult会重新生成内容，所以要重置 LiIndex

    var self = this;
    var resultLen = result.length;
    var domInput = this.domInput;
    var domWidth = domInput.offsetWidth;
    var defaultClassName = this.resultClassName;
    var resultDom = document.querySelector('.' + this.resultClassName);

    function createLayer(config) {
      var div = document.createElement('div');
      div.className = config.className ? config.className + ' ' + defaultClassName : defaultClassName;
      div.style = ['width: ' + (config.width ? config.width : domWidth) + 'px', 'position: absolute', 'left: 0', 'top: 100%', 'transform:' + 'translateX(' + (config.xOffset || 0) + 'px)' + ' translateY(' + (config.yOffset || 0) + 'px)', 'background: ' + (config.background ? config.background : '#fff'), 'z-index: ' + (config.zIndex ? config.zIndex : '999'), 'box-shadow: ' + (config.shadow ? config.shadow : '1px 1px 3px rgba(0, 0, 0, .1)'), 'border: ' + (config.border ? config.border : '1px solid #ddd')].join(';');
      domInput.parentNode.appendChild(div);
      return div;
    }

    function getResultContent(result) {
      var ul = ['<ul style="list-style:none;cursor:default;">'];

      for (var i = 0; i < resultLen; i++) {
        ul.push('<li data-i="' + i + '">' + result[i] + '</li>');
      }

      ul.push('</ul>');
      return ul.join('');
    }

    if (resultDom) {
      resultDom.innerHTML = getResultContent(result);
    } else {
      createLayer(config).innerHTML = getResultContent(result);
    }

    var lis = document.querySelectorAll('.' + this.resultClassName + ' li');

    var onMouseEnter = function onMouseEnter(e) {
      var i = e.target.getAttribute('data-i');
      self.setCurrentLi(i, true);
    };

    var onClick = function onClick(e) {
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

  this.clearResult = function () {
    var resultDom = document.querySelector('.' + this.resultClassName);
    if (resultDom) resultDom.remove();
  }; // 添加全局样式


  this.addStyle = function () {
    var headStyle = document.createElement('style');
    var liSelector = '.' + this.resultClassName + ' li';
    var liStyle = ['height:30px', 'line-height:30px', 'padding:' + (config.liPadding ? config.liPadding : '0 6px'), 'color:' + (config.liColor ? config.liColor : '#000')].join(';');
    var headStyleContent = liSelector + '{' + liStyle + '}';
    headStyleContent += liSelector + '.current { background: #ccc; }';
    headStyle.innerHTML = headStyleContent;
    document.head.appendChild(headStyle);
  }; // 添加全局按键监听


  this.addKeydownListener = function () {
    var self = this;

    document.onkeydown = function (e) {
      if (e.keyCode === 27) {
        // esc
        self.clearResult();

        if (e.target.id === self.domId) {
          self.isMovingCursor = true; // esc 也要禁止后续搜索
        }
      }
    };
  };

  this.setCurrentLi = function (index, disableInputChange) {
    var resultLiDoms = document.querySelectorAll('.' + this.resultClassName + ' li');
    var currentLi = document.querySelector('.' + this.resultClassName + ' li.current');
    var resultLen = resultLiDoms.length;

    if (resultLen) {
      if (index < 0) index = resultLen + index;
      if (index > resultLen - 1) index = index - resultLen;
      if (currentLi) currentLi.classList.remove('current');
      resultLiDoms[index].classList.add('current'); // 是否只改变高亮状态，不改变输入内容

      if (!disableInputChange) {
        this.domInput.value = resultLiDoms[index].innerText;
        this.currentLiIndex = index;
      }
    }
  };

  this.onSubmit = function (text) {
    var cb = this.config.callback || function () {
      console.log('submit text: ' + text);
    };

    cb(text);
    this.domInput.blur();
  };

  this.init = function () {
    var self = this;

    window.BaiduSuggestionCB = function (res) {
      if (res && res.s && res.s.length) {
        self.showResult(res.s, self.config);
      } else {
        self.clearResult();
      }
    };

    if (this.domInput) {
      self.domInput.addEventListener('keyup', function (e) {
        // enter
        if (e.keyCode === 13) {
          self.currentLiIndex = -1;
          self.clearResult();
          self.onSubmit(self.getSearchText());
          self.isMovingCursor = true; // 回车也要禁止后续搜索
        } // up
        else if (e.keyCode === 38) {
            self.setCurrentLi(self.currentLiIndex - 1);
            self.isMovingCursor = true;
          } // down
          else if (e.keyCode === 40) {
              self.setCurrentLi(self.currentLiIndex + 1);
              self.isMovingCursor = true;
            } // left, right
            else if (e.keyCode === 37 || e.keyCode === 39) {
                self.isMovingCursor = true;
              }
      });
      self.domInput.addEventListener('keyup', this.debounceSearchSuggest());
      self.domInput.addEventListener('keydown', function (e) {
        if (e.keyCode === 38) e.preventDefault(); // 禁止方向上键移动光标到句首
      });
      self.domInput.addEventListener('focus', function (e) {
        e.target.select();
      });
      self.addStyle();
      self.addKeydownListener();
    }
  }; // start


  this.init();
}

/* harmony default export */ __webpack_exports__["default"] = (BaiduSug);

/***/ }),

/***/ "./src/js/common-dialog.js":
/*!*********************************!*\
  !*** ./src/js/common-dialog.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  confirm: function confirm(text, callback) {
    if (window.APP.isDialogOpen) return;
    var d = dialog({
      title: '  ',
      width: 300,
      skin: 'dialog-confirm dialog-common',
      content: "<div>".concat(text, "</div>"),
      cancelValue: '取消',
      cancel: function cancel() {},
      okValue: '确定',
      onclose: function onclose() {
        window.APP.isDialogOpen = false;
      },
      ok: function ok() {
        callback && callback();
      }
    });
    d.show();
  }
});

/***/ }),

/***/ "./src/js/consts.js":
/*!**************************!*\
  !*** ./src/js/consts.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var heartIcon = __webpack_require__(/*! ../asserts/svg/heart.svg */ "./src/asserts/svg/heart.svg").default;

/* harmony default export */ __webpack_exports__["default"] = ({
  CLASS_NAME_OF_ENGINES: 'engine-logo',
  ADD_SITE_TEXT: '添加网址',
  DEFAULT_ICON: heartIcon,
  STORAGE_NAME: 'nav_sites'
});

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _less_style_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../less/style.less */ "./src/less/style.less");
/* harmony import */ var _less_style_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_less_style_less__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _baidusug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./baidusug */ "./src/js/baidusug.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consts */ "./src/js/consts.js");
/* harmony import */ var _render_nav_list_by_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./render_nav_list_by_json */ "./src/js/render_nav_list_by_json.js");
/* harmony import */ var _render_side_category__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render_side_category */ "./src/js/render_side_category.js");
/* harmony import */ var _advance_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./advance-config */ "./src/js/advance-config.js");
/* harmony import */ var _common_dialog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common-dialog */ "./src/js/common-dialog.js");








var iconAdd = __webpack_require__(/*! ../asserts/svg/add.svg */ "./src/asserts/svg/add.svg").default;

window.APP = {
  currentEngine: "baidu",
  isDialogOpen: false,
  navContainer: null
};
var SearchEngineNameMap = {
  baidu: "百度",
  google: "Google",
  bing: "必应"
};
var SearchEngineUrlMap = {
  baidu: 'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://cn.bing.com/search?qs=n&form=QBRE&q='
};
$(document).ready(function () {
  var lastEngine = getLastEngine();
  window.APP.navContainer = document.querySelector('.nav');
  initStoredData();
  startEngineAnimation();
  onChangeSearchEngine(lastEngine || "");
  onTriggerSearrch();
  appendAddSiteIcon();
  initAddSiteFn();
  initDeleteable();
  initAdvanceConfig();
  initBaiduSug();
});

function initBaiduSug() {
  new _baidusug__WEBPACK_IMPORTED_MODULE_1__["default"]('searchInputEl', {
    className: 'hinote-search',
    border: '1px solid #ddd',
    xOffset: -1,
    callback: function callback(text) {
      $('#searchInputEl').val(text);
      $('#searchSubmitEl').trigger('click');
    }
  });
}

function initAdvanceConfig() {
  $('body').on('click', '.j-advance-config', function () {
    var configJson = getStoredData();
    if (!configJson) configJson = generateNavListJson();
    Object(_advance_config__WEBPACK_IMPORTED_MODULE_5__["default"])(configJson, function (newJson) {
      Object(_render_nav_list_by_json__WEBPACK_IMPORTED_MODULE_3__["default"])(newJson, APP.navContainer);
      handlerAfterRender(newJson);
    });
  });
} // 判断是否有本地存储的数据，读取出来展示


function initStoredData() {
  var json = getStoredData();

  if (json) {
    Object(_render_nav_list_by_json__WEBPACK_IMPORTED_MODULE_3__["default"])(json, APP.navContainer);
    handlerAfterRender();
  } else {
    json = generateNavListJson();
    Object(_render_side_category__WEBPACK_IMPORTED_MODULE_4__["default"])(json);
  }
} // 通过 dom class 获取搜索引擎名称


function getEngineNameByDom(dom) {
  if (!dom.classList) return;
  var classList = Array.from(dom.classList);
  return classList[1];
}

function stopEngineAnimation() {
  var $enginesParent = $(".search-engine");
  $enginesParent.removeClass("animate");
}

function startEngineAnimation() {
  var $enginesParent = $(".search-engine");
  $enginesParent.addClass("animate");
}

function storeLastEngine(engine) {
  window.APP.currentEngine = engine;
  localStorage.setItem("engine", engine);
}

function getLastEngine() {
  return localStorage.getItem("engine");
} // 切换搜索引擎


function onChangeSearchEngine(defaultEngine) {
  var $enginesParent = $(".search-engine");
  $("." + _consts__WEBPACK_IMPORTED_MODULE_2__["default"].CLASS_NAME_OF_ENGINES).on("click", function () {
    var $engines = $("." + _consts__WEBPACK_IMPORTED_MODULE_2__["default"].CLASS_NAME_OF_ENGINES); // 重新读取一次

    var $input = $(".search-input-el");
    var $this = $(this);
    var current = getEngineNameByDom($engines[0]);
    var target = getEngineNameByDom($this[0]);
    stopEngineAnimation();

    if (current !== target) {
      // 把target engine放到第一位
      $enginesParent.find("." + target).insertBefore($($engines[0]));
      $input.attr("placeholder", "".concat(SearchEngineNameMap[target], "\u641C\u7D22")).focus();
      storeLastEngine(target);
    }

    setTimeout(function () {
      startEngineAnimation();
    }, 500);
  });

  if (defaultEngine) {
    $(".".concat(defaultEngine)).trigger("click");
  }
} // 打开搜索结果页


function goSearch(text) {
  window.open(SearchEngineUrlMap[window.APP.currentEngine] + text);
}

function onTriggerSearrch() {
  var $input = $(".search-input-el");
  var $submit = $('#searchSubmitEl');
  $submit.on('click', function () {
    var text = $input.val();
    goSearch(text);
  });
} // 把已有的导航网站组装成JSON


function generateNavListJson(newSite) {
  var $blocks = $('.nav-block');
  var json = [];
  $blocks.each(function (i, block) {
    var title = $(block).find('h2').text();
    var category = $(block).attr('id');
    var sites = [];
    $(block).find('ul li').each(function (j, site) {
      var $site = $(site);
      var siteName = $site.text().trim();

      if (siteName !== _consts__WEBPACK_IMPORTED_MODULE_2__["default"].ADD_SITE_TEXT) {
        sites.push({
          name: siteName,
          url: $site.find('a').attr('href'),
          icon: $site.find('img').attr('src')
        });
      }
    });
    if (newSite && category === newSite.category) sites.push(newSite.info);
    json.push({
      title: title,
      category: category,
      sites: sites
    });
  });
  return Array.from(json);
} // 添加一个“添加网址”的icon


function appendAddSiteIcon() {
  var tpl = "\n    <li>\n      <a href=\"javascript:;\" class=\"j-add-site site-link\" rel=\"nofollow\">\n        <span class=\"img-container\">\n          <img src=\"".concat(iconAdd, "\" style=\"width: 90%;\" class=\"site-icon\">\n        </span>\n        <span class=\"site-name\">").concat(_consts__WEBPACK_IMPORTED_MODULE_2__["default"].ADD_SITE_TEXT, "</span>\n      </a>\n    </li>\n  ");
  $('.nav .nav-block ul').each(function (i, item) {
    var $lastLi = $(item).find('li:last-child');

    if ($lastLi.text().trim() !== _consts__WEBPACK_IMPORTED_MODULE_2__["default"].ADD_SITE_TEXT) {
      $(item).append(tpl);
    }
  });
}

function handlerAfterRender(json) {
  handleIconLoadError();
  appendAddSiteIcon();
  if (json) storeData(json);
}

function storeData(renderJson) {
  window.localStorage.setItem(_consts__WEBPACK_IMPORTED_MODULE_2__["default"].STORAGE_NAME, JSON.stringify(renderJson));
}

function getStoredData() {
  var data = localStorage.getItem(_consts__WEBPACK_IMPORTED_MODULE_2__["default"].STORAGE_NAME);
  var dataJson;

  if (data) {
    try {
      dataJson = JSON.parse(data);
    } catch (err) {
      console.error('error on parse STORAGE');
    }
  }

  return dataJson;
} // 点击“添加网址”的功能


function initAddSiteFn() {
  var addSiteDialogContent = "\n    <div class=\"add-site-dialog-content\">\n      <label>\n        <span>\u7AD9\u70B9\u540D\u79F0\uFF1A</span>\n        <input type=\"text\" class=\"ipt-site-name\" placeholder=\"\u6DD8\u5B9D\u7F51\">\n      </label>\n    </div>\n    <div class=\"add-site-dialog-content\">\n      <label>\n        <span>\u7AD9\u70B9\u7F51\u5740\uFF1A</span>\n        <input type=\"text\" class=\"ipt-site-url\" placeholder=\"https://www.taobao.com\">\n      </label>\n    </div>\n    <div class=\"add-site-dialog-content\">\n      <label>\n        <span>\u56FE\u6807\u94FE\u63A5\uFF1A</span>\n        <input type=\"text\" class=\"ipt-site-icon\" placeholder=\"\u9009\u586B: https://img.alicdn.com/xxx.png\">\n      </label>\n    </div>\n  ";
  $('body').on('click', '.j-add-site', function () {
    if (window.APP.isDialogOpen) return;
    var category = $(this).parents('.nav-block').attr('id');
    var d = dialog({
      title: '  ',
      width: 500,
      skin: 'dialog-add-site dialog-common',
      content: addSiteDialogContent,
      statusbar: '<div class="dialog-error hide">Error</div>',
      okValue: '确定',
      onclose: function onclose() {
        window.APP.isDialogOpen = false;
      },
      ok: function ok() {
        var newSite = {
          category: category,
          info: {
            name: $('.dialog-add-site .ipt-site-name').val().trim(),
            url: $('.dialog-add-site .ipt-site-url').val().trim(),
            icon: $('.dialog-add-site .ipt-site-icon').val().trim() || _consts__WEBPACK_IMPORTED_MODULE_2__["default"].DEFAULT_ICON
          }
        };

        var showError = function showError(msg) {
          var $error = $('.dialog-common .dialog-error');
          $error.html(msg).removeClass('hide');
          setTimeout(function () {
            $error.html('').addClass('hide');
          }, 3000);
        };

        if (!newSite.info.name) {
          showError('请填写站点名称');
          return false;
        }

        if (!newSite.info.url) {
          showError('请填写站点网址');
          return false;
        }

        var json = generateNavListJson(newSite);
        Object(_render_nav_list_by_json__WEBPACK_IMPORTED_MODULE_3__["default"])(json, APP.navContainer);
        handlerAfterRender(json);
      }
    });
    d.show();
    window.APP.isDialogOpen = true;
  });
}

function handleIconLoadError() {
  $('img.site-icon').on('error', function () {
    $(this).attr('src', _consts__WEBPACK_IMPORTED_MODULE_2__["default"].DEFAULT_ICON);
  });
}

function deleteSiteByCategoryIndex(json, category, index) {
  var categoryIndex = json.findIndex(function (obj) {
    return obj.category === category;
  });

  if (index > -1) {
    json[categoryIndex].sites.splice(index, 1);
  }

  return json;
}

function initDeleteable() {
  var timer;
  $('.nav').on('mouseenter', 'a.site-link', function () {
    var $this = $(this);
    timer = setTimeout(function () {
      $this.addClass('deleteable');
    }, 500);
  }).on('mouseleave', 'a.site-link', function () {
    clearTimeout(timer);
    $(this).removeClass('deleteable');
  }).on('click', 'i.del', function (e) {
    var _this = this;

    e.preventDefault();
    e.stopPropagation();
    _common_dialog__WEBPACK_IMPORTED_MODULE_6__["default"].confirm('确定要删除吗？', function () {
      var $li = $(_this).parents('li');
      var index = $li.index();
      var category = $(_this).parents('.nav-block').attr('id');
      var json = generateNavListJson();
      var newJson = deleteSiteByCategoryIndex(json, category, index);
      Object(_render_nav_list_by_json__WEBPACK_IMPORTED_MODULE_3__["default"])(newJson, APP.navContainer);
      handlerAfterRender(newJson);
    });
  });
}

/***/ }),

/***/ "./src/js/render_nav_list_by_json.js":
/*!*******************************************!*\
  !*** ./src/js/render_nav_list_by_json.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _render_side_category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render_side_category */ "./src/js/render_side_category.js");

/* harmony default export */ __webpack_exports__["default"] = (function (json, container) {
  // const tpl = `
  // <div id="navCommon" class="nav-block">
  //   <h2>常用网址</h2>
  //   <ul class="fn-clear">
  //     <li>
  //       <a href="https://weibo.com" class="site-link" target="_blank" rel="nofollow">
  //         <span class="img-container">
  //           <img src="<%= require('./src/asserts/images/weibo.png').default%>" alt="微博" class="site-icon">
  //         </span>
  //         <span class="site-name">微博</span>
  //         <i class="del"></i>
  //       </a>
  //     </li>
  //   </ul>
  // </div>
  // `;
  var tpl = '';
  json.forEach(function (obj) {
    tpl += "<div id=\"".concat(obj.category, "\" class=\"nav-block\">");
    tpl += "<h2>".concat(obj.title, "</h2>");
    tpl += "<ul class=\"fn-clear\">";
    Array.from(obj.sites).forEach(function (site) {
      tpl += "<li>";
      tpl += "<a href=\"".concat(site.url, "\" class=\"site-link\" target=\"_blank\" rel=\"nofollow\">");
      tpl += "<span class=\"img-container\">";
      tpl += "<img src=\"".concat(site.icon, "\" alt=\"").concat(site.name, "\" class=\"site-icon\">");
      tpl += "</span>";
      tpl += "<span class=\"site-name\">".concat(site.name, "</span>");
      tpl += "<i class=\"del\"></i>";
      tpl += "</a>";
      tpl += "</li>";
    });
    tpl += '</ul>';
    tpl += '</div>';
  });
  container.innerHTML = tpl;
  Object(_render_side_category__WEBPACK_IMPORTED_MODULE_0__["default"])(json);
});

/***/ }),

/***/ "./src/js/render_side_category.js":
/*!****************************************!*\
  !*** ./src/js/render_side_category.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return renderSideCategory; });
// 渲染侧边栏
function renderSideCategory(json) {
  // const tpl = `
  // <li><a href="#navCommon">常用网址</a></li>
  // `;
  var tpl = '';
  json.forEach(function (obj) {
    tpl += "<li><a href=\"#".concat(obj.category, "\">").concat(obj.title, "</a></li>");
  });
  var advanceConfigLi = $('.side .category li:last-child').prop('outerHTML');
  tpl += advanceConfigLi;
  $('.side .category').html(tpl);
}

/***/ }),

/***/ "./src/less/style.less":
/*!*****************************!*\
  !*** ./src/less/style.less ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=main.bundle.a868160f569743dc420c.js.map