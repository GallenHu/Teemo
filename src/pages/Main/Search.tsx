import React, { useState } from 'react';
import logobaidu from '../../assets/images/logo-baidu.png';
import logogoogle from '../../assets/images/logo-google.png';
import logodoge from '../../assets/images/logo-doge.png';
import './Search.scss';

enum ENGININES {
  BAIDU = 'baidu',
  GOOGLE = 'google',
  DOGEDOGE = 'doge',
}

interface SimpleObject {
  [key: string]: string;
}

const EnginineOrder = [ENGININES.BAIDU, ENGININES.GOOGLE, ENGININES.DOGEDOGE];

const Search = () => {
  const [enginine, setEnginine] = useState(EnginineOrder[0]);

  const StorageManager = {
    name: 'teemo-engine',
    getLastEngine: function () {
      return localStorage.getItem(this.name);
    },
    storeEngine: function (enginineName: string) {
      localStorage.setItem(this.name, enginineName);
    },
  };

  const goSearch = (enginineName: string, text: string) => {
    const SearchEngineUrlMap: { [key: string]: string } = {
      [ENGININES.BAIDU]: 'https://www.baidu.com/s?wd=',
      [ENGININES.GOOGLE]: 'https://www.google.com/search?q=',
      [ENGININES.DOGEDOGE]: 'https://www.dogedoge.com/results?q=',
    };

    window.open(SearchEngineUrlMap[enginineName] + text);
  };

  const firstUpperCase = (str: string) => {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  };

  const getLogo = (enginineName: string) => {
    const imgs = {
      [ENGININES.BAIDU]: logobaidu,
      [ENGININES.GOOGLE]: logogoogle,
      [ENGININES.DOGEDOGE]: logodoge,
    } as SimpleObject;
    return (
      <img
        className="search-logo-img"
        src={imgs[enginineName]}
        alt={enginineName}
      />
    );
  };

  const getLogoClassName = () => {
    return `search-logo ${enginine}`;
  };

  const switchEngine = () => {
    const len = EnginineOrder.length;
    const currentIndex = EnginineOrder.findIndex(e => e === enginine);
    const nextIndex = currentIndex < len - 1 ? currentIndex + 1 : 0;

    setEnginine(EnginineOrder[nextIndex]);
    StorageManager.storeEngine(EnginineOrder[nextIndex]);
  }

  const submit = () => {
    goSearch(enginine, (document.querySelector('#searchInputEl') as any).value);
  };

  React.useEffect(() => {
    const lastEngine = StorageManager.getLastEngine() || '';
    if (lastEngine) {
      setEnginine(lastEngine as any);
    }
  }, []);

  return (
    <section className="search" id="search">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <span className={getLogoClassName()} onClick={switchEngine}>{getLogo(enginine)}</span>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input-el"
            id="searchInputEl"
            placeholder={`${firstUpperCase(enginine)} 搜索`}
            spellCheck="false"
            autoComplete="off"
          />
          <button id="searchSubmitter" style={{display: 'none'}} onClick={submit}>submit</button>
        </div>
      </form>
    </section>
  );
};

export default Search;
