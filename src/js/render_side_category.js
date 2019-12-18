// 渲染侧边栏
export default function renderSideCategory(json) {
  // const tpl = `
  // <li><a href="#navCommon">常用网址</a></li>
  // `;

  let tpl = '';
  json.forEach(obj => {
    tpl += `<li><a href="#${obj.category}">${obj.title}</a></li>`;
  });

  const advanceConfigLi = $('.side .category li:last-child').prop('outerHTML');
  tpl += advanceConfigLi;

  $('.side .category').html(tpl);
}
