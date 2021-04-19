import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QTNotify from '@joyui/qt-notify';
import * as ConfigureApi from '../../api/Configure';
import { storeRemoteConfigure, getStoredRemoteConfigure } from '../../helpers/Configure';
import './Configure.scss';

interface Props {
  modalIsOpen: boolean;
  onCloseModal?: () => void;
  onRemoteConfigureFetched?: (conf: any) => void;
}

const Configure = (props: Props) => {
  const [gistId, setGistId] = useState('');
  const [ghToken, setGhToken] = useState('');
  const [username, setUsername] = useState('');

  const StorageManager = {
    name: 'teemo-configure',
    getConfig: function (): [string, string, string] {
      const gistId = localStorage.getItem(this.name + '-gistid') || '';
      const ghToken = localStorage.getItem(this.name + '-ghtoken') || '';
      const username = localStorage.getItem(this.name + '-username') || '';
      return [gistId, ghToken, username];
    },
    storeGistId: function (value: string) {
      localStorage.setItem(this.name + '-gistid', value);
    },
    storeGhToken: function (value: string) {
      localStorage.setItem(this.name + '-ghtoken', value);
    },
    storeUsername: function (value: string) {
      localStorage.setItem(this.name + '-username', value);
    },
  };

  const queryConfigure = () => {
    const conf = StorageManager.getConfig();
    if (conf[0]) {
      ConfigureApi.getConfig(conf[0], conf[1]).then((data) => {
        storeRemoteConfigure(data);
      });
    }
  };

  const save = () => {
    if (gistId) StorageManager.storeGistId(gistId);
    if (ghToken) StorageManager.storeGhToken(ghToken);
    if (username) StorageManager.storeUsername(username);

    QTNotify.success({
      duration: 3000,
      title: '提示',
      content: '已保存',
    });
    props.onCloseModal && props.onCloseModal();
    queryConfigure();
  };

  useEffect(() => {
    const conf = StorageManager.getConfig();

    if (conf[0]) setGistId(conf[0]);
    if (conf[1]) setGhToken(conf[1]);
    if (conf[2]) setUsername(conf[2]);

    const rConf = getStoredRemoteConfigure();
    if (!rConf) queryConfigure();

    Modal.setAppElement('#app');
    Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,.2)';
  }, []);

  return (
    <Modal
      className="modal-configure"
      isOpen={props.modalIsOpen}
      onRequestClose={props.onCloseModal}
      shouldCloseOnOverlayClick={true}
      contentLabel="Example Modal"
    >
      <h2>自定义配置</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <label className="modal-form-item">
          Gist Id
          <input
            type="text"
            spellCheck={false}
            autoComplete="off"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
          />
        </label>
        <label className="modal-form-item">
          Github Token
          <input
            type="password"
            placeholder="选填 Optional"
            spellCheck={false}
            autoComplete="off"
            value={ghToken}
            onChange={(e) => setGhToken(e.target.value)}
          />
        </label>
        <label className="modal-form-item">
          Username
          <input
            type="text"
            placeholder=""
            spellCheck={false}
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <div className="modal-btn-group">
          <button className="modal-btn save" onClick={save}>
            更新
          </button>
          <button className="modal-btn cancel" onClick={props.onCloseModal}>
            取消
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Configure;
