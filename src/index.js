require('./style.css');

$('.customize').on('click', function () {
  var cnt = `
    <div>
      <textarea class="customize-input" autofocus />
      <div><button>导出</button><button>导入</button></div>
    </div>
  `

  var d = dialog({
    title: '填入JSON',
    content: cnt
  });
  d.showModal();
});

BaiduSuggestion.bind('word', {
  "XOffset": 0, //提示框位置横向偏移量,单位px
  "YOffset": 0, //提示框位置纵向偏移量,单位px
  "width": 350, //提示框宽度，单位px
  "fontColor": "#00838f", //提示框文字颜色
  "fontColorHI": "#fff",	//提示框高亮选择时文字颜色
  "fontSize": "16px",	//文字大小
  "fontFamily": "宋体",	//文字字体
  "borderColor": "#ccc", //提示框的边框颜色
  "bgcolorHI": "#00838f",	//提示框高亮选择的颜色
  "sugSubmit": false	//选中提示框中词条时是否提交表单
}, function(txt) {  // 选择后的回调
  console.log(txt);
});
