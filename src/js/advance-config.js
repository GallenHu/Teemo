export default function(conofigJson) {
  if (window.APP.isDialogOpen) return;
  const tpl = `
    <div>
      <div>
        <label style="vertical-align: top;">配置文件：</label>
        <textarea style="width: 400px;height: 200px;outline: none; padding: 10px;">
        ${JSON.stringify(conofigJson, null, 2)}
        </textarea>
      </div>
      <div style="margin-top: 10px">
        <label style="vertical-align: top;">在线工具：</label>
        <span style="margin-right: 10px">
          <a href="https://bejson.com" style="color: #666;" target="_blank" rel="nofollow">在线JSON格式化校验</a>
        </span>
        <span>
          <a href="https://sm.ms" style="color: #666;" target="_blank" rel="nofollow">免费图床</a>
        </span>
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
