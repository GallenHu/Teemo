import { Input, InputRef } from 'antd';
import LogoBaidu from '../../assets/images/logo-baidu.png';
import LogoGoogle from '../../assets/images/logo-google.png';
import { useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import LocalStorageUtils from '../../utils/LocalStorageUtils';

const SEARCH_ENGINE_URI: { [key: string]: string } = {
  BAIDU: 'https://www.baidu.com/s?wd=',
  GOOGLE: 'https://www.google.com/search?q=',
  DOGEDOGE: 'https://www.dogedoge.com/results?q=',
};

const STORAGE_KEY = 'teemo_search_engine';

export default function Search() {
  const inputRef = useRef<InputRef>(null);
  const [engine, setEngine] = useState('baidu');
  const [engineLogo, setEngineLogo] = useState(LogoBaidu);

  const focusInput = () => {
    inputRef.current!.focus({
      cursor: 'end',
    });
  };

  const handleClickEngineLogo = (engine?: string) => {
    const target = engine ? engine : engineLogo === LogoBaidu ? 'google' : 'baidu';
    const targetLogo = target === 'baidu' ? LogoBaidu : LogoGoogle;

    setEngineLogo(targetLogo);
    setEngine(target);
    LocalStorageUtils.set(STORAGE_KEY, target);
    focusInput();
  };

  const handleSubmit = () => {
    const val = (document.querySelector('#searchInputEl') as any).value;
    window.open(SEARCH_ENGINE_URI[engine.toUpperCase()] + val);
  };

  const Engines = () => (
    <span>
      <img
        className={styles.logo}
        src={engineLogo}
        alt={engine}
        onClick={() => {
          handleClickEngineLogo();
        }}
      />
    </span>
  );

  const placeholderText = engine === 'baidu' ? '百度一下' : 'Google';

  useEffect(() => {
    const engine = LocalStorageUtils.get(STORAGE_KEY);
    handleClickEngineLogo(engine);
  }, []);

  return (
    <>
      <Input
        className={styles.input}
        id="searchInputEl"
        ref={inputRef}
        prefix={<Engines />}
        placeholder={placeholderText}
      />
      <button id="searchSubmitter" style={{ display: 'none' }} onClick={handleSubmit}>
        BaiduSug Trigger
      </button>
    </>
  );
}
