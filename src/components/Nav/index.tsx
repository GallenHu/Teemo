import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import arrow from '../../assets/images/arrow.png';
import './style.scss';

const Nav = () => {
  const history = useHistory();
  const location = useLocation();

  const goPage = (path: string) => {
    history.push({
      pathname: path,
      state: { from: location.pathname },
    });
  };

  const isLastPage = location.pathname === '/time';

  return isLastPage ? (
    <div
      className="nav back"
      onClick={() => {
        goPage('/');
      }}
    >
      <img src={arrow} alt="back" />
    </div>
  ) : (
    <div
      className="nav next"
      onClick={() => {
        goPage('/time');
      }}
    >
      <img src={arrow} alt="next" />
    </div>
  );
};

export default Nav;
