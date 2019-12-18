export default function() {
  const $this = $(this);
  if (window.APP.isDialogOpen) return;
  const tpl = `
    <div>
      <div>
        <label style="vertical-align: top;">配置文件：</label>
        <textarea style="width: 400px;height: 200px;"></textarea>
      </div>
    </div>
  `;

  const d = dialog({
    title: '  ',
    width: 500,
    skin: 'dialog-advance-config dialog-common',
    content: tpl,
    statusbar: '<div class="dialog-error hide">Error</div>',
    okValue: '确定',
    onshow: function () {

    },
    onclose: function() {
      window.APP.isDialogOpen = false;
    },
    ok: function() {}
  });

  d.show();
  window.APP.isDialogOpen = true;
}
