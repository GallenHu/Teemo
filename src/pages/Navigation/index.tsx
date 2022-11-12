import { useEffect } from 'react';
import { Tabs } from 'antd';
import styles from './index.module.css';
import { useState } from 'react';
import LinkGroup from '../../components/LinkGroup';
import { CategoryType } from '../../types/remote-configure';

const { TabPane } = Tabs;

interface Props {
  config: CategoryType[];
}

export default function Navigation(props: Props) {
  const defaultActive = props.config?.length ? props.config[0].uid : '1';

  const [active, setActive] = useState(defaultActive);

  const onTabClick = (key: string, e: any) => {
    setActive(key);
  };

  const renderTabBar = (props: any) => {
    return (
      <div className={styles.tabBar}>
        {props.panes.map((item: any) => (
          <div
            className={active === item.key ? styles.activeBar : ''}
            key={item.key}
            onClick={() => props.onTabClick && props.onTabClick(item.key)}
          >
            {item.props.tab}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setActive(defaultActive);
  }, [defaultActive]);

  return (
    <div className={[styles.page, 'slide-section'].join(' ')}>
      <Tabs
        className={styles.tabs}
        activeKey={active}
        renderTabBar={renderTabBar}
        onTabClick={onTabClick}
        animated={{ inkBar: false, tabPane: true }}
      >
        {props.config.map((category) => (
          <TabPane key={category.uid} tab={category.alias}>
            <div className={styles.linksWrap}>
              <LinkGroup sites={category.sites}></LinkGroup>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
