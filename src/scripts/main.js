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
        <a href="${s.url}">
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
