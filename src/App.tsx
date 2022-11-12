import { useEffect, useState } from 'react';
import Overview from './pages/Overview';
import Navigation from './pages/Navigation';
import './App.css';
import LocalStorageUtils from './utils/LocalStorageUtils';
import { CategoryType } from './types/remote-configure';

function App(props: { callback: () => void }) {
  const [config, setConfig] = useState<CategoryType[]>([]);

  const onRefresh = (newConfig: CategoryType[]) => {
    setConfig(newConfig);
  };

  const hours = new Date().getHours(); // 0 ~ 23
  const bgClassName = hours > 6 && hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'night';

  useEffect(() => {
    const scope = LocalStorageUtils.get('teemo_scope');
    const config = LocalStorageUtils.getStoredRemoteConfigure();

    if (scope && config) {
      setConfig(config.user[scope]);
    }
  }, []);

  return (
    <div className="app" ref={props.callback}>
      <div className={['bg', bgClassName].join(' ')}></div>
      <div className="main">
        <Overview config={config} onRefresh={onRefresh} />
        <Navigation config={config} />
      </div>
    </div>
  );
}

export default App;
