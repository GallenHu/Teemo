export interface Site {
  name: string;
  url: string;
  icon: string;
  desc: string;
}

export interface CategoryType {
  uid: string;
  alias: string;
  sites: Site[];
}

export interface Config {
  user: {
    [username: string]: CategoryType[];
  };
}

export interface RemoteConfigure {
  files: {
    [filename: string]: {
      content: string;
      language: string;
    };
  };
}
