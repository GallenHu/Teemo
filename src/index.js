require('./style.css');

const DEFAULT_NAV_JSON = [
  {
    "name": "V2EX",
    "url": "https://www.v2ex.com/",
    "icon": "https://ws3.sinaimg.cn/large/005BYqpggy1fxn16s498cj308c08ca9w.jpg"
  },
  {
    "name": "斗鱼",
    "url": "https://www.douyu.com/",
    "icon": "https://ws3.sinaimg.cn/large/005BYqpggy1fxn19id4kzj308c08c0ud.jpg"
  },
  {
    "name": "豆瓣电影",
    "url": "https://movie.douban.com/",
    "icon": "https://ws3.sinaimg.cn/large/005BYqpggy1fxn1ah8s5tj306u06udfp.jpg"
  },
  {
    "name": "GitHub",
    "url": "https://github.com/",
    "icon": "https://ws3.sinaimg.cn/large/005BYqpggy1fxn1hkesffj301s01sdfl.jpg"
  },
  {
    "name": "PS4 会免",
    "url": "https://hinpc.com/",
    "icon": "https://hinpc.com/statics/logo.png"
  }
];

function navOutput() {
  const stroredNav = localStorage.getItem('navjson') || JSON.stringify(DEFAULT_NAV_JSON);
  $('.customize-input').val(stroredNav);
  alert('请手动复制内容并保存管理');
  $('.customize-input').select();
}
function navImport() {
  const r = confirm('确定要导入吗(导入后将保存到本地浏览器存储)？');
  if (r) {
    const val = $('.customize-input').val().trim();
    localStorage.setItem('navjson', val);
    renderNavByJson(val);
  }
}
function resetNav() {
  localStorage.removeItem('navjson');
  renderNavByJson(JSON.stringify(DEFAULT_NAV_JSON));
}

// 渲染导航菜单
function renderNavByJson(jsonStr) {
  let htmlStr = '';
  let json = null;

  try {
    json = JSON.parse(jsonStr);
  } catch (e) {
    console.log(jsonStr);
    alert('JSON 有误!');
    return false;
  }

  json.forEach(obj => {
    htmlStr += `
    <li>
      <a href="${obj.url}" target="_blank">
        <span><img src="${obj.icon}" alt="${obj.name}"></span>
        <span>${obj.name}</span>
      </a>
    </li>
    `
  });
  $('.nav-list').html(htmlStr);
}

// 自定义
$('.customize').on('click', function () {
  const cnt = `
    <div>
      <textarea class="customize-input" autofocus placeholder="点击导出即可查看配置示例" />
      <ul>
        <li><a href="http://www.bejson.com/" target="_blank">JSON格式化</li>
        <li><a href="https://share1223.com/free.html" target="_blank">免费图床</li>
        <li><a href="https://gist.github.com/" target="_blank">GitHubGist</li>
      </ul>
    </div>
  `;
  var d = dialog({
    skin: 'customize-dialog',
    title: '填入JSON',
    content: cnt,
    button: [
      {
        value: '导入',
        callback: function () { navImport(); }
      },
      {
        value: '导出',
        callback: function () { navOutput(); return false; }
      },
      {
        value: '还原默认',
        callback: function () { resetNav(); }
      }
    ]
  });

  d.addEventListener('show', function () {
    // navOutput();
  });

  d.showModal();
});

// 搜索引擎
function googleSearch(text) {
  window.open(`https://www.google.com/search?q=${text}`);
}
function baiduSearch(text) {
  window.open(`https://www.baidu.com/s?wd=${text}`);
}
function duckSearch(text) {
  window.open(`https://duckduckgo.com/?q=${text}`);
}

// 搜索建议
BaiduSuggestion.bind('word', {
  "XOffset": 10, //提示框位置横向偏移量,单位px
  "YOffset": -5, //提示框位置纵向偏移量,单位px
  "width": 610, //提示框宽度，单位px
  "fontColor": "#222", //提示框文字颜色
  "fontColorHI": "#222",	//提示框高亮选择时文字颜色
  "fontSize": "14px",	//文字大小
  // "fontFamily": "宋体",	//文字字体
  "borderColor": "#ccc", //提示框的边框颜色
  "bgcolorHI": "#eee",	//提示框高亮选择的颜色
  "sugSubmit": false	//选中提示框中词条时是否提交表单
}, function(txt) {  // 选择后的回调
  // console.log(txt);
  $('.search-buttons input.active').trigger('click');
});

// 搜索按钮
$('.search-buttons input').on('click', function () {
  $('.search-buttons input').removeClass('active');

  const searcher = $(this).addClass('active').val();
  const searchText = $('#word').val().trim();

  localStorage.setItem('searcher', searcher);
  $('#word').select();
  if (searcher.indexOf('百度') > -1) baiduSearch(searchText);
  if (searcher.indexOf('Google') > -1) googleSearch(searchText);
  if (searcher.indexOf('Duck') > -1) duckSearch(searchText);
});

// init
(function () {
  const searcher = localStorage.getItem('searcher') || '百度一下';
  const navjsonStr = localStorage.getItem('navjson');

  $('.search-buttons input').removeClass('active');
  $(`.search-buttons input[value="${searcher}"]`).addClass('active');
  if (navjsonStr) {
    renderNavByJson(navjsonStr);
  }
})();
