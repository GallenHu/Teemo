import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Search from './Search';
import Sites from './Sites';
import Widget from './Widget';
import { Config } from '../../models/Configure';
import { getConfig } from '../../api/Configure';
import { getConfigFromGistData } from '../../helpers/Configure';
import './App.css';

const InitConfig: Config = {
  user: {
    hinpc_home: [],
  },
};

function App() {
  const [config, setConfig] = useState(InitConfig);
  const [username, setUsername] = useState('unknown');

  React.useEffect(() => {
    const username = localStorage.getItem('username') || 'unknown';
    const gistId = localStorage.getItem('gistid') || '';
    setUsername(username);

    if (gistId) {
      getConfig(gistId).then((data) => {
        if (data) {
          const config = getConfigFromGistData(data);
          setConfig(config);
          console.log('config', config, username);
        }
      });
    }
  }, [username]);

  return (
    <div className="main">
      <div className="main-inner is-nav-shrink">
        <Sidebar categories={config.user[username]}></Sidebar>

        <div className="main-content">
          <section className="main-header">
            <span></span>
            <span>{username}</span>
          </section>

          <Search></Search>

          <Sites categories={config.user[username]}></Sites>
        </div>
      </div>

      <Widget></Widget>
    </div>
  );
}

export default App;
