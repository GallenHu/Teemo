import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import './styles/index.scss';

ReactDOM.render(
  <Router />,
  document.getElementById('root'),
  callback
);

// global function
function callback() {
  function initBaiduSug() {
    new (window as any).BaiduSug('searchInputEl', {
      className: 'teemo-search',
      width: 798,
      border: '1px solid #ddd',
      xOffset: -44,
      yOffset: 8,
      maxCount: 9,
      callback: function (text: string) {
        (document.querySelector('#searchInputEl') as any).value = text;
        (document.querySelector('#searchSubmitter') as any).click();
      },
    });
  }

  initBaiduSug();
}
