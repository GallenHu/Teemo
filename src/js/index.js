import "../less/style.less";
import BaiduSug from '../js/baidusug';

const iconAdd = require('../asserts/svg/add.svg').default;

window.app = {
  currentEngine: "baidu",
  isDialogOpen: false,
 };

const ClassNameOfEngines = "engine-logo";
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
  startEngineAnimation();
  onChangeSearchEngine(lastEngine || "");
  onTriggerSearrch();
  initAddSiteFn();

  new BaiduSug('searchInputEl', {
    className: 'hinote-search',
    border: '1px solid #ddd',
    xOffset: -1,
    callback: function() {
      $('#searchSubmitEl').trigger('click');
    }
  });
});

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
  window.app.currentEngine = engine;
  localStorage.setItem("engine", engine);
}

function getLastEngine() {
  return localStorage.getItem("engine");
}

// 切换搜索引擎
function onChangeSearchEngine(defaultEngine) {
  const $enginesParent = $(".search-engine");

  $("." + ClassNameOfEngines).on("click", function() {
    const $engines = $("." + ClassNameOfEngines); // 重新读取一次
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
  window.open(SearchEngineUrlMap[window.app.currentEngine] + text);
}

function onTriggerSearrch() {
  const $input = $(".search-input-el");
  const $submit = $('#searchSubmitEl');
  $submit.on('click', () => {
    const text = $input.val();
    goSearch(text);
  });
}

function initAddSiteFn() {
  const tpl = `
    <li>
      <a href="javascript:;" class="j-add-site site-link" rel="nofollow">
        <span class="img-container">
          <img src="${iconAdd}" style="width: 90%;" class="site-icon">
        </span>
        <span class="site-name">添加网址</span>
      </a>
    </li>
  `;
  const addSiteDialogContent = `
    <div>
      <label>
        <span>站点名称：</span>
        <input type="text">
      </label>
    </div>
    <div>
      <label>
        <span>站点网址：</span>
        <input type="text">
      </label>
    </div>
    <div>
      <label>
        <span>站点图标：</span>
        <input type="text" placeholder="选填">
      </label>
    </div>
  `;
  $('.nav .nav-block ul').each((i, item) => {
    $(item).append(tpl);
  });
  $('body').on('click', '.j-add-site', function () {
    if (window.app.isDialogOpen) return;

    var d = dialog({
      title: '  ',
      width: 500,
      skin: 'dialog-add-site',
      content: addSiteDialogContent,
      okValue: '确定',
      onclose: function () {
        window.app.isDialogOpen = false;
      },
      ok: function () {
        console.log('11');
        // return false;
      },
    });
    d.show();
    window.app.isDialogOpen = true;
  });
}
