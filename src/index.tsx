import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/Main/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
  callback
);

function callback() {
  function initBaiduSug() {
    new (window as any).BaiduSug('searchInputEl', {
      className: 'hinote-search',
      border: '1px solid #ddd',
      xOffset: -1,
      maxCount: 9,
      callback: function (text: string) {
        (document.querySelector('#searchInputEl') as any).value = text;
        (document.querySelector('#searchSubmitEl') as any).click();
      },
    });
  }

  initBaiduSug();
}
