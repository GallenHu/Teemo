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
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('unknown');

  React.useEffect(() => {
    const username = localStorage.getItem('username') || 'unknown';
    const gistId = localStorage.getItem('gistid') || '';
    setUsername(username);

    if (gistId) {
      setLoading(true);
      getConfig(gistId)
        .then((data) => {
          setLoading(false);
          if (data) {
            const config = getConfigFromGistData(data);
            setConfig(config);
            console.log('config', config, username);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
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
            <span>{loading ? 'loading...' : username}</span>
          </section>

          <Search></Search>

          <Sites categories={config.user[username]}></Sites>
        </div>
      </div>

      <Widget></Widget>

      <iframe src="http://gif.pm" title="ip" frameBorder="0" id="ipIframe"></iframe>
    </div>
  );
}

export default App;
