import Consts from './consts';

export default function(conofigJson, callback) {
  if (window.APP.isDialogOpen) return;
  const tpl = `
    <div>
      <div>
        <label style="vertical-align: top;">配置文件：</label>
        <textarea class="advance-config-input" style="width: 400px;height: 200px; padding: 10px;">
        ${JSON.stringify(conofigJson, null, 2)}
        </textarea>
      </div>
      <div style="margin-top: 10px">
        <label style="vertical-align: top;">在线工具：</label>
        <span style="margin-right: 10px">
          <a href="http://bejson.com" style="color: #666;" target="_blank" rel="nofollow">在线JSON格式化校验</a>
        </span>
        <span style="margin-right: 10px">
          <a href="https://sm.ms" style="color: #666;" target="_blank" rel="nofollow">免费图床</a>
        </span>
        <span style="margin-right: 10px">
          <a href="https://gist.github.com/" style="color: #666;" target="_blank" rel="nofollow">前往Gist保存本配置</a>
        </span>
      </div>
      <div style="margin-top: 10px">
        <label style="vertical-align: top;">快捷操作：</label>
        <span style="margin-right: 10px">
          <a href="javascript:;" class="j-clear-custom" style="color: #666;" rel="nofollow">还原默认(清空自定义网址)</a>
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
      $('body').on('click', '.j-clear-custom', function() {
        localStorage.removeItem(Consts.STORAGE_NAME);
        location.reload();
      });
    },
    onclose: function() {
      window.APP.isDialogOpen = false;
    },
    ok: function() {
      const content = $('.dialog-advance-config .advance-config-input').val().trim();
      const showError = (msg) => {
        const $error = $('.dialog-common .dialog-error')
        $error.html(msg).removeClass('hide');
        setTimeout(() => {
          $error.html('').addClass('hide');
        }, 3000);
      }
      let json;
      try {
        json = JSON.parse(content);
      } catch (err) {
        showError('输入的JSON格式有误');
        return false;
      }

      callback && callback(json);
    }
  });

  d.show();
  window.APP.isDialogOpen = true;
}
