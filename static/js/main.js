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
  initSwitchProfile();
  initDropdown();
  initMoreProfile();
  initEditProfile();
  handleDelSubmit();
  initEditSite();
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
    const remark = $('#addCategoryRemark')
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
        order,
        remark
      })
    }).then(res => {
      if (res.success) {
        $('#exampleModal').modal('hide');
        location.reload();
      } else {
        toast(res.data);
      }
    });
  });
}

function handleBeforeAddSite() {
  $('.j-addsite-trigger').on('click', () => {
    const $activeProfile = $('.list-profile .active');
    const name = $activeProfile.text().trim();
    const cid = $activeProfile.data('id');

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
        $('#addSiteModal').modal('hide');
        location.reload();
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

function initDropdown() {
  $(document).on('click', '.header .dropdown-menu', function(e) {
    if (e.target.nodeName === 'BUTTON') {
    } else {
      e.stopPropagation();
    }
  });
}

function initSwitchProfile() {
  $('.list-profile li').on('click', function() {
    if ($(this).hasClass('active')) return;

    const categoryId = $(this).data('id');
    $.ajax({
      url: '/user/currentcategory/update',
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      traditional: true,
      data: JSON.stringify({
        categoryId
      })
    }).then(res => {
      if (res.success) {
        location.reload();
      } else {
        toast(res.data);
      }
    });
  });
}

function initMoreProfile() {
  const showMore = localStorage.getItem('show_more');
  if (showMore) $('.list-profile').addClass('show-more');

  $('body').on('click', '.nickname', () => {
    const $list = $('.list-profile');
    $list.toggleClass('show-more');
    if ($list.hasClass('show-more')) {
      localStorage.setItem('show_more', 1);
    } else {
      localStorage.removeItem('show_more');
    }
  });
}

function initEditProfile() {
  let currentCategoryId;
  $('.j-edit-category').on('click', function(e) {
    e.stopPropagation();

    $('#editCategoryModal').modal('toggle');

    const $parent = $(this).parent();
    const id = $parent.data('id');
    const name = $parent.find('span:first-child').text();
    const order = $parent.data('order');
    const remark = $parent.data('remark') || '';

    $('#editCategoryId').val(id);
    $('#editCategoryName').val(name);
    $('#editCategoryOrder').val(order);
    $('#editCategoryRemark').val(remark);

    currentCategoryId = id;
  });

  $('.j-editcategory-submit').on('click', () => {
    const id = $('#editCategoryId').val();
    const name = $('#editCategoryName')
      .val()
      .trim();
    const order = $('#editCategoryOrder')
      .val()
      .trim();
    const remark = $('#editCategoryRemark')
      .val()
      .trim();

    if (!name) {
      toast('请填写名称');
      return;
    }

    $.ajax({
      url: '/category/update',
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      traditional: true,
      data: JSON.stringify({
        id,
        name,
        order,
        remark
      })
    }).then(res => {
      if (res.success) {
        $('#editCategoryModal').modal('hide');
        location.reload();
      } else {
        toast(res.data);
      }
    });
  });

  $('.j-delcategory-trigger').on('click', () => {
    $('#editCategoryModal').modal('hide');
    $('#confirmModal')
      .modal('toggle')
      .find('.modal-body')
      .attr('data-id', currentCategoryId)
      .attr('data-type', 'del-category');
  });
}

// 通用删除提交
function handleDelSubmit() {
  $('.j-delconfirm-submit').on('click', () => {
    const $body = $('#confirmModal .modal-body');
    const type = $body.data('type');
    const id = $body.data('id');

    if (type === 'del-category') {
      $.ajax({
        url: '/category/delete',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        traditional: true,
        data: JSON.stringify({
          id
        })
      }).then(res => {
        if (res.success) {
          location.reload();
        } else {
          toast(res.data);
        }
      });
    }
    if (type === 'del-site') {
      $.ajax({
        url: '/site/delete',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        traditional: true,
        data: JSON.stringify({
          id
        })
      }).then(res => {
        if (res.success) {
          location.reload();
        } else {
          toast(res.data);
        }
      });
    }
  });
}

function initEditSite() {
  let currentSiteId;
  $('.j-edit-site').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    $('#editSiteModal').modal('toggle');

    const $parent = $(this).parent();
    const name = $parent.text().trim();
    const id = $parent.data('id');
    const order = $parent.data('order');
    const url = $parent.attr('href');
    const iconUrl = $parent.find('.site-icon').attr('src');
    const remark = $parent.data('remark');

    $('#editSiteId').val(id);
    $('#editSiteName').val(name);
    $('#editSiteOrder').val(order);
    $('#editSiteUrl').val(url);
    $('#editSiteIcon').val(iconUrl);
    $('#editSiteRemark').val(remark);

    currentSiteId = id;
  });

  $('.j-editsite-submit').on('click', function() {
    const id = $('#editSiteId').val();
    const name = $('#editSiteName')
      .val()
      .trim();
    const order = $('#editSiteOrder')
      .val()
      .trim();
    const url = $('#editSiteUrl')
      .val()
      .trim();
    const iconUrl = $('#editSiteIcon')
      .val()
      .trim();
    const remark = $('#editSiteRemark')
      .val()
      .trim();

    if (!name || !url) {
      toast('请填写名称及URL');
      return;
    }

    $.ajax({
      url: '/site/update',
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      traditional: true,
      data: JSON.stringify({
        id,
        name,
        url,
        iconUrl,
        order,
        remark
      })
    }).then(res => {
      if (res.success) {
        $('#editSiteModal').modal('hide');
        location.reload();
      } else {
        toast(res.data);
      }
    });
  });

  $('.j-delsite-trigger').on('click', () => {
    $('#editSiteModal').modal('hide');
    $('#confirmModal')
      .modal('toggle')
      .find('.modal-body')
      .attr('data-id', currentSiteId)
      .attr('data-type', 'del-site');
  });
}
