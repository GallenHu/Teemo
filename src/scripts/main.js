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
    baidu: 'https://www.baidu.com/s?wd=',
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
