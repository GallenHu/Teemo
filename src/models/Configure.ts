export interface Site {
  name: string;
  url: string;
  icon: string;
  desc: string;
}

export interface Category {
  uid: string;
  alias: string;
  sites: Site[];
}

export interface Config {
  user: {
    [username: string]: Category[];
  };
}
