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
    baidu: 'http://gallenhu.github.io/allso/#',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhaWR1c3VnLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOeZvuW6puaQnOe0ouW7uuiuru+8jOeZvuW6puaQnOe0ouaPkOekulxuICog55So5rOV77yabmV3IEJhaWR1U3VnKGRvbUlkLCBjb25maWcpXG4gKiBCYWlkdVN1Z2dlc3Rpb25DQiDkuLrlhajlsYDlj5jph4/vvIznlKjkuo7mkJzntKLlu7rorq7lm57osIPlh73mlbBcbiAqXG4gKiDmlK/mjIHnmoTlj4LmlbDvvJpcbiAqIGNvbmZpZy5jYWxsYmFjayAgICAgIOmAieS4ree7k+aenOWbnuiwg+WHveaVsFxuICogY29uZmlnLmNsYXNzTmFtZSAgICAg6aKd5aSW55qEY2xhc3MgbmFtZVxuICogY29uZmlnLndpZHRoXG4gKiBjb25maWcueE9mZnNldFxuICogY29uZmlnLnlPZmZzZXRcbiAqIGNvbmZpZy5iYWNrZ3JvdW5kXG4gKiBjb25maWcuekluZGV4XG4gKiBjb25maWcuc2hhZG93XG4gKiBjb25maWcuYm9yZGVyXG4gKiBjb25maWcubGlQYWRkaW5nXG4gKiBjb25maWcubGlDb2xvclxuICogY29uZmlnLm1heENvdW50ICAgICAg5pi+56S655qE5pyA5aSa57uT5p6c5pWw6YePXG4gKlxuICovXG5mdW5jdGlvbiBCYWlkdVN1Zyhkb21JZCwgY29uZmlnKSB7XG4gIHRoaXMuZG9tSWQgPSBkb21JZDtcbiAgdGhpcy5kb21JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlkKTtcbiAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG4gIHRoaXMuY29uZmlnLm1heENvdW50ID0gdGhpcy5jb25maWcubWF4Q291bnQgfHwgMTA7XG4gIHRoaXMucmVzdWx0Q2xhc3NOYW1lID0gJ2JhaWR1LXN1Zy1yZXN1bHQtJyArIERhdGUubm93KCk7IC8vIHVpZFxuICB0aGlzLmN1cnJlbnRMaUluZGV4ID0gLTE7XG4gIHRoaXMuaXNNb3ZpbmdDdXJzb3IgPSBmYWxzZTtcblxuICB0aGlzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuLCBkZWxheSkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcmdzKSB7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICBsZXQgX2FyZ3MgPSBhcmdzO1xuICAgICAgY2xlYXJUaW1lb3V0KGZ1bi5pZCk7XG4gICAgICBmdW4uaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW4uY2FsbCh0aGF0LCBfYXJncyk7XG4gICAgICB9LCBkZWxheSk7XG4gICAgfTtcbiAgfTtcblxuICB0aGlzLmdldFNlYXJjaFRleHQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kb21JZCkudmFsdWUudHJpbSgpO1xuICB9O1xuXG4gIHRoaXMubG9hZFNjcmlwdCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB2YXIgdWlkID0gJ3NjcmlwdF8nICsgRGF0ZS5ub3c7XG4gICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodWlkKS5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgc2NyaXB0LmlkID0gdWlkO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgfTtcblxuICB0aGlzLmRlYm91bmNlU2VhcmNoU3VnZ2VzdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLmRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgLy8g56e75Yqo5YWJ5qCH5pON5L2c77yM5LiN6KaB6L+b6KGM5ZCO57ut5pCc57SiXG4gICAgICBpZiAoc2VsZi5pc01vdmluZ0N1cnNvcikge1xuICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHNlYXJjaFRleHQgPSBzZWxmLmdldFNlYXJjaFRleHQoKTtcbiAgICAgIHZhciB0ID0gRGF0ZS5ub3coKTtcblxuICAgICAgc2VsZi5sb2FkU2NyaXB0KFxuICAgICAgICAnaHR0cHM6Ly93d3cuYmFpZHUuY29tL3N1P2NiPUJhaWR1U3VnZ2VzdGlvbkNCJnQ9JyArXG4gICAgICAgICAgdCArXG4gICAgICAgICAgJyZ3ZD0nICtcbiAgICAgICAgICBzZWFyY2hUZXh0XG4gICAgICApO1xuICAgIH0sIDQwMCk7XG4gIH07XG5cbiAgdGhpcy5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0LCBjb25maWcpIHtcbiAgICB0aGlzLmN1cnJlbnRMaUluZGV4ID0gLTE7IC8vIHNob3dSZXN1bHTkvJrph43mlrDnlJ/miJDlhoXlrrnvvIzmiYDku6XopoHph43nva4gTGlJbmRleFxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZXN1bHRMZW4gPSByZXN1bHQubGVuZ3RoO1xuICAgIHZhciBtYXhDb3VudCA9IGNvbmZpZy5tYXhDb3VudDtcbiAgICB2YXIgZG9tSW5wdXQgPSB0aGlzLmRvbUlucHV0O1xuICAgIHZhciBkb21XaWR0aCA9IGRvbUlucHV0Lm9mZnNldFdpZHRoO1xuICAgIHZhciBkZWZhdWx0Q2xhc3NOYW1lID0gdGhpcy5yZXN1bHRDbGFzc05hbWU7XG4gICAgdmFyIHJlc3VsdERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5yZXN1bHRDbGFzc05hbWUpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTGF5ZXIoY29uZmlnKSB7XG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gY29uZmlnLmNsYXNzTmFtZVxuICAgICAgICA/IGNvbmZpZy5jbGFzc05hbWUgKyAnICcgKyBkZWZhdWx0Q2xhc3NOYW1lXG4gICAgICAgIDogZGVmYXVsdENsYXNzTmFtZTtcbiAgICAgIGRpdi5zdHlsZSA9IFtcbiAgICAgICAgJ3dpZHRoOiAnICsgKGNvbmZpZy53aWR0aCA/IGNvbmZpZy53aWR0aCA6IGRvbVdpZHRoKSArICdweCcsXG4gICAgICAgICdwb3NpdGlvbjogYWJzb2x1dGUnLFxuICAgICAgICAnbGVmdDogMCcsXG4gICAgICAgICd0b3A6IDEwMCUnLFxuICAgICAgICAndHJhbnNmb3JtOicgKyAndHJhbnNsYXRlWCgnKyAoY29uZmlnLnhPZmZzZXQgfHwgMCkgKydweCknXG4gICAgICAgICAgKyAnIHRyYW5zbGF0ZVkoJysgKGNvbmZpZy55T2Zmc2V0IHx8IDApICsncHgpJyxcbiAgICAgICAgJ2JhY2tncm91bmQ6ICcgKyAoY29uZmlnLmJhY2tncm91bmQgPyBjb25maWcuYmFja2dyb3VuZCA6ICcjZmZmJyksXG4gICAgICAgICd6LWluZGV4OiAnICsgKGNvbmZpZy56SW5kZXggPyBjb25maWcuekluZGV4IDogJzk5OScpLFxuICAgICAgICAnYm94LXNoYWRvdzogJyArXG4gICAgICAgICAgKGNvbmZpZy5zaGFkb3cgPyBjb25maWcuc2hhZG93IDogJzFweCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgLjEpJyksXG4gICAgICAgICdib3JkZXI6ICcgKyAoY29uZmlnLmJvcmRlciA/IGNvbmZpZy5ib3JkZXIgOiAnMXB4IHNvbGlkICNkZGQnKVxuICAgICAgXS5qb2luKCc7Jyk7XG5cbiAgICAgIGRvbUlucHV0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIHJldHVybiBkaXY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVzdWx0Q29udGVudChyZXN1bHQpIHtcbiAgICAgIHZhciB1bCA9IFsnPHVsIHN0eWxlPVwibGlzdC1zdHlsZTpub25lO2N1cnNvcjpkZWZhdWx0O3BhZGRpbmc6MFwiPiddO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLm1pbihyZXN1bHRMZW4sIG1heENvdW50KTsgaSsrKSB7XG4gICAgICAgIHVsLnB1c2goJzxsaSBkYXRhLWk9XCInICsgaSArICdcIj4nICsgcmVzdWx0W2ldICsgJzwvbGk+Jyk7XG4gICAgICB9XG4gICAgICB1bC5wdXNoKCc8L3VsPicpO1xuICAgICAgcmV0dXJuIHVsLmpvaW4oJycpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHREb20pIHtcbiAgICAgIHJlc3VsdERvbS5pbm5lckhUTUwgPSBnZXRSZXN1bHRDb250ZW50KHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNyZWF0ZUxheWVyKFxuICAgICAgICBjb25maWdcbiAgICAgICkuaW5uZXJIVE1MID0gZ2V0UmVzdWx0Q29udGVudChyZXN1bHQpO1xuICAgIH1cblxuICAgIHZhciBsaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lICsgJyBsaScpO1xuICAgIHZhciBvbk1vdXNlRW50ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgaSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pJyk7XG4gICAgICBzZWxmLnNldEN1cnJlbnRMaShpLCB0cnVlKTtcbiAgICB9O1xuICAgIHZhciBvbkNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAgICAgc2VsZi5vblN1Ym1pdChlLnRhcmdldC5pbm5lclRleHQpO1xuICAgICAgc2VsZi5jdXJyZW50TGlJbmRleCA9IC0xO1xuICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyKTtcbiAgICAgIGxpc1tpXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyKTtcbiAgICAgIGxpc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spO1xuICAgICAgbGlzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuY2xlYXJSZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0RG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSk7XG4gICAgaWYgKHJlc3VsdERvbSkgcmVzdWx0RG9tLnJlbW92ZSgpO1xuICB9O1xuXG4gIC8vIOa3u+WKoOWFqOWxgOagt+W8j1xuICB0aGlzLmFkZFN0eWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhlYWRTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgdmFyIGxpU2VsZWN0b3IgPSAnLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSArICcgbGknO1xuICAgIHZhciBsaVN0eWxlID0gW1xuICAgICAgJ2hlaWdodDozMHB4JyxcbiAgICAgICdsaW5lLWhlaWdodDozMHB4JyxcbiAgICAgICdwYWRkaW5nOicgKyAoY29uZmlnLmxpUGFkZGluZyA/IGNvbmZpZy5saVBhZGRpbmcgOiAnMCA2cHgnKSxcbiAgICAgICdjb2xvcjonICsgKGNvbmZpZy5saUNvbG9yID8gY29uZmlnLmxpQ29sb3IgOiAnIzAwMCcpXG4gICAgXS5qb2luKCc7Jyk7XG4gICAgdmFyIGhlYWRTdHlsZUNvbnRlbnQgPSBsaVNlbGVjdG9yICsgJ3snICsgbGlTdHlsZSArICd9JztcbiAgICBoZWFkU3R5bGVDb250ZW50ICs9IGxpU2VsZWN0b3IgKyAnLmN1cnJlbnQgeyBiYWNrZ3JvdW5kOiAjY2NjOyB9JztcblxuICAgIGhlYWRTdHlsZS5pbm5lckhUTUwgPSBoZWFkU3R5bGVDb250ZW50O1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoaGVhZFN0eWxlKTtcbiAgfTtcblxuICAvLyDmt7vliqDlhajlsYDmjInplK7nm5HlkKxcbiAgdGhpcy5hZGRLZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAyNykgeyAvLyBlc2NcbiAgICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgICAgICBpZiAoZS50YXJnZXQuaWQgPT09IHNlbGYuZG9tSWQpIHtcbiAgICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gdHJ1ZTsgLy8gZXNjIOS5n+imgeemgeatouWQjue7reaQnOe0olxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zZXRDdXJyZW50TGkgPSBmdW5jdGlvbihpbmRleCwgZGlzYWJsZUlucHV0Q2hhbmdlKSB7XG4gICAgdmFyIHJlc3VsdExpRG9tcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAnLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSArICcgbGknXG4gICAgKTtcbiAgICB2YXIgY3VycmVudExpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lICsgJyBsaS5jdXJyZW50J1xuICAgICk7XG4gICAgdmFyIHJlc3VsdExlbiA9IHJlc3VsdExpRG9tcy5sZW5ndGg7XG5cbiAgICBpZiAocmVzdWx0TGVuKSB7XG4gICAgICBpZiAoaW5kZXggPCAwKSBpbmRleCA9IHJlc3VsdExlbiArIGluZGV4O1xuICAgICAgaWYgKGluZGV4ID4gcmVzdWx0TGVuIC0gMSkgaW5kZXggPSBpbmRleCAtIHJlc3VsdExlbjtcblxuICAgICAgaWYgKGN1cnJlbnRMaSkgY3VycmVudExpLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcbiAgICAgIHJlc3VsdExpRG9tc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xuXG4gICAgICAvLyDmmK/lkKblj6rmlLnlj5jpq5jkuq7nirbmgIHvvIzkuI3mlLnlj5jovpPlhaXlhoXlrrlcbiAgICAgIGlmICghZGlzYWJsZUlucHV0Q2hhbmdlKSB7XG4gICAgICAgIHRoaXMuZG9tSW5wdXQudmFsdWUgPSByZXN1bHRMaURvbXNbaW5kZXhdLmlubmVyVGV4dDtcbiAgICAgICAgdGhpcy5jdXJyZW50TGlJbmRleCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0aGlzLm9uU3VibWl0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBjYiA9XG4gICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayB8fFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdWJtaXQgdGV4dDogJyArIHRleHQpO1xuICAgICAgfTtcbiAgICBjYih0ZXh0KTtcbiAgICB0aGlzLmRvbUlucHV0LmJsdXIoKTtcbiAgfTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB3aW5kb3cuQmFpZHVTdWdnZXN0aW9uQ0IgPSBmdW5jdGlvbihyZXMpIHtcbiAgICAgIGlmIChyZXMgJiYgcmVzLnMgJiYgcmVzLnMubGVuZ3RoKSB7XG4gICAgICAgIHNlbGYuc2hvd1Jlc3VsdChyZXMucywgc2VsZi5jb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5kb21JbnB1dCkge1xuICAgICAgc2VsZi5kb21JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gZW50ZXJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICBzZWxmLmN1cnJlbnRMaUluZGV4ID0gLTE7XG4gICAgICAgICAgc2VsZi5jbGVhclJlc3VsdCgpO1xuICAgICAgICAgIHNlbGYub25TdWJtaXQoc2VsZi5nZXRTZWFyY2hUZXh0KCkpO1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlOyAvLyDlm57ovabkuZ/opoHnpoHmraLlkI7nu63mkJzntKJcbiAgICAgICAgfVxuICAgICAgICAvLyB1cFxuICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM4KSB7XG4gICAgICAgICAgc2VsZi5zZXRDdXJyZW50TGkoc2VsZi5jdXJyZW50TGlJbmRleCAtIDEpO1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRvd25cbiAgICAgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09PSA0MCkge1xuICAgICAgICAgIHNlbGYuc2V0Q3VycmVudExpKHNlbGYuY3VycmVudExpSW5kZXggKyAxKTtcbiAgICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBsZWZ0LCByaWdodFxuICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM3IHx8IGUua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgICAgICBzZWxmLmlzTW92aW5nQ3Vyc29yID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuZG9tSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmRlYm91bmNlU2VhcmNoU3VnZ2VzdCgpKTtcbiAgICAgIHNlbGYuZG9tSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzgpIGUucHJldmVudERlZmF1bHQoKTsgLy8g56aB5q2i5pa55ZCR5LiK6ZSu56e75Yqo5YWJ5qCH5Yiw5Y+l6aaWXG4gICAgICB9KTtcbiAgICAgIHNlbGYuZG9tSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUudGFyZ2V0LnNlbGVjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuYWRkU3R5bGUoKTtcbiAgICAgIHNlbGYuYWRkS2V5ZG93bkxpc3RlbmVyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIHN0YXJ0XG4gIHRoaXMuaW5pdCgpO1xufVxuIiwiJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAkKCcuZW5naW5lLWNob29zZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBvbkNsaWNrRW5naW5lKFxuICAgICAgJCh0aGlzKS5hdHRyKCdjbGFzcycpLnJlcGxhY2UoJ2VuZ2luZS1jaG9vc2UgJywgJycpLnRvTG93ZXJDYXNlKClcbiAgICApO1xuICB9KTtcbiAgJCgnLm5hdi10b2dnbGUnKS5jbGljayhvbkNsaWNrTmF2VG9nZ2xlKTtcbiAgJCgnLm5hdi10b2dnbGUnKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBpZiAoJCgnLm1haW4taW5uZXInKS5oYXNDbGFzcygnaXMtbmF2LXNocmluaycpKSB7XG4gICAgICBvbkNsaWNrTmF2VG9nZ2xlKCk7XG4gICAgfVxuICB9KTtcblxuICAkKCcuc2VhcmNoLWZvcm0nKS5vbignc3VibWl0Jywgb25TZWFyY2hGb3JtU3VibWl0KTtcbiAgaW5pdEJhaWR1U3VnKCk7XG4gIG9uU2l0ZUljb25FcnJvcigpO1xuICBvbkNsaWNrTmF2KCk7XG4gIGluaXRVc2VyU2l0ZXMoKTtcbiAgaW5pdFVzZXJMaXN0KCk7XG4gIHdhdGNoU2Nyb2xsKCk7XG5cbiAgY29uc3QgbGFzdEVuZ2luZSA9IGdldExhc3RFbmdpbmUoKSB8fCAnJztcbiAgY29uc3QgbmF2U2hyaW5rID0gZ2V0TmF2U2hyaW5rKCkgfHwgJyc7XG4gIGlmIChsYXN0RW5naW5lKSB7XG4gICAgJChgLmVuZ2luZS1jaG9vc2UuJHtsYXN0RW5naW5lfWApLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH1cbiAgaWYgKCFuYXZTaHJpbmspIHtcbiAgICAkKCcubWFpbi1pbm5lcicpLnJlbW92ZUNsYXNzKCdpcy1uYXYtc2hyaW5rJyk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBvbkNsaWNrRW5naW5lKGVuZ2luZSkge1xuICAkKCcuc2VhcmNoZXItbG9nbycpLmF0dHIoJ2NsYXNzJywgJ3NlYXJjaGVyLWxvZ28nKS5hZGRDbGFzcyhlbmdpbmUpO1xuICAkKCcuZW5naW5lLWNob29zZScpLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICQoYC5lbmdpbmUtY2hvb3NlLiR7ZW5naW5lfWApLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gICQoJyNzZWFyY2hJbnB1dEVsJykuYXR0cigncGxhY2Vob2xkZXInLCBgJHtmaXJzdFVwcGVyQ2FzZShlbmdpbmUpfSDmkJzntKJgKTtcbiAgc3RvcmVMYXN0RW5naW5lKGVuZ2luZSk7XG59XG5cbmZ1bmN0aW9uIGZpcnN0VXBwZXJDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKCB8XilbYS16XS9nLCAoTCkgPT4gTC50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZnVuY3Rpb24gc3RvcmVMYXN0RW5naW5lKGVuZ2luZSkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZW5naW5lJywgZW5naW5lKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdEVuZ2luZSgpIHtcbiAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlbmdpbmUnKTtcbn1cblxuZnVuY3Rpb24gZ2V0TmF2U2hyaW5rKCkge1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25hdi1zaHJpbmsnKTtcbn1cblxuZnVuY3Rpb24gb25DbGlja05hdlRvZ2dsZSgpIHtcbiAgaWYgKCQoJy5tYWluLWlubmVyJykuaGFzQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCduYXYtc2hyaW5rJyk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ25hdi1zaHJpbmsnLCAnMScpO1xuICB9XG4gICQoJy5tYWluLWlubmVyJykudG9nZ2xlQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKTtcbn1cblxuZnVuY3Rpb24gb25TZWFyY2hGb3JtU3VibWl0KGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCB0ZXh0ID0gJCgnI3NlYXJjaElucHV0RWwnKS52YWwoKTtcbiAgY29uc3QgZW5naW5lID0gJCgnLnNlYXJjaGVyLWxvZ28nKVxuICAgIC5hdHRyKCdjbGFzcycpXG4gICAgLnJlcGxhY2UoJ3NlYXJjaGVyLWxvZ28gJywgJycpO1xuICBnb1NlYXJjaChlbmdpbmUsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBpbml0QmFpZHVTdWcoKSB7XG4gIG5ldyBCYWlkdVN1Zygnc2VhcmNoSW5wdXRFbCcsIHtcbiAgICBjbGFzc05hbWU6ICdoaW5vdGUtc2VhcmNoJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgI2RkZCcsXG4gICAgeE9mZnNldDogLTEsXG4gICAgbWF4Q291bnQ6IDksXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAkKCcjc2VhcmNoSW5wdXRFbCcpLnZhbCh0ZXh0KTtcbiAgICAgICQoJyNzZWFyY2hTdWJtaXRFbCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdvU2VhcmNoKGVuZ2luZSwgdGV4dCkge1xuICBjb25zdCBTZWFyY2hFbmdpbmVVcmxNYXAgPSB7XG4gICAgYmFpZHU6ICdodHRwOi8vZ2FsbGVuaHUuZ2l0aHViLmlvL2FsbHNvLyMnLFxuICAgIGdvb2dsZTogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9JyxcbiAgICBkb2dlZG9nZTogJ2h0dHBzOi8vd3d3LmRvZ2Vkb2dlLmNvbS9yZXN1bHRzP3E9JyxcbiAgfTtcblxuICB3aW5kb3cub3BlbihTZWFyY2hFbmdpbmVVcmxNYXBbZW5naW5lXSArIHRleHQpO1xufVxuXG5mdW5jdGlvbiBvblNpdGVJY29uRXJyb3IoKSB7XG4gIGNvbnN0IGVyckltZyA9ICdodHRwczovL2kubG9saS5uZXQvMjAyMC8wNC8xMy9KSHplZmJxZ0ZXVENJRGkucG5nJztcbiAgJCgnLnNpdGVzIGltZycpLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMpLm9mZignZXJyb3InKS5hdHRyKCdzcmMnLCBlcnJJbWcpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb25DbGlja05hdigpIHtcbiAgJCgnLm5hdiB1bCcpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgdGFyZ2V0ID0gJCh0aGlzKS5hdHRyKCdocmVmJykucmVwbGFjZSgnIycsICcnKTtcbiAgICBjb25zdCB0b3AgPSAkKGAjY2F0ZWdvcnlfJHt0YXJnZXR9YClbMF0ub2Zmc2V0VG9wO1xuICAgICQoJy5tYWluLWNvbnRlbnQnKVswXS5zY3JvbGxUb3AgPSB0b3A7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0VXNlclNpdGVzKCkge1xuICBjb25zdCB1c2VyU2l0ZXMgPSB3aW5kb3cuQVBQX0NPTkZJRyAmJiB3aW5kb3cuQVBQX0NPTkZJRy51c2VyX3NpdGVzO1xuICBpZiAodXNlclNpdGVzICYmIHVzZXJTaXRlcy5sZW5ndGgpIHtcbiAgICB1c2VyU2l0ZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcbiAgICAgIGdlbmVyYXRlU2l0ZVNlY3Rpb24oY2F0ZWdvcnkudWlkLCBjYXRlZ29yeS5hbGlhcywgY2F0ZWdvcnkuc2l0ZXMpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2Fybign5rKh5pyJ55So5oi36YWN572u5a+86Iiq77yBJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTaXRlU2VjdGlvbihjYXRlZ29yeUlkLCBjYXRlZ29yeU5hbWUsIHNpdGVzKSB7XG4gIGNvbnN0IGJhc2UgPSBgXG4gIDxkaXYgY2xhc3M9XCJzaXRlcy1zZWN0aW9uXCI+XG4gIDxoMiBjbGFzcz1cImNhdGVnb3J5XCIgaWQ9XCJjYXRlZ29yeV8ke2NhdGVnb3J5SWR9XCI+XG4gICAgPHNwYW4+JHtjYXRlZ29yeU5hbWV9PC9zcGFuPlxuICA8L2gyPlxuICA8dWw+YDtcblxuICBjb25zdCBsaXN0ID0gc2l0ZXNcbiAgICAubWFwKChzKSA9PiB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGxpPlxuICAgICAgICA8YSBocmVmPVwiJHtzLnVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICAgICAgPGltZyBzcmM9XCIke3MuaWNvbn1cIj5cbiAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPiR7cy5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDxwPiR7cy5kZXNjIHx8IHMudXJsfTwvcD5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+YDtcbiAgICB9KVxuICAgIC5qb2luKCcnKTtcblxuICBjb25zdCBoID0gYmFzZSArIGxpc3QgKyAnPC91bD48L2Rpdj4nO1xuXG4gICQoJy5tYWluLWNvbnRlbnQgLnNpdGVzJykuYXBwZW5kKGgpO1xuXG4gIGNvbnN0IG5hdiA9IGBcbiAgICA8bGk+XG4gICAgICA8YSBocmVmPVwiIyR7Y2F0ZWdvcnlJZH1cIj5cbiAgICAgICAgPHNwYW4+JHtjYXRlZ29yeU5hbWV9PC9zcGFuPlxuICAgICAgPC9hPlxuICAgIDwvbGk+YDtcbiAgJCgnLm5hdiB1bCcpLmFwcGVuZChuYXYpO1xufVxuXG5mdW5jdGlvbiBpbml0VXNlckxpc3QoKSB7XG4gIGxldCB1c2VyTGlzdCA9IGdldENvb2tpZSgndXNlcmxpc3QnKVxuICB1c2VyTGlzdCA9IHVzZXJMaXN0PyB1c2VyTGlzdC5zcGxpdCgnLCcpIDogJyc7XG5cbiAgaWYgKHVzZXJMaXN0ICYmIHVzZXJMaXN0Lmxlbmd0aCkge1xuICAgIGNvbnN0IGggPSB1c2VyTGlzdC5tYXAodSA9PiB7XG4gICAgICByZXR1cm4gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQgMFwiPiR7dX08L2E+YDtcbiAgICB9KS5qb2luKCcnKTtcbiAgICAkKCcudXNlci1saXN0JykuYXBwZW5kKGgpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gIH1cblxuICAkKCcudXNlci1saXN0Jykub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdXNlciA9ICQodGhpcykudGV4dCgpLnRyaW0oKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgdXNlcj0ke3VzZXJ9OyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UOyBwYXRoPWAgKyBsb2NhdGlvbi5ob3N0O1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0sIDUwMCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICB2YXIgdmFsdWUgPSBcIjsgXCIgKyBkb2N1bWVudC5jb29raWU7XG4gIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiOyBcIiArIG5hbWUgKyBcIj1cIik7XG4gIGlmIChwYXJ0cy5sZW5ndGggPT0gMikgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KFwiO1wiKS5zaGlmdCgpO1xufVxuXG5mdW5jdGlvbiB3YXRjaFNjcm9sbCgpIHtcbiAgY29uc3QgJHNjcm9sbENvbnRhaW5lciA9ICQoJy5tYWluLWNvbnRlbnQnKTtcbiAgY29uc3QgJHRvcEVsID0gJCgnLmJhY2stdG9wJyk7XG4gIGNvbnN0IHNjcm9sbEhlaWdodCA9IDI3MDtcblxuICB3aW5kb3cuaXNCYWNrVG9wU2hvdyA9IGZhbHNlO1xuXG4gICR0b3BFbC5jc3Moe1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIGJvdHRvbTogJzUwcHgnLFxuICAgIHJpZ2h0OiAnMTAwcHgnLFxuICAgIGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLDAuNyknLFxuICAgIHdpZHRoOiAnNTBweCcsXG4gICAgaGVpZ2h0OiAnNTBweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nVG9wOiAnNXB4JyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94J1xuICB9KS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgJHNjcm9sbENvbnRhaW5lci5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDEwMCwgJ2xpbmVhcicpO1xuICB9KTtcblxuICAkKCcubmF2IC5sb2dvJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICR0b3BFbC50cmlnZ2VyKCdjbGljaycpO1xuICB9KTtcblxuICBjb25zdCB0b3BJY29uID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCemRHRnVaR0ZzYjI1bFBTSnVieUkvUGp3aFJFOURWRmxRUlNCemRtY2dVRlZDVEVsRElDSXRMeTlYTTBNdkwwUlVSQ0JUVmtjZ01TNHhMeTlGVGlJZ0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkwwZHlZWEJvYVdOekwxTldSeTh4TGpFdlJGUkVMM04yWnpFeExtUjBaQ0krUEhOMlp5QjBQU0l4TlRnMk9URTBNakV5T0RVeUlpQmpiR0Z6Y3owaWFXTnZiaUlnZG1sbGQwSnZlRDBpTUNBd0lERXdNalFnTVRBeU5DSWdkbVZ5YzJsdmJqMGlNUzR4SWlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhBdGFXUTlJakl4TWpraUlIaHRiRzV6T25oc2FXNXJQU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUwzaHNhVzVySWlCM2FXUjBhRDBpTkRBd0lpQm9aV2xuYUhROUlqUXdNQ0krUEdSbFpuTStQSE4wZVd4bElIUjVjR1U5SW5SbGVIUXZZM056SWo0OEwzTjBlV3hsUGp3dlpHVm1jejQ4Y0dGMGFDQmtQU0pOTVRreUxqRXlPQ0EzTlRBdU5UQTJOalkzWVRVeExqSWdOVEV1TWlBd0lEQWdNUzAzTnk0d05UWXROamN1TkRFek16TTBiRE0xT0M0MExUUXdPUzQyWVRVeExqSWdOVEV1TWlBd0lEQWdNU0EzTnk0d05UWWdNR3d6TlRndU5DQTBNRGt1Tm1FMU1TNHlJRFV4TGpJZ01DQXhJREV0TnpjdU1EVTJJRFkzTGpReE16TXpORXcxTVRJZ016ZzBMamt6T0RZMk55QXhPVEl1TVRJNElEYzFNQzQxTURZMk5qZDZJaUJ3TFdsa1BTSXlNVE13SWlCbWFXeHNQU0lqWm1abVptWm1JajQ4TDNCaGRHZytQQzl6ZG1jKyc7XG4gICR0b3BFbC5hcHBlbmQoYDxpbWcgc3JjPVwiJHt0b3BJY29ufVwiIHdpZHRoPVwiODAlXCI+YCk7XG5cbiAgJHNjcm9sbENvbnRhaW5lci5zY3JvbGwoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRvcCA9ICRzY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAoIXdpbmRvdy5pc0JhY2tUb3BTaG93KSB7XG4gICAgICBpZiAodG9wID49IHNjcm9sbEhlaWdodCkge1xuICAgICAgICAkdG9wRWwuZmFkZUluKDUwMCk7XG4gICAgICAgIHdpbmRvdy5pc0JhY2tUb3BTaG93ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvcCA8IHNjcm9sbEhlaWdodCkge1xuICAgICAgICAkdG9wRWwuZmFkZU91dCg1MDApO1xuICAgICAgICB3aW5kb3cuaXNCYWNrVG9wU2hvdyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4iXX0=
