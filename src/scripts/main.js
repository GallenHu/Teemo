$(document).ready(() => {
  $('.engine-choose').click(function () {
    onClickEngine($(this).attr('class').replace('engine-choose ', '').toLowerCase());
  });

  const lastEngine = getLastEngine() || '';
  if (lastEngine) {
    $(`.engine-choose.${lastEngine}`).trigger('click');
  }
});

function onClickEngine(engine) {
  $('.searcher-logo').attr('class', 'searcher-logo').addClass(engine);
  $('#searchInputEl').attr('placeholder', `${firstUpperCase(engine)} 搜索`);
  storeLastEngine(engine);
}

function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

function storeLastEngine(engine) {
  localStorage.setItem('engine', engine);
}

function getLastEngine() {
  return localStorage.getItem('engine');
}
