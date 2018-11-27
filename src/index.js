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
