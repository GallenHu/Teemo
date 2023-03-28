export default function init(className: string) {
  return new (window as any).BaiduSug('searchInputEl', {
    className,
    width: 600,
    border: '1px solid #ddd',
    xOffset: -1,
    yOffset: 1,
    maxCount: 9,
    callback: function (text: string, isPressEnterKey: boolean) {
      (document.querySelector('#searchInputEl') as any).value = text;
      (document.querySelector('#searchSubmitter') as any).click();
    },
  });
}
