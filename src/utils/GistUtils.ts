import { RemoteConfigure } from '../types/remote-configure';

export class GistUtils {
  parseRemoteData(data: RemoteConfigure) {
    const files = data.files;
    const first = Object.keys(files)[0];
    const content = files[first].content || '';

    return content;
  }
}

export default new GistUtils();
