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

  setTimeout(() => {
    $('#searchInputEl').focus();
  }, 500);
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
    baidu: 'https://gallenhu.github.io/allso/#',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhaWR1c3VnLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog55m+5bqm5pCc57Si5bu66K6u77yM55m+5bqm5pCc57Si5o+Q56S6XG4gKiDnlKjms5XvvJpuZXcgQmFpZHVTdWcoZG9tSWQsIGNvbmZpZylcbiAqIEJhaWR1U3VnZ2VzdGlvbkNCIOS4uuWFqOWxgOWPmOmHj++8jOeUqOS6juaQnOe0ouW7uuiuruWbnuiwg+WHveaVsFxuICpcbiAqIOaUr+aMgeeahOWPguaVsO+8mlxuICogY29uZmlnLmNhbGxiYWNrICAgICAg6YCJ5Lit57uT5p6c5Zue6LCD5Ye95pWwXG4gKiBjb25maWcuY2xhc3NOYW1lICAgICDpop3lpJbnmoRjbGFzcyBuYW1lXG4gKiBjb25maWcud2lkdGhcbiAqIGNvbmZpZy54T2Zmc2V0XG4gKiBjb25maWcueU9mZnNldFxuICogY29uZmlnLmJhY2tncm91bmRcbiAqIGNvbmZpZy56SW5kZXhcbiAqIGNvbmZpZy5zaGFkb3dcbiAqIGNvbmZpZy5ib3JkZXJcbiAqIGNvbmZpZy5saVBhZGRpbmdcbiAqIGNvbmZpZy5saUNvbG9yXG4gKiBjb25maWcubWF4Q291bnQgICAgICDmmL7npLrnmoTmnIDlpJrnu5PmnpzmlbDph49cbiAqXG4gKi9cbmZ1bmN0aW9uIEJhaWR1U3VnKGRvbUlkLCBjb25maWcpIHtcbiAgdGhpcy5kb21JZCA9IGRvbUlkO1xuICB0aGlzLmRvbUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSWQpO1xuICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgdGhpcy5jb25maWcubWF4Q291bnQgPSB0aGlzLmNvbmZpZy5tYXhDb3VudCB8fCAxMDtcbiAgdGhpcy5yZXN1bHRDbGFzc05hbWUgPSAnYmFpZHUtc3VnLXJlc3VsdC0nICsgRGF0ZS5ub3coKTsgLy8gdWlkXG4gIHRoaXMuY3VycmVudExpSW5kZXggPSAtMTtcbiAgdGhpcy5pc01vdmluZ0N1cnNvciA9IGZhbHNlO1xuXG4gIHRoaXMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW4sIGRlbGF5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIGxldCBfYXJncyA9IGFyZ3M7XG4gICAgICBjbGVhclRpbWVvdXQoZnVuLmlkKTtcbiAgICAgIGZ1bi5pZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bi5jYWxsKHRoYXQsIF9hcmdzKTtcbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9O1xuICB9O1xuXG4gIHRoaXMuZ2V0U2VhcmNoVGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRvbUlkKS52YWx1ZS50cmltKCk7XG4gIH07XG5cbiAgdGhpcy5sb2FkU2NyaXB0ID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHZhciB1aWQgPSAnc2NyaXB0XycgKyBEYXRlLm5vdztcbiAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQpLnJlbW92ZSgpO1xuICAgIH07XG4gICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICBzY3JpcHQuaWQgPSB1aWQ7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9O1xuXG4gIHRoaXMuZGVib3VuY2VTZWFyY2hTdWdnZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAvLyDnp7vliqjlhYnmoIfmk43kvZzvvIzkuI3opoHov5vooYzlkI7nu63mkJzntKJcbiAgICAgIGlmIChzZWxmLmlzTW92aW5nQ3Vyc29yKSB7XG4gICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VhcmNoVGV4dCA9IHNlbGYuZ2V0U2VhcmNoVGV4dCgpO1xuICAgICAgdmFyIHQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBzZWxmLmxvYWRTY3JpcHQoXG4gICAgICAgICdodHRwczovL3d3dy5iYWlkdS5jb20vc3U/Y2I9QmFpZHVTdWdnZXN0aW9uQ0ImdD0nICtcbiAgICAgICAgICB0ICtcbiAgICAgICAgICAnJndkPScgK1xuICAgICAgICAgIHNlYXJjaFRleHRcbiAgICAgICk7XG4gICAgfSwgNDAwKTtcbiAgfTtcblxuICB0aGlzLnNob3dSZXN1bHQgPSBmdW5jdGlvbihyZXN1bHQsIGNvbmZpZykge1xuICAgIHRoaXMuY3VycmVudExpSW5kZXggPSAtMTsgLy8gc2hvd1Jlc3VsdOS8mumHjeaWsOeUn+aIkOWGheWuue+8jOaJgOS7peimgemHjee9riBMaUluZGV4XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlc3VsdExlbiA9IHJlc3VsdC5sZW5ndGg7XG4gICAgdmFyIG1heENvdW50ID0gY29uZmlnLm1heENvdW50O1xuICAgIHZhciBkb21JbnB1dCA9IHRoaXMuZG9tSW5wdXQ7XG4gICAgdmFyIGRvbVdpZHRoID0gZG9tSW5wdXQub2Zmc2V0V2lkdGg7XG4gICAgdmFyIGRlZmF1bHRDbGFzc05hbWUgPSB0aGlzLnJlc3VsdENsYXNzTmFtZTtcbiAgICB2YXIgcmVzdWx0RG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyB0aGlzLnJlc3VsdENsYXNzTmFtZSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMYXllcihjb25maWcpIHtcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSBjb25maWcuY2xhc3NOYW1lXG4gICAgICAgID8gY29uZmlnLmNsYXNzTmFtZSArICcgJyArIGRlZmF1bHRDbGFzc05hbWVcbiAgICAgICAgOiBkZWZhdWx0Q2xhc3NOYW1lO1xuICAgICAgZGl2LnN0eWxlID0gW1xuICAgICAgICAnd2lkdGg6ICcgKyAoY29uZmlnLndpZHRoID8gY29uZmlnLndpZHRoIDogZG9tV2lkdGgpICsgJ3B4JyxcbiAgICAgICAgJ3Bvc2l0aW9uOiBhYnNvbHV0ZScsXG4gICAgICAgICdsZWZ0OiAwJyxcbiAgICAgICAgJ3RvcDogMTAwJScsXG4gICAgICAgICd0cmFuc2Zvcm06JyArICd0cmFuc2xhdGVYKCcrIChjb25maWcueE9mZnNldCB8fCAwKSArJ3B4KSdcbiAgICAgICAgICArICcgdHJhbnNsYXRlWSgnKyAoY29uZmlnLnlPZmZzZXQgfHwgMCkgKydweCknLFxuICAgICAgICAnYmFja2dyb3VuZDogJyArIChjb25maWcuYmFja2dyb3VuZCA/IGNvbmZpZy5iYWNrZ3JvdW5kIDogJyNmZmYnKSxcbiAgICAgICAgJ3otaW5kZXg6ICcgKyAoY29uZmlnLnpJbmRleCA/IGNvbmZpZy56SW5kZXggOiAnOTk5JyksXG4gICAgICAgICdib3gtc2hhZG93OiAnICtcbiAgICAgICAgICAoY29uZmlnLnNoYWRvdyA/IGNvbmZpZy5zaGFkb3cgOiAnMXB4IDFweCAzcHggcmdiYSgwLCAwLCAwLCAuMSknKSxcbiAgICAgICAgJ2JvcmRlcjogJyArIChjb25maWcuYm9yZGVyID8gY29uZmlnLmJvcmRlciA6ICcxcHggc29saWQgI2RkZCcpXG4gICAgICBdLmpvaW4oJzsnKTtcblxuICAgICAgZG9tSW5wdXQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZXN1bHRDb250ZW50KHJlc3VsdCkge1xuICAgICAgdmFyIHVsID0gWyc8dWwgc3R5bGU9XCJsaXN0LXN0eWxlOm5vbmU7Y3Vyc29yOmRlZmF1bHQ7cGFkZGluZzowXCI+J107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE1hdGgubWluKHJlc3VsdExlbiwgbWF4Q291bnQpOyBpKyspIHtcbiAgICAgICAgdWwucHVzaCgnPGxpIGRhdGEtaT1cIicgKyBpICsgJ1wiPicgKyByZXN1bHRbaV0gKyAnPC9saT4nKTtcbiAgICAgIH1cbiAgICAgIHVsLnB1c2goJzwvdWw+Jyk7XG4gICAgICByZXR1cm4gdWwuam9pbignJyk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdERvbSkge1xuICAgICAgcmVzdWx0RG9tLmlubmVySFRNTCA9IGdldFJlc3VsdENvbnRlbnQocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3JlYXRlTGF5ZXIoXG4gICAgICAgIGNvbmZpZ1xuICAgICAgKS5pbm5lckhUTUwgPSBnZXRSZXN1bHRDb250ZW50KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgdmFyIGxpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5yZXN1bHRDbGFzc05hbWUgKyAnIGxpJyk7XG4gICAgdmFyIG9uTW91c2VFbnRlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWknKTtcbiAgICAgIHNlbGYuc2V0Q3VycmVudExpKGksIHRydWUpO1xuICAgIH07XG4gICAgdmFyIG9uQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICBzZWxmLm9uU3VibWl0KGUudGFyZ2V0LmlubmVyVGV4dCk7XG4gICAgICBzZWxmLmN1cnJlbnRMaUluZGV4ID0gLTE7XG4gICAgICBzZWxmLmNsZWFyUmVzdWx0KCk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGlzW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpO1xuICAgICAgbGlzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpO1xuICAgICAgbGlzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG4gICAgICBsaXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5jbGVhclJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lKTtcbiAgICBpZiAocmVzdWx0RG9tKSByZXN1bHREb20ucmVtb3ZlKCk7XG4gIH07XG5cbiAgLy8g5re75Yqg5YWo5bGA5qC35byPXG4gIHRoaXMuYWRkU3R5bGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGVhZFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICB2YXIgbGlTZWxlY3RvciA9ICcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lICsgJyBsaSc7XG4gICAgdmFyIGxpU3R5bGUgPSBbXG4gICAgICAnaGVpZ2h0OjMwcHgnLFxuICAgICAgJ2xpbmUtaGVpZ2h0OjMwcHgnLFxuICAgICAgJ3BhZGRpbmc6JyArIChjb25maWcubGlQYWRkaW5nID8gY29uZmlnLmxpUGFkZGluZyA6ICcwIDZweCcpLFxuICAgICAgJ2NvbG9yOicgKyAoY29uZmlnLmxpQ29sb3IgPyBjb25maWcubGlDb2xvciA6ICcjMDAwJylcbiAgICBdLmpvaW4oJzsnKTtcbiAgICB2YXIgaGVhZFN0eWxlQ29udGVudCA9IGxpU2VsZWN0b3IgKyAneycgKyBsaVN0eWxlICsgJ30nO1xuICAgIGhlYWRTdHlsZUNvbnRlbnQgKz0gbGlTZWxlY3RvciArICcuY3VycmVudCB7IGJhY2tncm91bmQ6ICNjY2M7IH0nO1xuXG4gICAgaGVhZFN0eWxlLmlubmVySFRNTCA9IGhlYWRTdHlsZUNvbnRlbnQ7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChoZWFkU3R5bGUpO1xuICB9O1xuXG4gIC8vIOa3u+WKoOWFqOWxgOaMiemUruebkeWQrFxuICB0aGlzLmFkZEtleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDI3KSB7IC8vIGVzY1xuICAgICAgICBzZWxmLmNsZWFyUmVzdWx0KCk7XG4gICAgICAgIGlmIChlLnRhcmdldC5pZCA9PT0gc2VsZi5kb21JZCkge1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlOyAvLyBlc2Mg5Lmf6KaB56aB5q2i5ZCO57ut5pCc57SiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnNldEN1cnJlbnRMaSA9IGZ1bmN0aW9uKGluZGV4LCBkaXNhYmxlSW5wdXRDaGFuZ2UpIHtcbiAgICB2YXIgcmVzdWx0TGlEb21zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICcuJyArIHRoaXMucmVzdWx0Q2xhc3NOYW1lICsgJyBsaSdcbiAgICApO1xuICAgIHZhciBjdXJyZW50TGkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJy4nICsgdGhpcy5yZXN1bHRDbGFzc05hbWUgKyAnIGxpLmN1cnJlbnQnXG4gICAgKTtcbiAgICB2YXIgcmVzdWx0TGVuID0gcmVzdWx0TGlEb21zLmxlbmd0aDtcblxuICAgIGlmIChyZXN1bHRMZW4pIHtcbiAgICAgIGlmIChpbmRleCA8IDApIGluZGV4ID0gcmVzdWx0TGVuICsgaW5kZXg7XG4gICAgICBpZiAoaW5kZXggPiByZXN1bHRMZW4gLSAxKSBpbmRleCA9IGluZGV4IC0gcmVzdWx0TGVuO1xuXG4gICAgICBpZiAoY3VycmVudExpKSBjdXJyZW50TGkuY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpO1xuICAgICAgcmVzdWx0TGlEb21zW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XG5cbiAgICAgIC8vIOaYr+WQpuWPquaUueWPmOmrmOS6rueKtuaAge+8jOS4jeaUueWPmOi+k+WFpeWGheWuuVxuICAgICAgaWYgKCFkaXNhYmxlSW5wdXRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5kb21JbnB1dC52YWx1ZSA9IHJlc3VsdExpRG9tc1tpbmRleF0uaW5uZXJUZXh0O1xuICAgICAgICB0aGlzLmN1cnJlbnRMaUluZGV4ID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHRoaXMub25TdWJtaXQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIGNiID1cbiAgICAgIHRoaXMuY29uZmlnLmNhbGxiYWNrIHx8XG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N1Ym1pdCB0ZXh0OiAnICsgdGV4dCk7XG4gICAgICB9O1xuICAgIGNiKHRleHQpO1xuICAgIHRoaXMuZG9tSW5wdXQuYmx1cigpO1xuICB9O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHdpbmRvdy5CYWlkdVN1Z2dlc3Rpb25DQiA9IGZ1bmN0aW9uKHJlcykge1xuICAgICAgaWYgKHJlcyAmJiByZXMucyAmJiByZXMucy5sZW5ndGgpIHtcbiAgICAgICAgc2VsZi5zaG93UmVzdWx0KHJlcy5zLCBzZWxmLmNvbmZpZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmNsZWFyUmVzdWx0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLmRvbUlucHV0KSB7XG4gICAgICBzZWxmLmRvbUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBlbnRlclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgIHNlbGYuY3VycmVudExpSW5kZXggPSAtMTtcbiAgICAgICAgICBzZWxmLmNsZWFyUmVzdWx0KCk7XG4gICAgICAgICAgc2VsZi5vblN1Ym1pdChzZWxmLmdldFNlYXJjaFRleHQoKSk7XG4gICAgICAgICAgc2VsZi5pc01vdmluZ0N1cnNvciA9IHRydWU7IC8vIOWbnui9puS5n+imgeemgeatouWQjue7reaQnOe0olxuICAgICAgICB9XG4gICAgICAgIC8vIHVwXG4gICAgICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzgpIHtcbiAgICAgICAgICBzZWxmLnNldEN1cnJlbnRMaShzZWxmLmN1cnJlbnRMaUluZGV4IC0gMSk7XG4gICAgICAgICAgc2VsZi5pc01vdmluZ0N1cnNvciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG93blxuICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IDQwKSB7XG4gICAgICAgICAgc2VsZi5zZXRDdXJyZW50TGkoc2VsZi5jdXJyZW50TGlJbmRleCArIDEpO1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxlZnQsIHJpZ2h0XG4gICAgICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzcgfHwgZS5rZXlDb2RlID09PSAzOSkge1xuICAgICAgICAgIHNlbGYuaXNNb3ZpbmdDdXJzb3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5kb21JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuZGVib3VuY2VTZWFyY2hTdWdnZXN0KCkpO1xuICAgICAgc2VsZi5kb21JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAzOCkgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyDnpoHmraLmlrnlkJHkuIrplK7np7vliqjlhYnmoIfliLDlj6XpppZcbiAgICAgIH0pO1xuICAgICAgc2VsZi5kb21JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS50YXJnZXQuc2VsZWN0KCk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5hZGRTdHlsZSgpO1xuICAgICAgc2VsZi5hZGRLZXlkb3duTGlzdGVuZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gc3RhcnRcbiAgdGhpcy5pbml0KCk7XG59XG4iLCIkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gICQoJy5lbmdpbmUtY2hvb3NlJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIG9uQ2xpY2tFbmdpbmUoXG4gICAgICAkKHRoaXMpLmF0dHIoJ2NsYXNzJykucmVwbGFjZSgnZW5naW5lLWNob29zZSAnLCAnJykudG9Mb3dlckNhc2UoKVxuICAgICk7XG4gIH0pO1xuICAkKCcubmF2LXRvZ2dsZScpLmNsaWNrKG9uQ2xpY2tOYXZUb2dnbGUpO1xuICAkKCcubmF2LXRvZ2dsZScpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIGlmICgkKCcubWFpbi1pbm5lcicpLmhhc0NsYXNzKCdpcy1uYXYtc2hyaW5rJykpIHtcbiAgICAgIG9uQ2xpY2tOYXZUb2dnbGUoKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoJy5zZWFyY2gtZm9ybScpLm9uKCdzdWJtaXQnLCBvblNlYXJjaEZvcm1TdWJtaXQpO1xuICBpbml0QmFpZHVTdWcoKTtcbiAgb25TaXRlSWNvbkVycm9yKCk7XG4gIG9uQ2xpY2tOYXYoKTtcbiAgaW5pdFVzZXJTaXRlcygpO1xuICBpbml0VXNlckxpc3QoKTtcbiAgd2F0Y2hTY3JvbGwoKTtcblxuICBjb25zdCBsYXN0RW5naW5lID0gZ2V0TGFzdEVuZ2luZSgpIHx8ICcnO1xuICBjb25zdCBuYXZTaHJpbmsgPSBnZXROYXZTaHJpbmsoKSB8fCAnJztcbiAgaWYgKGxhc3RFbmdpbmUpIHtcbiAgICAkKGAuZW5naW5lLWNob29zZS4ke2xhc3RFbmdpbmV9YCkudHJpZ2dlcignY2xpY2snKTtcbiAgfVxuICBpZiAoIW5hdlNocmluaykge1xuICAgICQoJy5tYWluLWlubmVyJykucmVtb3ZlQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKTtcbiAgfVxuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICQoJyNzZWFyY2hJbnB1dEVsJykuZm9jdXMoKTtcbiAgfSwgNTAwKTtcbn0pO1xuXG5mdW5jdGlvbiBvbkNsaWNrRW5naW5lKGVuZ2luZSkge1xuICAkKCcuc2VhcmNoZXItbG9nbycpLmF0dHIoJ2NsYXNzJywgJ3NlYXJjaGVyLWxvZ28nKS5hZGRDbGFzcyhlbmdpbmUpO1xuICAkKCcuZW5naW5lLWNob29zZScpLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICQoYC5lbmdpbmUtY2hvb3NlLiR7ZW5naW5lfWApLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gICQoJyNzZWFyY2hJbnB1dEVsJykuYXR0cigncGxhY2Vob2xkZXInLCBgJHtmaXJzdFVwcGVyQ2FzZShlbmdpbmUpfSDmkJzntKJgKTtcbiAgc3RvcmVMYXN0RW5naW5lKGVuZ2luZSk7XG59XG5cbmZ1bmN0aW9uIGZpcnN0VXBwZXJDYXNlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKCB8XilbYS16XS9nLCAoTCkgPT4gTC50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZnVuY3Rpb24gc3RvcmVMYXN0RW5naW5lKGVuZ2luZSkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZW5naW5lJywgZW5naW5lKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdEVuZ2luZSgpIHtcbiAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlbmdpbmUnKTtcbn1cblxuZnVuY3Rpb24gZ2V0TmF2U2hyaW5rKCkge1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25hdi1zaHJpbmsnKTtcbn1cblxuZnVuY3Rpb24gb25DbGlja05hdlRvZ2dsZSgpIHtcbiAgaWYgKCQoJy5tYWluLWlubmVyJykuaGFzQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCduYXYtc2hyaW5rJyk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ25hdi1zaHJpbmsnLCAnMScpO1xuICB9XG4gICQoJy5tYWluLWlubmVyJykudG9nZ2xlQ2xhc3MoJ2lzLW5hdi1zaHJpbmsnKTtcbn1cblxuZnVuY3Rpb24gb25TZWFyY2hGb3JtU3VibWl0KGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCB0ZXh0ID0gJCgnI3NlYXJjaElucHV0RWwnKS52YWwoKTtcbiAgY29uc3QgZW5naW5lID0gJCgnLnNlYXJjaGVyLWxvZ28nKVxuICAgIC5hdHRyKCdjbGFzcycpXG4gICAgLnJlcGxhY2UoJ3NlYXJjaGVyLWxvZ28gJywgJycpO1xuICBnb1NlYXJjaChlbmdpbmUsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBpbml0QmFpZHVTdWcoKSB7XG4gIG5ldyBCYWlkdVN1Zygnc2VhcmNoSW5wdXRFbCcsIHtcbiAgICBjbGFzc05hbWU6ICdoaW5vdGUtc2VhcmNoJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgI2RkZCcsXG4gICAgeE9mZnNldDogLTEsXG4gICAgbWF4Q291bnQ6IDksXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAkKCcjc2VhcmNoSW5wdXRFbCcpLnZhbCh0ZXh0KTtcbiAgICAgICQoJyNzZWFyY2hTdWJtaXRFbCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdvU2VhcmNoKGVuZ2luZSwgdGV4dCkge1xuICBjb25zdCBTZWFyY2hFbmdpbmVVcmxNYXAgPSB7XG4gICAgYmFpZHU6ICdodHRwczovL2dhbGxlbmh1LmdpdGh1Yi5pby9hbGxzby8jJyxcbiAgICBnb29nbGU6ICdodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPScsXG4gICAgZG9nZWRvZ2U6ICdodHRwczovL3d3dy5kb2dlZG9nZS5jb20vcmVzdWx0cz9xPScsXG4gIH07XG5cbiAgd2luZG93Lm9wZW4oU2VhcmNoRW5naW5lVXJsTWFwW2VuZ2luZV0gKyB0ZXh0KTtcbn1cblxuZnVuY3Rpb24gb25TaXRlSWNvbkVycm9yKCkge1xuICBjb25zdCBlcnJJbWcgPSAnaHR0cHM6Ly9pLmxvbGkubmV0LzIwMjAvMDQvMTMvSkh6ZWZicWdGV1RDSURpLnBuZyc7XG4gICQoJy5zaXRlcyBpbWcnKS5vbignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzKS5vZmYoJ2Vycm9yJykuYXR0cignc3JjJywgZXJySW1nKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2xpY2tOYXYoKSB7XG4gICQoJy5uYXYgdWwnKS5vbignY2xpY2snLCAnYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9ICQodGhpcykuYXR0cignaHJlZicpLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgY29uc3QgdG9wID0gJChgI2NhdGVnb3J5XyR7dGFyZ2V0fWApWzBdLm9mZnNldFRvcDtcbiAgICAkKCcubWFpbi1jb250ZW50JylbMF0uc2Nyb2xsVG9wID0gdG9wO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJTaXRlcygpIHtcbiAgY29uc3QgdXNlclNpdGVzID0gd2luZG93LkFQUF9DT05GSUcgJiYgd2luZG93LkFQUF9DT05GSUcudXNlcl9zaXRlcztcbiAgaWYgKHVzZXJTaXRlcyAmJiB1c2VyU2l0ZXMubGVuZ3RoKSB7XG4gICAgdXNlclNpdGVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XG4gICAgICBnZW5lcmF0ZVNpdGVTZWN0aW9uKGNhdGVnb3J5LnVpZCwgY2F0ZWdvcnkuYWxpYXMsIGNhdGVnb3J5LnNpdGVzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oJ+ayoeacieeUqOaIt+mFjee9ruWvvOiIqu+8gScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2l0ZVNlY3Rpb24oY2F0ZWdvcnlJZCwgY2F0ZWdvcnlOYW1lLCBzaXRlcykge1xuICBjb25zdCBiYXNlID0gYFxuICA8ZGl2IGNsYXNzPVwic2l0ZXMtc2VjdGlvblwiPlxuICA8aDIgY2xhc3M9XCJjYXRlZ29yeVwiIGlkPVwiY2F0ZWdvcnlfJHtjYXRlZ29yeUlkfVwiPlxuICAgIDxzcGFuPiR7Y2F0ZWdvcnlOYW1lfTwvc3Bhbj5cbiAgPC9oMj5cbiAgPHVsPmA7XG5cbiAgY29uc3QgbGlzdCA9IHNpdGVzXG4gICAgLm1hcCgocykgPT4ge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj1cIiR7cy51cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICAgIDxpbWcgc3JjPVwiJHtzLmljb259XCI+XG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8c3Bhbj4ke3MubmFtZX08L3NwYW4+XG4gICAgICAgICAgICA8cD4ke3MuZGVzYyB8fCBzLnVybH08L3A+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPmA7XG4gICAgfSlcbiAgICAuam9pbignJyk7XG5cbiAgY29uc3QgaCA9IGJhc2UgKyBsaXN0ICsgJzwvdWw+PC9kaXY+JztcblxuICAkKCcubWFpbi1jb250ZW50IC5zaXRlcycpLmFwcGVuZChoKTtcblxuICBjb25zdCBuYXYgPSBgXG4gICAgPGxpPlxuICAgICAgPGEgaHJlZj1cIiMke2NhdGVnb3J5SWR9XCI+XG4gICAgICAgIDxzcGFuPiR7Y2F0ZWdvcnlOYW1lfTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L2xpPmA7XG4gICQoJy5uYXYgdWwnKS5hcHBlbmQobmF2KTtcbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJMaXN0KCkge1xuICBsZXQgdXNlckxpc3QgPSBnZXRDb29raWUoJ3VzZXJsaXN0JylcbiAgdXNlckxpc3QgPSB1c2VyTGlzdD8gdXNlckxpc3Quc3BsaXQoJywnKSA6ICcnO1xuXG4gIGlmICh1c2VyTGlzdCAmJiB1c2VyTGlzdC5sZW5ndGgpIHtcbiAgICBjb25zdCBoID0gdXNlckxpc3QubWFwKHUgPT4ge1xuICAgICAgcmV0dXJuIGA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkIDBcIj4ke3V9PC9hPmA7XG4gICAgfSkuam9pbignJyk7XG4gICAgJCgnLnVzZXItbGlzdCcpLmFwcGVuZChoKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICB9XG5cbiAgJCgnLnVzZXItbGlzdCcpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHVzZXIgPSAkKHRoaXMpLnRleHQoKS50cmltKCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gYHVzZXI9JHt1c2VyfTsgZXhwaXJlcz1GcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IEdNVDsgcGF0aD1gICsgbG9jYXRpb24uaG9zdDtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9LCA1MDApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgdmFyIHZhbHVlID0gXCI7IFwiICsgZG9jdW1lbnQuY29va2llO1xuICB2YXIgcGFydHMgPSB2YWx1ZS5zcGxpdChcIjsgXCIgKyBuYW1lICsgXCI9XCIpO1xuICBpZiAocGFydHMubGVuZ3RoID09IDIpIHJldHVybiBwYXJ0cy5wb3AoKS5zcGxpdChcIjtcIikuc2hpZnQoKTtcbn1cblxuZnVuY3Rpb24gd2F0Y2hTY3JvbGwoKSB7XG4gIGNvbnN0ICRzY3JvbGxDb250YWluZXIgPSAkKCcubWFpbi1jb250ZW50Jyk7XG4gIGNvbnN0ICR0b3BFbCA9ICQoJy5iYWNrLXRvcCcpO1xuICBjb25zdCBzY3JvbGxIZWlnaHQgPSAyNzA7XG5cbiAgd2luZG93LmlzQmFja1RvcFNob3cgPSBmYWxzZTtcblxuICAkdG9wRWwuY3NzKHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICBib3R0b206ICc1MHB4JyxcbiAgICByaWdodDogJzEwMHB4JyxcbiAgICBiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwwLjcpJyxcbiAgICB3aWR0aDogJzUwcHgnLFxuICAgIGhlaWdodDogJzUwcHgnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgcGFkZGluZ1RvcDogJzVweCcsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCdcbiAgfSkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICRzY3JvbGxDb250YWluZXIuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAxMDAsICdsaW5lYXInKTtcbiAgfSk7XG5cbiAgJCgnLm5hdiAubG9nbycpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAkdG9wRWwudHJpZ2dlcignY2xpY2snKTtcbiAgfSk7XG5cbiAgY29uc3QgdG9wSWNvbiA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQnpkR0Z1WkdGc2IyNWxQU0p1YnlJL1Bqd2hSRTlEVkZsUVJTQnpkbWNnVUZWQ1RFbERJQ0l0THk5WE0wTXZMMFJVUkNCVFZrY2dNUzR4THk5RlRpSWdJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMGR5WVhCb2FXTnpMMU5XUnk4eExqRXZSRlJFTDNOMlp6RXhMbVIwWkNJK1BITjJaeUIwUFNJeE5UZzJPVEUwTWpFeU9EVXlJaUJqYkdGemN6MGlhV052YmlJZ2RtbGxkMEp2ZUQwaU1DQXdJREV3TWpRZ01UQXlOQ0lnZG1WeWMybHZiajBpTVM0eElpQjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQXRhV1E5SWpJeE1qa2lJSGh0Ykc1ek9uaHNhVzVyUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMM2hzYVc1cklpQjNhV1IwYUQwaU5EQXdJaUJvWldsbmFIUTlJalF3TUNJK1BHUmxabk0rUEhOMGVXeGxJSFI1Y0dVOUluUmxlSFF2WTNOeklqNDhMM04wZVd4bFBqd3ZaR1ZtY3o0OGNHRjBhQ0JrUFNKTk1Ua3lMakV5T0NBM05UQXVOVEEyTmpZM1lUVXhMaklnTlRFdU1pQXdJREFnTVMwM055NHdOVFl0TmpjdU5ERXpNek0wYkRNMU9DNDBMVFF3T1M0MllUVXhMaklnTlRFdU1pQXdJREFnTVNBM055NHdOVFlnTUd3ek5UZ3VOQ0EwTURrdU5tRTFNUzR5SURVeExqSWdNQ0F4SURFdE56Y3VNRFUySURZM0xqUXhNek16TkV3MU1USWdNemcwTGprek9EWTJOeUF4T1RJdU1USTRJRGMxTUM0MU1EWTJOamQ2SWlCd0xXbGtQU0l5TVRNd0lpQm1hV3hzUFNJalptWm1abVptSWo0OEwzQmhkR2crUEM5emRtYysnO1xuICAkdG9wRWwuYXBwZW5kKGA8aW1nIHNyYz1cIiR7dG9wSWNvbn1cIiB3aWR0aD1cIjgwJVwiPmApO1xuXG4gICRzY3JvbGxDb250YWluZXIuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0b3AgPSAkc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcCgpO1xuXG4gICAgaWYgKCF3aW5kb3cuaXNCYWNrVG9wU2hvdykge1xuICAgICAgaWYgKHRvcCA+PSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgJHRvcEVsLmZhZGVJbig1MDApO1xuICAgICAgICB3aW5kb3cuaXNCYWNrVG9wU2hvdyA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0b3AgPCBzY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgJHRvcEVsLmZhZGVPdXQoNTAwKTtcbiAgICAgICAgd2luZG93LmlzQmFja1RvcFNob3cgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuIl19
