import React, { useState } from 'react';

const Search = () => {
  const [enginine, setEnginine] = useState('baidu');

  function handleClickEngine(name: string) {
    setEnginine(name);
    storeLastEngine(name);
  }

  function handleSubmit() {
    const val = (document.querySelector('#searchInputEl') as any).value;
    goSearch(enginine, val);
  }

  function goSearch(engine: string, text: string) {
    const SearchEngineUrlMap: { [key: string]: string } = {
      baidu: 'https://www.baidu.com/s?wd=',
      google: 'https://www.google.com/search?q=',
      dogedoge: 'https://www.dogedoge.com/results?q=',
    };

    window.open(SearchEngineUrlMap[engine] + text);
  }

  function storeLastEngine(engine: string) {
    console.log(233);

    localStorage.setItem('engine', engine);
  }
  function getLastEngine() {
    return localStorage.getItem('engine');
  }

  function firstUpperCase(str: string) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  }

  React.useEffect(() => {
    const lastEngine = getLastEngine() || '';
    if (lastEngine) {
      setEnginine(lastEngine);
    }
  }, []);

  return (
    <section className="search" id="search">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <div className={`searcher-logo ${enginine}`}>
          <i className="baidu"></i>
          <i className="google"></i>
          <i className="dogedoge"></i>
        </div>
        <div className="search-input">
          <input
            type="text"
            className="search-input-el"
            id="searchInputEl"
            placeholder={`${firstUpperCase(enginine)} 搜索`}
            spellCheck="false"
            autoComplete="off"
          />
          <button onClick={handleSubmit} id="searchSubmitEl">
            <img
              alt="search"
              width="20px"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2NTA5NjYxMjkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNjQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODg3LjQ0OTYgOTU4LjM2MTZsLTE0MS41NjgtMTQxLjU2OGE0OS44MTc2IDQ5LjgxNzYgMCAwIDEtNS40MjcyLTYuNCA0MjMuMjcwNCA0MjMuMjcwNCAwIDAgMS0yNjMuNzMxMiA5MS44NTI4IDQyNS44ODE2IDQyNS44ODE2IDAgMCAxLTQyNS40NzItNDI1LjQyMDggNDI1LjkzMjggNDI1LjkzMjggMCAwIDEgNDI1LjQ3Mi00MjUuNDIwOCA0MjUuODgxNiA0MjUuODgxNiAwIDAgMSA0MjUuMzY5NiA0MjUuNDIwOCA0MjMuMzcyOCA0MjMuMzcyOCAwIDAgMS05MS44NTI4IDI2My43ODI0IDUwLjI3ODQgNTAuMjc4NCAwIDAgMSA2LjQgNS40MjcybDE0MS41NjggMTQxLjU2OGE1MC4wNzM2IDUwLjA3MzYgMCAwIDEgMCA3MC43NTg0IDQ5LjkyIDQ5LjkyIDAgMCAxLTM1LjM3OTIgMTQuNjQzMiA0OS44Njg4IDQ5Ljg2ODggMCAwIDEtMzUuMzc5Mi0xNC42NDMyek0xNTEuMzk4NCA0NzYuODI1NmEzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMCAzMjUuMzI0OCAzMjUuMzI0OCAzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMCAzMjUuMjczNi0zMjUuMzI0OCAzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMC0zMjUuMjczNi0zMjUuMzI0OCAzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMC0zMjUuNDI3MiAzMjUuMTJ6IiBwLWlkPSIxMjY1IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+"
            />
          </button>
        </div>
        <div className="search-engine">
          <span
            onClick={() => handleClickEngine('baidu')}
            className={`engine-choose baidu ${
              enginine === 'baidu' ? 'current' : null
            }`}
          >
            <span style={{ color: '#2100E0' }}>Baidu</span>
          </span>
          <span
            onClick={() => handleClickEngine('google')}
            className={`engine-choose google ${
              enginine === 'google' ? 'current' : null
            }`}
          >
            <label htmlFor="type-google">
              <span style={{ color: '#3B83FA' }}>G</span>
              <span style={{ color: '#F3442C' }}>o</span>
              <span style={{ color: '#FFC300' }}>o</span>
              <span style={{ color: '#4696F8' }}>g</span>
              <span style={{ color: '#2CAB4E' }}>l</span>
              <span style={{ color: '#F54231' }}>e</span>
            </label>
          </span>
          <span
            onClick={() => handleClickEngine('dogedoge')}
            className={`engine-choose dogedoge ${
              enginine === 'dogedoge' ? 'current' : null
            }`}
          >
            <span style={{ color: '#000' }}>Dogedoge</span>
          </span>
        </div>
      </form>
    </section>
  );
};

export default Search;
