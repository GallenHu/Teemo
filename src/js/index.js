import "../less/style.less";

const ClassNameOfEngines = "engine-logo";
const SearchEngineNameMap = {
  baidu: "百度",
  google: "Google",
  bing: "必应"
};

$(document).ready(function() {
  startEngineAnimation();
  onChangeSearchEngine();
});

// 通过 dom class 获取搜索引擎名称
function getEngineNameByDom(dom) {
  if (!dom.classList) return;

  const classList = Array.from(dom.classList);
  return classList[1];
}

function stopEngineAnimation() {
  const $enginesParent = $(".search-engine");
  $enginesParent.removeClass("animate");
}

function startEngineAnimation() {
  const $enginesParent = $(".search-engine");
  $enginesParent.addClass("animate");
}

function storeLastEngine(engine) {
  localStorage.setItem("engine", engine);
}

function getLastEngine() {
  return localStorage.getItem("engine");
}

// 切换搜索引擎
function onChangeSearchEngine(defaultEngine) {
  const $enginesParent = $(".search-engine");

  $(".engine-logo").on("click", function() {
    const $engines = $(".engine-logo"); // 重新读取一次
    const $input = $(".search-input-el");
    const $this = $(this);
    const current = getEngineNameByDom($engines[0]);
    const target = getEngineNameByDom($this[0]);
    console.log(current, target);

    stopEngineAnimation();

    if (current === target) return;
    // 把target engine放到第一位
    $enginesParent.find("." + target).insertBefore($($engines[0]));
    $input.attr("placeholder", `${SearchEngineNameMap[target]}搜索`);

    setTimeout(() => {
      startEngineAnimation();
    }, 500);
  });

  if (defaultEngine) {
    $(`.${defaultEngine}`).trigger("click");
  }
}
