import { useEffect, useState } from 'react';
import SideBar from '@/containers/Desktop/SideBar';
import Background from './Background';
import SiteList from './SiteList';
import SearchBox from '@/components/SearchBox';
import { ToasterContainer } from 'baseui/toast';
import storage from '@/utils/storage';
import '@/styles/desktop.scss';

import ScrollUtils from '@/utils/scroll';
import useGlobalValue from '@/hooks/useGlobalState';

export default function Desktop() {
  const [globalValue] = useGlobalValue();
  const { configuration } = globalValue;
  const [currentPage, setCurrentPage] = useState(0);
  const [manageMode, setManageMode] = useState(false);

  const totalPage = configuration.pages.length;

  useEffect(() => {
    document.title = '新标签页';

    const s = new ScrollUtils(document.querySelector('.site-list'), (direction: 'up' | 'down') => {
      if (direction === 'up') {
        if (currentPage === 0) return;
        setCurrentPage(currentPage - 1);
      }
      if (direction === 'down') {
        if (currentPage === totalPage - 1) return;
        setCurrentPage(currentPage + 1);
      }
    });

    return function cleanup() {
      s.destroy();
    };
  });

  useEffect(() => {
    const { data, error } = storage.getParsedLocalConfiguration();

    if (!error) {
      const timestamp = data?.timestamp || 0;

      if (timestamp !== configuration.timestamp) {
        console.info('local storage configuration changed.');
        storage.setLocalConfiguration(configuration);
      }
    } else {
      if (error.toString().toLowerCase().indexOf('not found') > -1) {
        storage.setLocalConfiguration(configuration);
      } else {
        console.error(error);
      }
    }
  }, [configuration.timestamp, configuration]);

  function handleChangePage(index: number) {
    setCurrentPage(index);
  }

  return (
    <div className="desktop-app">
      <Background />
      <SiteList
        pageIndex={currentPage}
        manageMode={manageMode}
        setManageMode={setManageMode}
        onTriggerChangePage={page => setCurrentPage(page)}
      />
      <SideBar
        pageIndex={currentPage}
        manageMode={manageMode}
        onChangePage={handleChangePage}
        onTriggerManageUI={() => setManageMode(true)}
        onTriggerManageFinish={() => setManageMode(false)}
      />
      <SearchBox />

      <ToasterContainer autoHideDuration={2500} placement="topRight" />
    </div>
  );
}
