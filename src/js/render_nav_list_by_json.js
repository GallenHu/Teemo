export default function (json, container) {
  // const tpl = `
  // <div id="navCommon" class="nav-block">
  //   <h2>常用网址</h2>
  //   <ul class="fn-clear">
  //     <li>
  //       <a href="https://weibo.com" class="site-link" target="_blank" rel="nofollow">
  //         <span class="img-container">
  //           <img src="<%= require('./src/asserts/images/weibo.png').default%>" alt="微博" class="site-icon">
  //         </span>
  //         <span class="site-name">微博</span>
  //       </a>
  //     </li>
  //   </ul>
  // </div>
  // `;

  let tpl = '';
  json.forEach(obj => {
    tpl += `<div id="${obj.category}" class="nav-block">`
    tpl += `<h2>${obj.title}</h2>`
    tpl += `<ul class="fn-clear">`
    Array.from(obj.sites).forEach(site => {
      tpl += `<li>`
      tpl += `<a href="${site.url}" class="site-link" target="_blank" rel="nofollow">`
      tpl += `<span class="img-container">`
      tpl += `<img src="${site.icon}" alt="${site.name}" class="site-icon">`
      tpl += `</span>`
      tpl += `<span class="site-name">${site.name}</span>`
      tpl += `</a>`
      tpl += `</li>`
    })
    tpl += '</ul>'
    tpl += '</div>'
  });

  container.innerHTML = tpl;
};
