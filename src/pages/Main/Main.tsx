import React, { useState, useEffect } from 'react';
import Search from './Search';
import Sites from './Sites';
import Configure from './Configure';
import { Config } from '../../models/Configure';
import { getStoredRemoteConfigure, getUsername } from '../../helpers/Configure';
import iconSetting from '../../assets/images/setting.png';
import './Main.css';

const InitConfig: Config = {
  user: {
    my_user_name: [],
  },
};

function App() {
  const [config, setConfig] = useState(InitConfig);
  const [username, setUsername] = useState('my_user_name');
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);

  useEffect(() => {
    const conf = getStoredRemoteConfigure();
    const username = getUsername();
    if (username) setUsername(username);
    if (conf) setConfig(conf);
  }, []);

  return (
    <div className="main">
      <img
        className="setting"
        src={iconSetting}
        alt="设置"
        onClick={() => {
          setIsConfigureOpen(true);
        }}
      />

      <Search></Search>

      <Sites categories={config.user[username] || []}></Sites>

      <Configure
        modalIsOpen={isConfigureOpen}
        onCloseModal={() => {
          setIsConfigureOpen(false);
        }}
      ></Configure>
    </div>
  );
}

export default App;
