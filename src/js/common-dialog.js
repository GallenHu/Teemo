export default {
  confirm(text, callback) {
    if (window.APP.isDialogOpen) return;

    const d = dialog({
      title: '  ',
      width: 300,
      skin: 'dialog-confirm dialog-common',
      content: `<div>${text}</div>`,
      cancelValue: '取消',
      cancel: function () {},
      okValue: '确定',
      onclose: function () {
        window.APP.isDialogOpen = false;
      },
      ok: function () {
        callback && callback();
      },
    });

    d.show();
  },
};
