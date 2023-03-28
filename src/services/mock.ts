const mockConfig = {
  timestamp: 1678976960384,
  id: 't-1678976960384',
  pages: [
    {
      id: 'page-1678976960384',
      name: '工具',
      icon: 'tools',
      children: [
        {
          type: 'widget', // site, widget
          name: 'date',
          id: 'widget-1678976960384',
        },
        {
          id: 'site-1678976960384',
          name: '搜索',
          target: 'https://baidu.com/',
          type: 'site', // site, widget
          bgType: 'image',
          bgColor: 'rgba(0, 0, 0, 0)',
          bgImage: 'https://cdn-icons-png.flaticon.com/512/2504/2504887.png',
          updateAt: 1678976960384,
        },
      ],
    },
  ],
};
export default mockConfig;
