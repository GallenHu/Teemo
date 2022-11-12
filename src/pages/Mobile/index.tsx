import styles from './index.module.css';

export default function Mobile() {
  const siteList = [
    { title: 'Google', url: 'https://www.google.com' },
    { title: 'Baidu', url: 'https://www.baidu.com' },
    { title: 'V2EX', url: 'https://www.v2ex.com' },
    { title: 'Hostloc', url: 'https://www.hostloc.com' },
    { title: '微博热搜', url: 'https://wbhot.pages.dev' },
    { title: '彩云天气', url: 'https://caiyunapp.com/weather' },
  ];
  return (
    <div className={styles.mobilePage}>
      <div className={styles.wrapper}>
        {siteList.map((site, index) => {
          return (
            <div className={styles.siteItem} key={site.url}>
              <a href={site.url}>
                {site.title}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
