import React, { useState } from 'react';
import axios from 'axios';
import { Form, Drawer, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ReactComponent as ConfigIcon } from '../../assets/svg/config-icon.svg';
import LocalStorageUtils from '../../utils/LocalStorageUtils';
import styles from './Configure.module.css';
import { RemoteConfigure } from '../../types/remote-configure';

interface Props {
  onRefresh?: (config: RemoteConfigure, scope: string) => void;
}

type LayoutType = Parameters<typeof Form>[0]['layout'];

export enum STORAGE_KEY {
  GIST_ID = 'teemo_gist_id',
  GH_TOKEN = 'teemo_github_token',
  SCOPE = 'teemo_scope',
}

function queryRemoteConfig(gistId: string, ghToken?: string) {
  return axios
    .get(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${ghToken}`,
      },
    })
    .then((res) => {
      if (res.status === 200 && res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}

export default function Configure(props: Props) {
  const [visible, setVisible] = useState(false);
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');
  const [gistId, setGistId] = useState('');
  const [ghToken, setGhToken] = useState('');
  const [scope, setScope] = useState('');
  const version = process.env.REACT_APP_VERSION;

  const onClose = () => {
    setVisible(false);
  };

  const onOpen = () => {
    setVisible(true);
  };

  const getStorageConfigure = () => {
    const gistId = LocalStorageUtils.get(STORAGE_KEY.GIST_ID);
    const ghToken = LocalStorageUtils.get(STORAGE_KEY.GH_TOKEN);
    const scope = LocalStorageUtils.get(STORAGE_KEY.SCOPE);
    return {
      gistId,
      ghToken,
      scope,
    };
  };

  const refreshConfig = () => {
    const { gistId, ghToken, scope } = getStorageConfigure();

    queryRemoteConfig(gistId, ghToken)
      .then((data) => {
        LocalStorageUtils.storeRemoteConfigure(data);
        props.onRefresh && props.onRefresh(data, scope);
        message.info('Success');
      })
      .catch((err) => {
        message.error('Failed');
      })
      .finally(() => {
        onClose();
      });
  };

  const save = () => {
    if (gistId) LocalStorageUtils.set(STORAGE_KEY.GIST_ID, gistId);
    if (ghToken) LocalStorageUtils.set(STORAGE_KEY.GH_TOKEN, ghToken);
    if (scope) LocalStorageUtils.set(STORAGE_KEY.SCOPE, scope);

    refreshConfig();
  };

  const [form] = Form.useForm();

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const handleVisibleChange = (visible: boolean) => {
    if (visible) {
      const { gistId, ghToken, scope } = getStorageConfigure();

      if (gistId) setGistId(gistId);
      if (ghToken) setGhToken(ghToken);
      if (scope) setScope(scope);
    }
  };

  return (
    <>
      <div className={styles.iconWrap} onClick={onOpen}>
        <ConfigIcon className={styles.icon}></ConfigIcon>
      </div>

      <Drawer
        title="Setting"
        placement="right"
        onClose={onClose}
        visible={visible}
        afterVisibleChange={handleVisibleChange}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            layout: {
              labelCol: { span: 4 },
              wrapperCol: { span: 14 },
            },
          }}
          onValuesChange={onFormLayoutChange}
        >
          <Form.Item label="Gist ID">
            <Input value={gistId} onChange={(e) => setGistId(e.target.value.trim())} />
          </Form.Item>

          <Form.Item label="Github Token">
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              value={ghToken}
              onChange={(e) => setGhToken(e.target.value.trim())}
            />
          </Form.Item>

          <Form.Item label="Scope">
            <Input value={scope} onChange={(e) => setScope(e.target.value.trim())} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ marginRight: '10px' }} onClick={save}>
              Submit
            </Button>
            <Button type="default" style={{ marginRight: '10px' }} onClick={onClose}>
              Cancel
            </Button>
            <Button type="default" onClick={refreshConfig}>
              Refresh
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.version}>Ver. {version}</div>
      </Drawer>
    </>
  );
}
