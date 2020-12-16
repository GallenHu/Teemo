interface RemoteConfigure {
  files: {
    [filename: string]: {
      content: string;
      language: string;
    };
  };
}

function jsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return '';
  }
}

export function storeRemoteConfigure(data: RemoteConfigure) {
  const files = data.files;
  const first = Object.keys(files)[0];
  const content = files[first].content || '';

  localStorage.setItem('teemo-remote-config', content);
}

export function getStoredRemoteConfigure() {
  const conf = localStorage.getItem('teemo-remote-config');
  if (conf) return jsonParse(conf);
  return null;
}

export function getUsername() {
  const username = localStorage.getItem('teemo-configure-username');
  return username || '';
}

export function storeSitesVisible(visible: boolean) {
  localStorage.setItem('teemo-sites-visible', String(visible));
}

export function getSitesVisible() {
  const val = localStorage.getItem('teemo-sites-visible');
  return val === 'true' ? true : false;
}
