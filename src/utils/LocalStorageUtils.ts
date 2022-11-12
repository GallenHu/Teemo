import GistUtils from './GistUtils';
import { RemoteConfigure } from '../types/remote-configure';

export class LocalStorageUtils {
  get(key: string): string {
    return window.localStorage.getItem(key) || '';
  }

  set(key: string, val: string) {
    return window.localStorage.setItem(key, val);
  }

  storeRemoteConfigure(data: RemoteConfigure) {
    const content = GistUtils.parseRemoteData(data);

    localStorage.setItem('teemo_remote_config', content);
  }

  getStoredRemoteConfigure() {
    const conf = localStorage.getItem('teemo_remote_config');
    if (conf) return JSON.parse(conf);
    return null;
  }
}

export default new LocalStorageUtils();
