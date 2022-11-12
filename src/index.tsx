import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import 'responsive-fullpage-scroll/dist/fullpage-scroll.js';
import App from './App';
import Mobile from './pages/Mobile';
// import reportWebVitals from './reportWebVitals';

const router = createHashRouter([
  {
    path: '/',
    element: <App callback={onRendered} />,
  },
  {
    path: 'm',
    element: <Mobile />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

/**
 * Global Init
 */
function onRendered() {
  new (window as any).BaiduSug('searchInputEl', {
    className: 'teemo-search',
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

document.addEventListener('DOMContentLoaded', function () {
  const win = window as any;
  const FullPageScroll = win.FullPageScroll;

  if (window.location.hash.indexOf('#/') === 0) return; // disable for mobile

  setTimeout(() => {
    win.fps = new FullPageScroll(document.querySelector('.main'), {
      transitionTime: 500,
      slideSelector: '.slide-section',
    });

    win.fps.onslide = function () {
      // console.log(win.fps.currentSlide);
    };
  }, 0);
});
