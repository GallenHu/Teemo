window.APP = {
  currentEngine: 'baidu'
};
const SearchEngineUrlMap = {
  baidu: 'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://cn.bing.com/search?qs=n&form=QBRE&q='
};
const SearchEngineNameMap = {
  baidu: '百度',
  google: 'Google',
  bing: '必应'
};

$(document).ready(() => {
  handleAddProfile();
  initBaiduSug();
  initFullpage();
  startEngineAnimation();
  onChangeSearchEngine(getLastEngine() || '');
  $('[data-toggle="tooltip"]').tooltip();
  handleBeforeAddSite();
  handleAddSite();
  initLogout();
});

/**
 * 添加 Profile
 */
function handleAddProfile() {
  $('.j-addcategory-submit').on('click', () => {
    const name = $('#addCategoryName')
      .val()
      .trim();
    const order = $('#addCategoryOrder')
      .val()
      .trim();

    if (!name) {
      toast('请填写名称');
      return;
    }

    $.ajax({
      url: '/category/create',
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      traditional: true,
      data: JSON.stringify({
        name,
        order
      })
    }).then(res => {
      if (res.success) {
        $('#exampleModal').modal('hide');
        // location.reload();
      } else {
        toast(res.data);
      }
    });
  });
}

function handleBeforeAddSite() {
  $('.j-addsite-trigger').on('click', () => {
    const $activeProfile = $('.list-profile .active');
    const name = $activeProfile.text();
    const cid = $activeProfile.data('id');
    console.log(name, cid);
    $('#addSiteCategory').val(name + ' (可在右上角「 设置」中切换)');
    $('#addSiteCategoryId').val(cid);
  });
}

function handleAddSite() {
  $('.j-addsite-submit').on('click', () => {
    const name = $('#addSiteName')
      .val()
      .trim();
    const url = $('#addSiteUrl')
      .val()
      .trim();
    const icon = $('#addSiteIcon')
      .val()
      .trim();
    const order = $('#addSiteOrder')
      .val()
      .trim();
    const categoryId = $('#addSiteCategoryId')
      .val()
      .trim();

    if (!name || !url) {
      toast('请填写名称及URL');
      return;
    }

    $.ajax({
      url: '/site/create',
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      traditional: true,
      data: JSON.stringify({
        name,
        url,
        icon,
        categoryId,
        order
      })
    }).then(res => {
      if (res.success) {
        $('#exampleModal').modal('hide');
        // location.reload();
      } else {
        toast(res.data);
      }
    });
  });
}

/**
 * Toast 提示弹窗
 * @param {*} msg
 */
function toast(msg) {
  $('.toast-global')
    .find('.toast-body')
    .empty()
    .html(msg);
  $('.toast-global')
    .toast({ delay: 3000 })
    .toast('show');
}

function initBaiduSug() {
  function goSearch(text) {
    window.open(SearchEngineUrlMap[window.APP.currentEngine] + text);
  }

  function onTriggerSearrch() {
    const $input = $('.search-input-el');
    const $submit = $('#searchSubmitEl');
    $submit.on('click', () => {
      const text = $input.val();
      goSearch(text);
    });
  }

  new BaiduSug('searchInputEl', {
    className: 'hinote-search',
    border: '1px solid #ddd',
    xOffset: -1,
    maxCount: 9,
    callback: function(text) {
      $('#searchInputEl').val(text);
      $('#searchSubmitEl').trigger('click');
    }
  });
  onTriggerSearrch();
}

/*** EngineAnimation */
function stopEngineAnimation() {
  const $enginesParent = $('.search-engine');
  $enginesParent.removeClass('animate');
}

function startEngineAnimation() {
  const $enginesParent = $('.search-engine');
  $enginesParent.addClass('animate');
}

// 通过 dom class 获取搜索引擎名称
function getEngineNameByDom(dom) {
  if (!dom.classList) return;

  const classList = Array.from(dom.classList);
  return classList[1];
}

function storeLastEngine(engine) {
  window.APP.currentEngine = engine;
  localStorage.setItem('engine', engine);
}

function getLastEngine() {
  return localStorage.getItem('engine');
}

// 切换搜索引擎
function onChangeSearchEngine(defaultEngine) {
  const $enginesParent = $('.search-engine');

  $('.' + 'engine-logo').on('click', function() {
    const $engines = $('.' + 'engine-logo'); // 重新读取一次
    const $input = $('.search-input-el');
    const $this = $(this);
    const current = getEngineNameByDom($engines[0]);
    const target = getEngineNameByDom($this[0]);

    stopEngineAnimation();

    if (current !== target) {
      // 把target engine放到第一位
      $enginesParent.find('.' + target).insertBefore($($engines[0]));
      $input.attr('placeholder', `${SearchEngineNameMap[target]}搜索`).focus();

      storeLastEngine(target);
    }

    setTimeout(() => {
      startEngineAnimation();
    }, 500);
  });

  if (defaultEngine) {
    $(`.${defaultEngine}`).trigger('click');
  }
}
/*** EngineAnimation END */

function initFullpage() {
  $('#fullpage').fullpage({
    //options here
    verticalCentered: false,
    autoScrolling: true,
    scrollHorizontally: true
  });
}

function initLogout() {
  $('.j-logout').on('click', () => {
    location.href = '/logout';
  });
}
