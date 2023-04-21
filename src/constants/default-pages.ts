import images from './background-images';

const DEFAULT_PAGES = [
  {
    id: 'page-home',
    name: '主页',
    icon: 'icon-shouye',
    bg: images[0],
    children: [
      {
        type: 'widget',
        name: 'HOLIDAY',
        id: 'widget-holiday',
      },
      {
        type: 'widget',
        name: 'TIME',
        id: 'widget-date',
      },
      {
        id: 'site-sina',
        name: '新浪微博',
        url: 'https://weibo.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgba(0, 0, 0, 0)',
        bgImage: 'https://h5.sinaimg.cn/m/weibo-lite/appicon.png',
        updateAt: 1678976960384,
      },
      {
        id: 'site-baidu',
        name: '百度搜索',
        url: 'https://www.baidu.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgba(0, 0, 0, 0)',
        iconText: '',
        bgImage: 'https://psstatic.cdn.bcebos.com/video/wiseindex/aa6eef91f8b5b1a33b454c401_1660835115000.png',
        updateAt: 1678976960384,
      },

      {
        id: 'site-vqq',
        name: '腾讯视频',
        url: 'https://v.qq.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgba(0, 0, 0, 0)',
        bgImage: 'https://img.picgo.net/2023/03/28/vqqcd372d1b95abca36.webp',
        updateAt: 1678976960384,
      },
      {
        id: 'site-zhihu',
        name: '知乎',
        url: 'https://www.zhihu.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgba(0, 0, 0, 0)',
        bgImage: 'https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png',
        updateAt: 1678976960384,
      },
      {
        id: 'site-chatgpt',
        name: 'ChatGPT',
        url: 'https://chat.openai.com/chat',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgb(112, 165, 151)',
        bgImage: 'https://1000logos.net/wp-content/uploads/2023/02/ChatGPT_Logo_PNG1.png',
        updateAt: 1678976960384,
      },
      {
        id: 'site-bilibili',
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgb(112, 165, 151)',
        bgImage: 'https://img.picgo.net/2023/03/29/bilibili3c2ca39ae9772b81.webp',
        updateAt: 1678976960384,
      },
      {
        id: 'site-unsplash',
        name: 'Unsplash',
        url: 'https://unsplash.com/',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgb(244, 171, 18)',
        bgImage: 'https://unsplash.com/apple-touch-icon.png',
        updateAt: 1678976960384,
      },
      {
        id: 'site-github',
        name: 'Github',
        url: 'https://github.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgba(0, 0, 0, 0)',
        bgImage: 'https://img.picgo.net/2023/03/29/github891f1a180b71516d.webp',
        updateAt: 1678976960384,
      },
    ],
  },
  {
    id: 'page-tools',
    name: '工具',
    icon: 'icon-tishi',
    children: [
      {
        id: 'site-outlook',
        name: 'Outlook',
        url: 'https://outlook.live.com',
        type: 'site', // site, widget
        bgType: 'image',
        bgColor: 'rgba(0, 0, 0, 0)',
        bgImage: 'https://res.cdn.office.net/assets/mail/pwa/v1/pngs/apple-touch-icon.png',
        updateAt: 1678976960384,
      },
    ],
  },
];

export default DEFAULT_PAGES;
