import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Loading from '@/containers/Loading';
import '@/styles/base.scss';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, LightTheme } from 'baseui';
import UserContexts from '@/contexts/userContext';
import { User } from '@/types/user.d';

const engine = new Styletron();

const Desktop = React.lazy(() => import('./containers/Desktop'));
const Mobile = React.lazy(() => import('./containers/Mobile'));

const router = createHashRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Desktop />
      </React.Suspense>
    ),
  },
  {
    path: 'm',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Mobile />
      </React.Suspense>
    ),
  },
]);

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  return <UserContexts.Provider value={{ user, setUser }}>{children}</UserContexts.Provider>;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </BaseProvider>
    </StyletronProvider>
  </>
);

console.log('Teemo: ', process.env.REACT_APP_VERSION);
