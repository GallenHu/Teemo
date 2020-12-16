import React from 'react';
import { HashRouter as Router, Route, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Nav from './components/Nav/index';
import Main from './pages/Main/Main';
import Time from './pages/Time';

const routes = [
  { path: '/', name: 'Main', Component: Main },
  { path: '/time', name: 'Time', Component: Time },
];

const CompWrap = (props: any) => {
  const history = useHistory();
  const { from } = (history.location.state || {}) as any;

  const className = from === '/' ? 'route-page' : 'route-page go-right';
  return <div className={className}>{props.children}</div>;
};

export default function AppRouter() {
  return (
    <Router>
      <div className="app" id="app">
        <Nav></Nav>

        {routes.map(({ path, Component }, i) => (
          <Route key={path} exact path={path}>
            {({ match }) => (
              <CSSTransition
                in={match != null}
                timeout={300}
                classNames="page"
                unmountOnExit
              >
                {
                  <CompWrap>
                    <Component></Component>
                  </CompWrap>
                }
              </CSSTransition>
            )}
          </Route>
        ))}
      </div>
    </Router>
  );
}
