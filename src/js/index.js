import "../less/style.less";
import BaiduSug from './baidusug';
import Consts from './consts';
import renderNavListByJson from './render_nav_list_by_json';
import renderSideCategory from './render_side_category';
import onClickAdvanceConfig from './advance-config';
import CommonDialog from './common-dialog';

const iconAdd = require('../asserts/svg/add.svg').default;

window.APP = {
  currentEngine: "baidu",
  isDialogOpen: false,
  navContainer: null,
 };

const SearchEngineNameMap = {
  baidu: "百度",
  google: "Google",
  bing: "必应"
};
const SearchEngineUrlMap = {
  baidu: 'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://cn.bing.com/search?qs=n&form=QBRE&q=',
};

$(document).ready(function() {
  const lastEngine = getLastEngine();
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
  new BaiduSug('searchInputEl', {
    className: 'hinote-search',
    border: '1px solid #ddd',
    xOffset: -1,
    callback: function(text) {
      $('#searchInputEl').val(text);
      $('#searchSubmitEl').trigger('click');
    }
  });
}

function initAdvanceConfig() {
  $('body').on('click', '.j-advance-config', function () {
    let configJson = getStoredData();
    if (!configJson) configJson = generateNavListJson();
    onClickAdvanceConfig(configJson, function(newJson) {
      renderNavListByJson(newJson, APP.navContainer);
      handlerAfterRender(newJson);
    });
  });
}

// 判断是否有本地存储的数据，读取出来展示
function initStoredData() {
  let json = getStoredData();
  if (json) {
    renderNavListByJson(json, APP.navContainer);
    handlerAfterRender();
  } else {
    json = generateNavListJson();
    renderSideCategory(json);
  }
}

// 通过 dom class 获取搜索引擎名称
function getEngineNameByDom(dom) {
  if (!dom.classList) return;

  const classList = Array.from(dom.classList);
  return classList[1];
}

function stopEngineAnimation() {
  const $enginesParent = $(".search-engine");
  $enginesParent.removeClass("animate");
}

function startEngineAnimation() {
  const $enginesParent = $(".search-engine");
  $enginesParent.addClass("animate");
}

function storeLastEngine(engine) {
  window.APP.currentEngine = engine;
  localStorage.setItem("engine", engine);
}

function getLastEngine() {
  return localStorage.getItem("engine");
}

// 切换搜索引擎
function onChangeSearchEngine(defaultEngine) {
  const $enginesParent = $(".search-engine");

  $("." + Consts.CLASS_NAME_OF_ENGINES).on("click", function() {
    const $engines = $("." + Consts.CLASS_NAME_OF_ENGINES); // 重新读取一次
    const $input = $(".search-input-el");
    const $this = $(this);
    const current = getEngineNameByDom($engines[0]);
    const target = getEngineNameByDom($this[0]);

    stopEngineAnimation();

    if (current !== target) {
      // 把target engine放到第一位
      $enginesParent.find("." + target).insertBefore($($engines[0]));
      $input.attr("placeholder", `${SearchEngineNameMap[target]}搜索`).focus();

      storeLastEngine(target);
    }

    setTimeout(() => {
      startEngineAnimation();
    }, 500);
  });

  if (defaultEngine) {
    $(`.${defaultEngine}`).trigger("click");
  }
}

// 打开搜索结果页
function goSearch(text) {
  window.open(SearchEngineUrlMap[window.APP.currentEngine] + text);
}

function onTriggerSearrch() {
  const $input = $(".search-input-el");
  const $submit = $('#searchSubmitEl');
  $submit.on('click', () => {
    const text = $input.val();
    goSearch(text);
  });
}

// 把已有的导航网站组装成JSON
function generateNavListJson(newSite) {
  const $blocks = $('.nav-block');
  const json = [];

  $blocks.each(function (i, block) {
    const title = $(block).find('h2').text();
    const category = $(block).attr('id');
    const sites = [];
    $(block).find('ul li').each(function(j, site) {
      const $site = $(site);
      const siteName = $site.text().trim();
      if (siteName !== Consts.ADD_SITE_TEXT) {
        sites.push({
          name: siteName,
          url: $site.find('a').attr('href'),
          icon: $site.find('img').attr('src'),
        });
      }
    });
    if (newSite && category === newSite.category) sites.push(newSite.info);
    json.push({ title, category, sites });
  });

  return Array.from(json);
}

// 添加一个“添加网址”的icon
function appendAddSiteIcon() {
  const tpl = `
    <li>
      <a href="javascript:;" class="j-add-site site-link" rel="nofollow">
        <span class="img-container">
          <img src="${iconAdd}" style="width: 90%;" class="site-icon">
        </span>
        <span class="site-name">${Consts.ADD_SITE_TEXT}</span>
      </a>
    </li>
  `;
  $('.nav .nav-block ul').each((i, item) => {
    const $lastLi = $(item).find('li:last-child');
    if ($lastLi.text().trim() !== Consts.ADD_SITE_TEXT) {
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
  window.localStorage.setItem(Consts.STORAGE_NAME, JSON.stringify(renderJson));
}

function getStoredData() {
  const data = localStorage.getItem(Consts.STORAGE_NAME);
  let dataJson;
  if (data) {
    try {
      dataJson = JSON.parse(data)
    } catch (err) {
      console.error('error on parse STORAGE');
    }
  }

  return dataJson;
}

// 点击“添加网址”的功能
function initAddSiteFn() {
  const addSiteDialogContent = `
    <div class="add-site-dialog-content">
      <label>
        <span>站点名称：</span>
        <input type="text" class="ipt-site-name" placeholder="淘宝网">
      </label>
    </div>
    <div class="add-site-dialog-content">
      <label>
        <span>站点网址：</span>
        <input type="text" class="ipt-site-url" placeholder="https://www.taobao.com">
      </label>
    </div>
    <div class="add-site-dialog-content">
      <label>
        <span>图标链接：</span>
        <input type="text" class="ipt-site-icon" placeholder="选填: https://img.alicdn.com/xxx.png">
      </label>
    </div>
  `;

  $('body').on('click', '.j-add-site', function () {
    if (window.APP.isDialogOpen) return;
    const category = $(this).parents('.nav-block').attr('id');

    const d = dialog({
      title: '  ',
      width: 500,
      skin: 'dialog-add-site dialog-common',
      content: addSiteDialogContent,
      statusbar: '<div class="dialog-error hide">Error</div>',
      okValue: '确定',
      onclose: function () {
        window.APP.isDialogOpen = false;
      },
      ok: function () {
        const newSite = {
          category,
          info: {
            name: $('.dialog-add-site .ipt-site-name').val().trim(),
            url: $('.dialog-add-site .ipt-site-url').val().trim(),
            icon: $('.dialog-add-site .ipt-site-icon').val().trim() || Consts.DEFAULT_ICON,
          },
        };
        const showError = (msg) => {
          const $error = $('.dialog-common .dialog-error')
          $error.html(msg).removeClass('hide');
          setTimeout(() => {
            $error.html('').addClass('hide');
          }, 3000);
        }

        if (!newSite.info.name) {
          showError('请填写站点名称');
          return false;
        }
        if (!newSite.info.url) {
          showError('请填写站点网址');
          return false;
        }
        const json = generateNavListJson(newSite);
        renderNavListByJson(json, APP.navContainer);
        handlerAfterRender(json);
      },
    });

    d.show();
    window.APP.isDialogOpen = true;
  });
}

function handleIconLoadError() {
  $('img.site-icon').on('error', function () {
    $(this).attr('src', Consts.DEFAULT_ICON);
  })
}

function deleteSiteByCategoryIndex(json, category, index) {
  const categoryIndex = json.findIndex(obj => obj.category === category);
  if (index > -1) {
    json[categoryIndex].sites.splice(index, 1);
  }
  return json;
}

function initDeleteable() {
  var timer;
  $('.nav').on('mouseenter', 'a.site-link', function () {
    const $this = $(this)
    timer = setTimeout(() => { $this.addClass('deleteable'); }, 500);
  }).on('mouseleave', 'a.site-link', function () {
    clearTimeout(timer);
    $(this).removeClass('deleteable');
  }).on('click', 'i.del', function (e) {
    e.preventDefault();
    e.stopPropagation();

    CommonDialog.confirm('确定要删除吗？', () => {
      const $li = $(this).parents('li');
      const index = $li.index();
      const category = $(this).parents('.nav-block').attr('id');

      const json = generateNavListJson();
      const newJson = deleteSiteByCategoryIndex(json, category, index);
      renderNavListByJson(newJson, APP.navContainer);
      handlerAfterRender(newJson);
    });
  });
}
