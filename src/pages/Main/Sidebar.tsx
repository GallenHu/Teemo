import React, { useState } from 'react';
import { Category } from '../../models/Configure';

const Sidebar = (props: { categories: Category[] }) => {
  const [isSidebarShrink, setIsSidebarShrink] = useState(true); // 收缩状态

  function storeNavShrink(isShrink: boolean) {
    localStorage.setItem('sidebar-shrink', isShrink ? '1' : '0');
  }

  function getSidebarShrink() {
    return localStorage.getItem('sidebar-shrink');
  }

  function open() {
    setIsSidebarShrink(false);
    storeNavShrink(false);
    document.querySelector('.main-inner')?.classList.remove('is-nav-shrink');
  }

  function close() {
    setIsSidebarShrink(true);
    storeNavShrink(true);
    document.querySelector('.main-inner')?.classList.add('is-nav-shrink');
  }

  function handleToggle() {
    if (isSidebarShrink) {
      open();
    } else {
      close();
    }
  }

  React.useEffect(() => {
    const isClose = getSidebarShrink() === '1'; // 为0或者不存在时为open状态

    if (isClose) {
      close();
    } else {
      open();
    }
  }, [isSidebarShrink]);

  return (
    <div className="nav">
      <div className="logo">
        <h1>海风导航</h1>
      </div>
      {props.categories?.length ? (
        <ul>
          {props.categories.map((cat: any) => (
            <li key={cat.uid}>
              <a href={`#category_${cat.uid}`}>
                <span>{cat.alias}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>
            <a href="#home">
              <span>Home</span>
            </a>
          </li>
        </ul>
      )}

      <div className="user-list hide">
        <span>user:</span>
      </div>
      <button className="nav-toggle" onClick={handleToggle}>
        <span>
          <img
            alt="toggle"
            width="14px"
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2NzQ3ODY4NjcyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4NjgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjU4LjEwNDk5ODc3IDQ3NS40MTA2OTQyMkw3MTQuOTkwOTkyMzEgMTguMzk4NDAxNDNhNDguMjQ2MTUwODMgNDguMjQ2MTUwODMgMCAxIDEgNjguMzI3NjYzMTkgNjguMzI3NjY0MjRMMzYwLjU5NjQ5MzU1IDUwOS41MTEzNzY3MWw0MjMuNzMyNTUyODQgNDIyLjcyMjE2MTk0YTQ4LjMwOTI5OTkzIDQ4LjMwOTI5OTkzIDAgMSAxLTY4LjMyNzY2NDI0IDY4LjQ1Mzk2MTM4TDI1OC4xNjgxNDc4OCA1NDMuNjEyMDU5MTlhNDguMjQ2MTUwODMgNDguMjQ2MTUwODMgMCAwIDEgMC02OC4zMjc2NjQyMnoiIHAtaWQ9IjI4NjkiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4="
          />
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
