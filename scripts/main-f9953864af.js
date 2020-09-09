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

$(document).ready(() => {
  $('.engine-choose').click(function () {
    onClickEngine(
      $(this).attr('class').replace('engine-choose ', '').toLowerCase()
    );
  });
  $('.nav-toggle').click(onClickNavToggle);
  $('.nav-toggle').on('mouseenter', () => {
    if ($('.main-inner').hasClass('is-nav-shrink')) {
      onClickNavToggle();
    }
  });

  $('.search-form').on('submit', onSearchFormSubmit);
  initBaiduSug();
  onSiteIconError();
  onClickNav();
  initUserSites();
  initUserList();
  watchScroll();

  const lastEngine = getLastEngine() || '';
  const navShrink = getNavShrink() || '';
  if (lastEngine) {
    $(`.engine-choose.${lastEngine}`).trigger('click');
  }
  if (!navShrink) {
    $('.main-inner').removeClass('is-nav-shrink');
  }
});

function onClickEngine(engine) {
  $('.searcher-logo').attr('class', 'searcher-logo').addClass(engine);
  $('.engine-choose').removeClass('current');
  $(`.engine-choose.${engine}`).addClass('current');
  $('#searchInputEl').attr('placeholder', `${firstUpperCase(engine)} 搜索`);
  storeLastEngine(engine);
}

function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

function storeLastEngine(engine) {
  localStorage.setItem('engine', engine);
}

function getLastEngine() {
  return localStorage.getItem('engine');
}

function getNavShrink() {
  return localStorage.getItem('nav-shrink');
}

function onClickNavToggle() {
  if ($('.main-inner').hasClass('is-nav-shrink')) {
    localStorage.removeItem('nav-shrink');
  } else {
    localStorage.setItem('nav-shrink', '1');
  }
  $('.main-inner').toggleClass('is-nav-shrink');
}

function onSearchFormSubmit(e) {
  e.preventDefault();
  const text = $('#searchInputEl').val();
  const engine = $('.searcher-logo')
    .attr('class')
    .replace('searcher-logo ', '');
  goSearch(engine, text);
}

function initBaiduSug() {
  new BaiduSug('searchInputEl', {
    className: 'hinote-search',
    border: '1px solid #ddd',
    xOffset: -1,
    maxCount: 9,
    callback: function (text) {
      $('#searchInputEl').val(text);
      $('#searchSubmitEl').trigger('click');
    },
  });
}

function goSearch(engine, text) {
  const SearchEngineUrlMap = {
    baidu: 'http://img.hinpc.com/allso/#',
    google: 'https://www.google.com/search?q=',
    dogedoge: 'https://www.dogedoge.com/results?q=',
  };

  window.open(SearchEngineUrlMap[engine] + text);
}

function onSiteIconError() {
  const errImg = 'https://i.loli.net/2020/04/13/JHzefbqgFWTCIDi.png';
  $('.sites img').on('error', function () {
    $(this).off('error').attr('src', errImg);
  });
}

function onClickNav() {
  $('.nav ul').on('click', 'a', function (e) {
    e.preventDefault();
    const target = $(this).attr('href').replace('#', '');
    const top = $(`#category_${target}`)[0].offsetTop;
    $('.main-content')[0].scrollTop = top;
  });
}

function initUserSites() {
  const userSites = window.APP_CONFIG && window.APP_CONFIG.user_sites;
  if (userSites && userSites.length) {
    userSites.forEach((category) => {
      generateSiteSection(category.uid, category.alias, category.sites);
    });
  } else {
    console.warn('没有用户配置导航！');
  }
}

function generateSiteSection(categoryId, categoryName, sites) {
  const base = `
  <div class="sites-section">
  <h2 class="category" id="category_${categoryId}">
    <span>${categoryName}</span>
  </h2>
  <ul>`;

  const list = sites
    .map((s) => {
      return `
      <li>
        <a href="${s.url}" target="_blank" rel="noopener noreferrer">
          <img src="${s.icon}">
          <span>
            <span>${s.name}</span>
            <p>${s.desc || s.url}</p>
          </span>
        </a>
      </li>`;
    })
    .join('');

  const h = base + list + '</ul></div>';

  $('.main-content .sites').append(h);

  const nav = `
    <li>
      <a href="#${categoryId}">
        <span>${categoryName}</span>
      </a>
    </li>`;
  $('.nav ul').append(nav);
}

function initUserList() {
  let userList = getCookie('userlist')
  userList = userList? userList.split(',') : '';

  if (userList && userList.length) {
    const h = userList.map(u => {
      return `<a href="javascript:void 0">${u}</a>`;
    }).join('');
    $('.user-list').append(h).removeClass('hide');
  }

  $('.user-list').on('click', 'a', function () {
    const user = $(this).text().trim();
    document.cookie = `user=${user}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=` + location.host;
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function watchScroll() {
  const $scrollContainer = $('.main-content');
  const $topEl = $('.back-top');
  const scrollHeight = 270;

  window.isBackTopShow = false;

  $topEl.css({
    position: 'fixed',
    bottom: '50px',
    right: '100px',
    background: 'rgba(0,0,0,0.7)',
    width: '50px',
    height: '50px',
    textAlign: 'center',
    paddingTop: '5px',
    boxSizing: 'border-box'
  }).on('click', () => {
    $scrollContainer.animate({ scrollTop: 0 }, 100, 'linear');
  });

  $('.nav .logo').on('click', () => {
    $topEl.trigger('click');
  });

  const topIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2OTE0MjEyODUyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxMjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTkyLjEyOCA3NTAuNTA2NjY3YTUxLjIgNTEuMiAwIDAgMS03Ny4wNTYtNjcuNDEzMzM0bDM1OC40LTQwOS42YTUxLjIgNTEuMiAwIDAgMSA3Ny4wNTYgMGwzNTguNCA0MDkuNmE1MS4yIDUxLjIgMCAxIDEtNzcuMDU2IDY3LjQxMzMzNEw1MTIgMzg0LjkzODY2NyAxOTIuMTI4IDc1MC41MDY2Njd6IiBwLWlkPSIyMTMwIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+';
  $topEl.append(`<img src="${topIcon}" width="80%">`);

  $scrollContainer.scroll(function () {
    const top = $scrollContainer.scrollTop();

    if (!window.isBackTopShow) {
      if (top >= scrollHeight) {
        $topEl.fadeIn(500);
        window.isBackTopShow = true;
      }
    } else {
      if (top < scrollHeight) {
        $topEl.fadeOut(500);
        window.isBackTopShow = false;
      }
    }
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhaWR1c3VnLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOeZvuW6puaQnOe0ouW7uuiuru+8jOeZvuW6puaQnOe0ouaPkOekulxuICog55So5rOV77yabmV3IEJhaWR1U3VnKGRvbUlkLCBjb25maWcpXG4gKiBCYWlkdVN1Z2dlc3Rpb25DQiDkuLrlhajlsYDlj5jph4/vvIznlKjkuo7mkJzntKLlu7rorq7lm57osIPlh73mlbBcbiAqXG4gKiDmlK/mjIHnmoTlj4LmlbDvvJpcbiAqIGNvbmZpZy5jYWxsYmFjayAgICAgIOmAieS4ree7k+aenOWbnuiwg+WHveaVsFxuICogY29uZmlnLmNsYXNzTmFtZSAgICAg6aKd5aSW55qEY2xhc3MgbmFtZVxuICogY29uZmlnLndpZHRoXG4gKiBjb25maWcueE9mZnNldFxuICogY29uZmlnLnlPZmZzZXRcbiAqIGNvbmZpZy5iYWNrZ3JvdW5kXG4gKiBjb25maWcuekluZGV4XG4gKiBjb25maWcuc2hhZG93XG4gKiBjb25maWcuYm9yZGVyXG4gKiBjb25maWcubGlQYWRkaW5nXG4gKiBjb25maWcubGlDb2xvclxuICogY29uZmlnLm1heENvdW50ICAgICAg5pi+56S655qE5pyA5aSa57uT5p6c5pWw6YePXG4gKlxuICovXG5mdW5jdGlvbiBCYWlkdVN1Zyhkb21JZCwgY29uZmlnKSB7XG4gIHRoaXMuZG9tSWQgPSBkb21JZDtcbiAgdGhpcy5kb21JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlkKTtcbiAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG4gIHRoaXMuY29uZmlnLm1heENvdW50ID0gdGhpcy5jb25maWcubWF4Q291bnQgfHwgMTA7XG4gIHRoaXMucmVzdWx0Q2xhc3NOYW1lID0gJ2JhaWR1LXN1Zy1yZXN1bHQtJyArIERhdGUubm93KCk7IC8vIHVpZFxuICB0aGlzLmN1cnJlbnRMaUluZGV4ID0gLTE7XG4gIHRoaXMuaXNNb3ZpbmdDdXJzb3IgPSBmYWxzZTtcblxuICB0aGlzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuLCBkZWxheSkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcmdzKSB7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICBsZXQgX2FyZ3MgPSBhcmdzO1xuICAgICAgY2xlYXJUaW1lb3V0KGZ1bi5pZCk7XG4gICAgICBmdW4uaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW4uY2FsbCh0aGF0LCBfYXJncyk7XG4gICAgICB9LCBkZWxheSk7XG4gICAgfTtcbiAgfTtcblxuICB0aGlzLmdldFNlYXJjaFRleHQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kb21JZCkudmFsdWUudHJpbSgpO1xuICB9O1xuXG4gIHRoaXMubG9hZFNjcmlwdCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB2YXIgdWlkID0gJ3NjcmlwdF8nICsgRGF0ZS5ub3c7XG4gICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodWlkKS5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgc2NyaXB0LmlkID0gdWlkO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgfTtcblxuICB0aGlzLmRlYm91bmNlU2VhcmNoU3VnZ2VzdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLmRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgLy8g56e75Yqo5YWJ5qCH5pON5L2c77yM5LiN6KaB6L+b6KGM5ZCO57ut5pCc57SiXG4gICAgICBpZiAoc2VsZi5pc01vdmluZ0N1cnNvcikge1xuICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHNlYXJjaFRleHQgPSBzZWxmLmdldFNlYXJjaFRleHQoKTtcbiAgICAgIHZhciB0ID0gRGF0ZS5ub3coKTtcblxuICAgICAgc2VsZi5sb2FkU2NyaXB0KFxuICAgICAgICAnaHR0cHM6Ly93d3cuYmFpZHUuY29tL3N1P2NiPUJhaWR1U3VnZ2VzdGlvbkNCJnQ9JyArXG4gICAgICAgICAgdCArXG4gICAgICAgICAgJyZ3ZD0nICtcbiAgICAgICAgICBzZWFyY2hUZXh0XG4gICAgICApO1xuICAgIH0sIDQwMCk7XG4gIH07XG5cbiAgdGhpcy5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0LCBjb25maWcpIHtcbiAgICB0aGlzLmN1cnJlbnRMaUluZGV4ID0gLTE7IC8vIHNob3dSZXN1bHTkvJrph43mlrDnlJ/miJDlhoXlrrnvvIzmiYDku6XopoHph43nva4gTGlJbmRleFxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZXN1bHRMZW4gPSByZXN1bHQubGVuZ3RoO1xuICAgIHZhciBtYXhDb3VudCA9IGNvbmZpZy5tYXhDb3VudDtcbiAgICB2YXIgZG9tSW5wdXQgPSB0aGlzLmRvbUlucHV0O1xuICAgIHZhciBkb21XaWR0aCA9IGRvbUlucHV0Lm9mZnNldFdpZHRoO1xuICAgIHZhciBkZWZhdWx0Q2xhc3NOYW1lID0gdGhpcy5yZXN1bHRDbGFzc05hbWU7XG4gICAgdmFyIHJlc3VsdERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5yZXN1bHRDbGFzc05hbWUpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTGF5ZXIoY29uZmlnKSB7XG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gY29uZmlnLmNsYXNzTmFtZVxuICAgICAgICA/IGNvbmZpZy5jbGFzc05hbWUgKyAnICcgKyBkZWZhdWx0Q2xhc3NOYW1lXG4gICAgICAgIDogZGVmYXVsdENsYXNzTmFtZTtcbiAgICAgIGRpdi5zdHlsZSA9IFtcbiAgICAgICAgJ3dpZHRoOiAnICsgKGNvbmZpZy53aWR0aCA/IGNvbmZpZy53aWR0aCA6IGRvbVdpZHRoKSArICdweCcsXG4gICAgICAgICdwb3NpdGlvbjogYWJzb2x1dGUnLFxuICAgICAgICAnbGVmdDogMCcsXG4gICAgICAgICd0b3A6IDEwMCUnLFxuICAgICAgICAndHJhbnNmb3JtOicgKyAndHJhbnNsYXRlWCgnKyAoY29uZmlnLnhPZmZzZXQgfHwgMCkgKydweCknXG4gICAgICAgICAgKyAnIHRyYW5zbGF0ZVkoJysgKGNvbmZpZy55T2Zmc2V0IHx8IDApICsncHgpJyxcbiAgICAgICAgJ2JhY2tncm91bmQ6ICcgKyAoY29uZmlnLmJhY2tncm91bmQgPyBjb25maWcuYmFja2dyb3VuZCA6ICcjZmZmJyksXG4gICAgICAgICd6LWluZGV4OiAnICsgKGNvbmZpZy56SW5kZXggPyBjb25maWcuekluZGV4IDogJzk5OScpLFxuICAgICAgICAnYm94LXNoYWRvdzogJyArXG4gICAgICAgICAgKGNvbmZpZy5zaGFkb3cgPyBjb25maWcuc2hhZG93IDogJzFweCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgLjEpJyksXG4gICAgICAgICdib3JkZXI6ICcgKyAoY29uZmlnLmJvcmRlciA/IGNvbmZpZy5ib3JkZXIgOiAnMXB4IHNvbGlkICNkZGQnKVxuICAgICAgXS5qb2luKCc7Jyk7XG5cbiAgICAgIGRvbUlucHV0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIHJldHVybiBkaXY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVzdWx0Q29udGVudChyZXN1bHQpIHtcbiAgICAgIHZhciB1bCA9IFsnPHVsIHN0eWxlPVwibGlzdC1zdHlsZTpub25lO2N1cnNvcjpkZWZhdWx0O3BhZGRpbmc6MFwiPiddO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLm1pbihyZXN1bHRMZW4sIG1heENvdW50KTsgaSsrKSB7XG4gICAgICAgIHVsLnB1c2goJzxsaSBkYXRhLWk9XCInICsgaSArICdcIj4nICsgcmVzdWx0W2ldICsgJzwvbGk+Jyk7XG4gICAgICB9XG4gICAgICB1bC5wdXNoKCc8L3VsPicpO1xuICAgICAgcmV0dXJuIHVsLmpvaW4oJycpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHREb20pIHtcbiAgICAgIHJlc3VsdERvbS5pbm5lckhUTUwgPSBnZXRSZXN1bHRDb250ZW50KHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNyZWF0ZUxheWVyKFxuICAgICAgICBjb25maWdcbiAgICAgICkuaW5uZXJIVE1MID0gZ2V0UmVzdWx0Q29udGVudChyZXN1bHQpO1xuICAgIH1cblxuICAgIHZhciBsaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lICsgJyBsaScpO1xuICAgIHZhciBvbk1vdXNlRW50ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgaSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pJyk7XG4gICAgICBzZWxmLnNldEN1cnJlbnRMaShpLCB0cnVlKTtcbiAgICB9O1xuICAgIHZhciBvbkNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAgICAgc2VsZi5vblN1Ym1pdChlLnRhcmdldC5pbm5lclRleHQpO1xuICAgICAgc2VsZi5jdXJyZW50TGlJbmRleCA9IC0xO1xuICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyKTtcbiAgICAgIGxpc1tpXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyKTtcbiAgICAgIGxpc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spO1xuICAgICAgbGlzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuY2xlYXJSZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0RG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSk7XG4gICAgaWYgKHJlc3VsdERvbSkgcmVzdWx0RG9tLnJlbW92ZSgpO1xuICB9O1xuXG4gIC8vIOa3u+WKoOWFqOWxgOagt+W8j1xuICB0aGlzLmFkZFN0eWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhlYWRTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgdmFyIGxpU2VsZWN0b3IgPSAnLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSArICcgbGknO1xuICAgIHZhciBsaVN0eWxlID0gW1xuICAgICAgJ2hlaWdodDozMHB4JyxcbiAgICAgICdsaW5lLWhlaWdodDozMHB4JyxcbiAgICAgICdwYWRkaW5nOicgKyAoY29uZmlnLmxpUGFkZGluZyA/IGNvbmZpZy5saVBhZGRpbmcgOiAnMCA2cHgnKSxcbiAgICAgICdjb2xvcjonICsgKGNvbmZpZy5saUNvbG9yID8gY29uZmlnLmxpQ29sb3IgOiAnIzAwMCcpXG4gICAgXS5qb2luKCc7Jyk7XG4gICAgdmFyIGhlYWRTdHlsZUNvbnRlbnQgPSBsaVNlbGVjdG9yICsgJ3snICsgbGlTdHlsZSArICd9JztcbiAgICBoZWFkU3R5bGVDb250ZW50ICs9IGxpU2VsZWN0b3IgKyAnLmN1cnJlbnQgeyBiYWNrZ3JvdW5kOiAjY2NjOyB9JztcblxuICAgIGhlYWRTdHlsZS5pbm5lckhUTUwgPSBoZWFkU3R5bGVDb250ZW50O1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoaGVhZFN0eWxlKTtcbiAgfTtcblxuICAvLyDmt7vliqDlhajlsYDmjInplK7nm5HlkKxcbiAgdGhpcy5hZGRLZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAyNykgeyAvLyBlc2NcbiAgICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgICAgICBpZiAoZS50YXJnZXQuaWQgPT09IHNlbGYuZG9tSWQpIHtcbiAgICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gdHJ1ZTsgLy8gZXNjIOS5n+imgeemgeatouWQjue7reaQnOe0olxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zZXRDdXJyZW50TGkgPSBmdW5jdGlvbihpbmRleCwgZGlzYWJsZUlucHV0Q2hhbmdlKSB7XG4gICAgdmFyIHJlc3VsdExpRG9tcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAnLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSArICcgbGknXG4gICAgKTtcbiAgICB2YXIgY3VycmVudExpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lICsgJyBsaS5jdXJyZW50J1xuICAgICk7XG4gICAgdmFyIHJlc3VsdExlbiA9IHJlc3VsdExpRG9tcy5sZW5ndGg7XG5cbiAgICBpZiAocmVzdWx0TGVuKSB7XG4gICAgICBpZiAoaW5kZXggPCAwKSBpbmRleCA9IHJlc3VsdExlbiArIGluZGV4O1xuICAgICAgaWYgKGluZGV4ID4gcmVzdWx0TGVuIC0gMSkgaW5kZXggPSBpbmRleCAtIHJlc3VsdExlbjtcblxuICAgICAgaWYgKGN1cnJlbnRMaSkgY3VycmVudExpLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcbiAgICAgIHJlc3VsdExpRG9tc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xuXG4gICAgICAvLyDmmK/lkKblj6rmlLnlj5jpq5jkuq7nirbmgIHvvIzkuI3mlLnlj5jovpPlhaXlhoXlrrlcbiAgICAgIGlmICghZGlzYWJsZUlucHV0Q2hhbmdlKSB7XG4gICAgICAgIHRoaXMuZG9tSW5wdXQudmFsdWUgPSByZXN1bHRMaURvbXNbaW5kZXhdLmlubmVyVGV4dDtcbiAgICAgICAgdGhpcy5jdXJyZW50TGlJbmRleCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0aGlzLm9uU3VibWl0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBjYiA9XG4gICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayB8fFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdWJtaXQgdGV4dDogJyArIHRleHQpO1xuICAgICAgfTtcbiAgICBjYih0ZXh0KTtcbiAgICB0aGlzLmRvbUlucHV0LmJsdXIoKTtcbiAgfTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB3aW5kb3cuQmFpZHVTdWdnZXN0aW9uQ0IgPSBmdW5jdGlvbihyZXMpIHtcbiAgICAgIGlmIChyZXMgJiYgcmVzLnMgJiYgcmVzLnMubGVuZ3RoKSB7XG4gICAgICAgIHNlbGYuc2hvd1Jlc3VsdChyZXMucywgc2VsZi5jb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5kb21JbnB1dCkge1xuICAgICAgc2VsZi5kb21JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gZW50ZXJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICBzZWxmLmN1cnJlbnRMaUluZGV4ID0gLTE7XG4gICAgICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgICAgICAgIHNlbGYub25TdWJtaXQoc2VsZi5nZXRTZWFyY2hUZXh0KCkpO1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlOyAvLyDlm57ovabkuZ/opoHnpoHmraLlkI7nu63mkJzntKJcbiAgICAgICAgfVxuICAgICAgICAvLyB1cFxuICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM4KSB7XG4gICAgICAgICAgc2VsZi5zZXRDdXJyZW50TGkoc2VsZi5jdXJyZW50TGlJbmRleCAtIDEpO1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRvd25cbiAgICAgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09PSA0MCkge1xuICAgICAgICAgIHNlbGYuc2V0Q3VycmVudExpKHNlbGYuY3VycmVudExpSW5kZXggKyAxKTtcbiAgICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBsZWZ0LCByaWdodFxuICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM3IHx8IGUua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuZG9tSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmRlYm91bmNlU2VhcmNoU3VnZ2VzdCgpKTtcbiAgICAgIHNlbGYuZG9tSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzgpIGUucHJldmVudERlZmF1bHQoKTsgLy8g56aB5q2i5pa55ZCR5LiK6ZSu56e75Yqo5YWJ5qCH5Yiw5Y+l6aaWXG4gICAgICB9KTtcbiAgICAgIHNlbGYuZG9tSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUudGFyZ2V0LnNlbGVjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuYWRkU3R5bGUoKTtcbiAgICAgIHNlbGYuYWRkS2V5ZG93bkxpc3RlbmVyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIHN0YXJ0XG4gIHRoaXMuaW5pdCgpO1xufVxuIiwiJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAkKCcuZW5naW5lLWNob29zZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBvbkNsaWNrRW5naW5lKFxuICAgICAgJCh0aGlzKS5hdHRyKCdjbGFzcycpLnJlcGxhY2UoJ2VuZ2luZS1jaG9vc2UgJywgJycpLnRvTG93ZXJDYXNlKClcbiAgICApO1xuICB9KTtcbiAgJCgnLm5hdi10b2dnbGUnKS5jbGljayhvbkNsaWNrTmF2VG9nZ2xlKTtcbiAgJCgnLm5hdi10b2dnbGUnKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBpZiAoJCgnLm1haW4taW5uZXInKS5oYXNDbGFzcygnaXMtbmF2LXNocmluaycpKSB7XG4gICAgICBvbkNsaWNrTmF2VG9nZ2xlKCk7XG4gICAgfVxuICB9KTtcblxuICAkKCcuc2VhcmNoLWZvcm0nKS5vbignc3VibWl0Jywgb25TZWFyY2hGb3JtU3VibWl0KTtcbiAgaW5pdEJhaWR1U3VnKCk7XG4gIG9uU2l0ZUljb25FcnJvcigpO1xuICBvbkNsaWNrTmF2KCk7XG4gIGluaXRVc2VyU2l0ZXMoKTtcbiAgaW5pdFVzZXJMaXN0KCk7XG4gIHdhdGNoU2Nyb2xsKCk7XG5cbiAgY29uc3QgbGFzdEVuZ2luZSA9IGdldExhc3RFbmdpbmUoKSB8fCAnJztcbiAgY29uc3QgbmF2U2hyaW5rID0gZ2V0TmF2U2hyaW5rKCkgfHwgJyc7XG4gIGlmIChsYXN0RW5naW5lKSB7XG4gICAgJChgLmVuZ2luZS1jaG9vc2UuJHtsYXN0RW5naW5lfWApLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH1cbiAgaWYgKCFuYXZTaHJpbmspIHtcbiAgICAkKCcubWFpbi1pbm5lcicpLnJlbW92ZUNsYXNzKCdpcy1uYXYtc2hyaW5rJyk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBvbkNsaWNrRW5naW5lKGVuZ2luZSkge1xuICAkKCcuc2VhcmNoZXItbG9nbycpLmF0dHIoJ2NsYXNzJywgJ3NlYXJjaGVyLWxvZ28nKS5hZGRDbGFzcyhlbmdpbmUpO1xuICAkKCcuZW5naW5lLWNob29zZScpLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICQoYC5lbmdpbmUtY2hvb3NlLiR7ZW5naW5lfWApLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gICQoJyNzZWFyY2hJbnB1dEVsJykuYXR0cigncGxhY2Vob2xkZXInLCBgJHtmaXJzdFVwcGVyQ2FzZShlbmdpbmUpfSDmkJzntKJgKTtcbiAgc3RvcmVMYXN0RW5naW5lKGVuZ2luZSk7XG59XG5cbmZ1bmN0aW9uIGZpcnN0VXBwZXJDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKCB8XilbYS16XS9nLCAoTCkgPT4gTC50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZnVuY3Rpb24gc3RvcmVMYXN0RW5naW5lKGVuZ2luZSkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZW5naW5lJywgZW5naW5lKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdEVuZ2luZSgpIHtcbiAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlbmdpbmUnKTtcbn1cblxuZnVuY3Rpb24gZ2V0TmF2U2hyaW5rKCkge1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25hdi1zaHJpbmsnKTtcbn1cblxuZnVuY3Rpb24gb25DbGlja05hdlRvZ2dsZSgpIHtcbiAgaWYgKCQoJy5tYWluLWlubmVyJykuaGFzQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCduYXYtc2hyaW5rJyk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ25hdi1zaHJpbmsnLCAnMScpO1xuICB9XG4gICQoJy5tYWluLWlubmVyJykudG9nZ2xlQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKTtcbn1cblxuZnVuY3Rpb24gb25TZWFyY2hGb3JtU3VibWl0KGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCB0ZXh0ID0gJCgnI3NlYXJjaElucHV0RWwnKS52YWwoKTtcbiAgY29uc3QgZW5naW5lID0gJCgnLnNlYXJjaGVyLWxvZ28nKVxuICAgIC5hdHRyKCdjbGFzcycpXG4gICAgLnJlcGxhY2UoJ3NlYXJjaGVyLWxvZ28gJywgJycpO1xuICBnb1NlYXJjaChlbmdpbmUsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBpbml0QmFpZHVTdWcoKSB7XG4gIG5ldyBCYWlkdVN1Zygnc2VhcmNoSW5wdXRFbCcsIHtcbiAgICBjbGFzc05hbWU6ICdoaW5vdGUtc2VhcmNoJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgI2RkZCcsXG4gICAgeE9mZnNldDogLTEsXG4gICAgbWF4Q291bnQ6IDksXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAkKCcjc2VhcmNoSW5wdXRFbCcpLnZhbCh0ZXh0KTtcbiAgICAgICQoJyNzZWFyY2hTdWJtaXRFbCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdvU2VhcmNoKGVuZ2luZSwgdGV4dCkge1xuICBjb25zdCBTZWFyY2hFbmdpbmVVcmxNYXAgPSB7XG4gICAgYmFpZHU6ICdodHRwOi8vaW1nLmhpbnBjLmNvbS9hbGxzby8jJyxcbiAgICBnb29nbGU6ICdodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPScsXG4gICAgZG9nZWRvZ2U6ICdodHRwczovL3d3dy5kb2dlZG9nZS5jb20vcmVzdWx0cz9xPScsXG4gIH07XG5cbiAgd2luZG93Lm9wZW4oU2VhcmNoRW5naW5lVXJsTWFwW2VuZ2luZV0gKyB0ZXh0KTtcbn1cblxuZnVuY3Rpb24gb25TaXRlSWNvbkVycm9yKCkge1xuICBjb25zdCBlcnJJbWcgPSAnaHR0cHM6Ly9pLmxvbGkubmV0LzIwMjAvMDQvMTMvSkh6ZWZicWdGV1RDSURpLnBuZyc7XG4gICQoJy5zaXRlcyBpbWcnKS5vbignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzKS5vZmYoJ2Vycm9yJykuYXR0cignc3JjJywgZXJySW1nKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2xpY2tOYXYoKSB7XG4gICQoJy5uYXYgdWwnKS5vbignY2xpY2snLCAnYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9ICQodGhpcykuYXR0cignaHJlZicpLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgY29uc3QgdG9wID0gJChgI2NhdGVnb3J5XyR7dGFyZ2V0fWApWzBdLm9mZnNldFRvcDtcbiAgICAkKCcubWFpbi1jb250ZW50JylbMF0uc2Nyb2xsVG9wID0gdG9wO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJTaXRlcygpIHtcbiAgY29uc3QgdXNlclNpdGVzID0gd2luZG93LkFQUF9DT05GSUcgJiYgd2luZG93LkFQUF9DT05GSUcudXNlcl9zaXRlcztcbiAgaWYgKHVzZXJTaXRlcyAmJiB1c2VyU2l0ZXMubGVuZ3RoKSB7XG4gICAgdXNlclNpdGVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XG4gICAgICBnZW5lcmF0ZVNpdGVTZWN0aW9uKGNhdGVnb3J5LnVpZCwgY2F0ZWdvcnkuYWxpYXMsIGNhdGVnb3J5LnNpdGVzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oJ+ayoeacieeUqOaIt+mFjee9ruWvvOiIqu+8gScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2l0ZVNlY3Rpb24oY2F0ZWdvcnlJZCwgY2F0ZWdvcnlOYW1lLCBzaXRlcykge1xuICBjb25zdCBiYXNlID0gYFxuICA8ZGl2IGNsYXNzPVwic2l0ZXMtc2VjdGlvblwiPlxuICA8aDIgY2xhc3M9XCJjYXRlZ29yeVwiIGlkPVwiY2F0ZWdvcnlfJHtjYXRlZ29yeUlkfVwiPlxuICAgIDxzcGFuPiR7Y2F0ZWdvcnlOYW1lfTwvc3Bhbj5cbiAgPC9oMj5cbiAgPHVsPmA7XG5cbiAgY29uc3QgbGlzdCA9IHNpdGVzXG4gICAgLm1hcCgocykgPT4ge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj1cIiR7cy51cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICAgIDxpbWcgc3JjPVwiJHtzLmljb259XCI+XG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8c3Bhbj4ke3MubmFtZX08L3NwYW4+XG4gICAgICAgICAgICA8cD4ke3MuZGVzYyB8fCBzLnVybH08L3A+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPmA7XG4gICAgfSlcbiAgICAuam9pbignJyk7XG5cbiAgY29uc3QgaCA9IGJhc2UgKyBsaXN0ICsgJzwvdWw+PC9kaXY+JztcblxuICAkKCcubWFpbi1jb250ZW50IC5zaXRlcycpLmFwcGVuZChoKTtcblxuICBjb25zdCBuYXYgPSBgXG4gICAgPGxpPlxuICAgICAgPGEgaHJlZj1cIiMke2NhdGVnb3J5SWR9XCI+XG4gICAgICAgIDxzcGFuPiR7Y2F0ZWdvcnlOYW1lfTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L2xpPmA7XG4gICQoJy5uYXYgdWwnKS5hcHBlbmQobmF2KTtcbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJMaXN0KCkge1xuICBsZXQgdXNlckxpc3QgPSBnZXRDb29raWUoJ3VzZXJsaXN0JylcbiAgdXNlckxpc3QgPSB1c2VyTGlzdD8gdXNlckxpc3Quc3BsaXQoJywnKSA6ICcnO1xuXG4gIGlmICh1c2VyTGlzdCAmJiB1c2VyTGlzdC5sZW5ndGgpIHtcbiAgICBjb25zdCBoID0gdXNlckxpc3QubWFwKHUgPT4ge1xuICAgICAgcmV0dXJuIGA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkIDBcIj4ke3V9PC9hPmA7XG4gICAgfSkuam9pbignJyk7XG4gICAgJCgnLnVzZXItbGlzdCcpLmFwcGVuZChoKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICB9XG5cbiAgJCgnLnVzZXItbGlzdCcpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHVzZXIgPSAkKHRoaXMpLnRleHQoKS50cmltKCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gYHVzZXI9JHt1c2VyfTsgZXhwaXJlcz1GcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IEdNVDsgcGF0aD1gICsgbG9jYXRpb24uaG9zdDtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9LCA1MDApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgdmFyIHZhbHVlID0gXCI7IFwiICsgZG9jdW1lbnQuY29va2llO1xuICB2YXIgcGFydHMgPSB2YWx1ZS5zcGxpdChcIjsgXCIgKyBuYW1lICsgXCI9XCIpO1xuICBpZiAocGFydHMubGVuZ3RoID09IDIpIHJldHVybiBwYXJ0cy5wb3AoKS5zcGxpdChcIjtcIikuc2hpZnQoKTtcbn1cblxuZnVuY3Rpb24gd2F0Y2hTY3JvbGwoKSB7XG4gIGNvbnN0ICRzY3JvbGxDb250YWluZXIgPSAkKCcubWFpbi1jb250ZW50Jyk7XG4gIGNvbnN0ICR0b3BFbCA9ICQoJy5iYWNrLXRvcCcpO1xuICBjb25zdCBzY3JvbGxIZWlnaHQgPSAyNzA7XG5cbiAgd2luZG93LmlzQmFja1RvcFNob3cgPSBmYWxzZTtcblxuICAkdG9wRWwuY3NzKHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICBib3R0b206ICc1MHB4JyxcbiAgICByaWdodDogJzEwMHB4JyxcbiAgICBiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwwLjcpJyxcbiAgICB3aWR0aDogJzUwcHgnLFxuICAgIGhlaWdodDogJzUwcHgnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgcGFkZGluZ1RvcDogJzVweCcsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCdcbiAgfSkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICRzY3JvbGxDb250YWluZXIuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAxMDAsICdsaW5lYXInKTtcbiAgfSk7XG5cbiAgJCgnLm5hdiAubG9nbycpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAkdG9wRWwudHJpZ2dlcignY2xpY2snKTtcbiAgfSk7XG5cbiAgY29uc3QgdG9wSWNvbiA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQnpkR0Z1WkdGc2IyNWxQU0p1YnlJL1Bqd2hSRTlEVkZsUVJTQnpkbWNnVUZWQ1RFbERJQ0l0THk5WE0wTXZMMFJVUkNCVFZrY2dNUzR4THk5RlRpSWdJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMGR5WVhCb2FXTnpMMU5XUnk4eExqRXZSRlJFTDNOMlp6RXhMbVIwWkNJK1BITjJaeUIwUFNJeE5UZzJPVEUwTWpFeU9EVXlJaUJqYkdGemN6MGlhV052YmlJZ2RtbGxkMEp2ZUQwaU1DQXdJREV3TWpRZ01UQXlOQ0lnZG1WeWMybHZiajBpTVM0eElpQjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQXRhV1E5SWpJeE1qa2lJSGh0Ykc1ek9uaHNhVzVyUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMM2hzYVc1cklpQjNhV1IwYUQwaU5EQXdJaUJvWldsbmFIUTlJalF3TUNJK1BHUmxabk0rUEhOMGVXeGxJSFI1Y0dVOUluUmxlSFF2WTNOeklqNDhMM04wZVd4bFBqd3ZaR1ZtY3o0OGNHRjBhQ0JrUFNKTk1Ua3lMakV5T0NBM05UQXVOVEEyTmpZM1lUVXhMaklnTlRFdU1pQXdJREFnTVMwM055NHdOVFl0TmpjdU5ERXpNek0wYkRNMU9DNDBMVFF3T1M0MllUVXhMaklnTlRFdU1pQXdJREFnTVNBM055NHdOVFlnTUd3ek5UZ3VOQ0EwTURrdU5tRTFNUzR5SURVeExqSWdNQ0F4SURFdE56Y3VNRFUySURZM0xqUXhNek16TkV3MU1USWdNemcwTGprek9EWTJOeUF4T1RJdU1USTRJRGMxTUM0MU1EWTJOamQ2SWlCd0xXbGtQU0l5TVRNd0lpQm1hV3hzUFNJalptWm1abVptSWo0OEwzQmhkR2crUEM5emRtYysnO1xuICAkdG9wRWwuYXBwZW5kKGA8aW1nIHNyYz1cIiR7dG9wSWNvbn1cIiB3aWR0aD1cIjgwJVwiPmApO1xuXG4gICRzY3JvbGxDb250YWluZXIuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0b3AgPSAkc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcCgpO1xuXG4gICAgaWYgKCF3aW5kb3cuaXNCYWNrVG9wU2hvdykge1xuICAgICAgaWYgKHRvcCA+PSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgJHRvcEVsLmZhZGVJbig1MDApO1xuICAgICAgICB3aW5kb3cuaXNCYWNrVG9wU2hvdyA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0b3AgPCBzY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgJHRvcEVsLmZhZGVPdXQoNTAwKTtcbiAgICAgICAgd2luZG93LmlzQmFja1RvcFNob3cgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuIl19
