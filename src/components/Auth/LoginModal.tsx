import { Modal, ModalBody } from 'baseui/modal';
import Site from '@/containers/Desktop/SiteList/helper/Site';
import React, { useContext, useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, SIZE } from 'baseui/button';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import UserContext from '@/contexts/userContext';
import { toaster } from 'baseui/toast';
import constants from '@/constants';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: (site: Site) => void;
}

const config = constants.FIREBASE_CONFIG;
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => {
      toaster.info('登录成功！');
      return false;
    },
  },
};

export default function SiteCreateModal(props: Props) {
  const { isOpen, onClose } = props;
  const { user, setUser } = useContext(UserContext);

  const close = typeof onClose === 'function' ? onClose : () => 0;

  const logout = async () => {
    await firebase.auth().signOut();
    setUser(null);
    close();
    toaster.info('已注销登录');
  };

  const alreadyLoginContent = () => {
    return (
      <div className="already-login-container">
        <div>{user?.email}</div>

        <Button className="action" size={SIZE.compact} onClick={logout}>
          Log out
        </Button>
      </div>
    );
  };

  useEffect(
    () => {
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
        // Will be called on page init
        // console.log(user);
        setUser(user);

        if (user) {
          close();
        }
      });
      return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setUser]
  );

  return (
    <Modal
      overrides={{
        Dialog: {
          style: {
            width: '500px',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
      onClose={close}
      isOpen={isOpen}
    >
      <ModalBody className="login-box">
        <div className="title">{user ? 'Sign Out' : 'Sign In'}</div>
        {user ? alreadyLoginContent() : <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />}
      </ModalBody>
    </Modal>
  );
}
