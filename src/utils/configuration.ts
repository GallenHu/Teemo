import type { Page, Widget } from '@/types/configuration';
import Site from '@/containers/Desktop/SiteList/helper/Site';
import DEFAULT_PAGES from '@/constants/default-pages';
import bgs from '@/constants/background-images';

class Configuration {
  timestamp = 0; // updatedAt
  id = '';
  pages = [...DEFAULT_PAGES] as Page[];
  bgUrl = '';

  get bg() {
    return this.bgUrl || bgs[0];
  }

  set bg(url: string) {
    this.bgUrl = url;
    this.timestamp = Date.now();
  }

  constructor(defaultData?: Configuration) {
    if (defaultData) {
      this.applyConfiguration(defaultData);
    } else {
      this.timestamp = Date.now();
      this.id = window.btoa('anonymous') + '_' + this.timestamp;
      this.bgUrl = bgs[0];
    }

    return this;
  }

  static parseConfig(configJson: string) {
    try {
      const config = JSON.parse(configJson);
      if (config.id) {
        return { data: config, error: null };
      } else {
        return { data: null, error: new Error('config id missing') };
      }
    } catch {
      return { data: null, error: new Error('config format error') };
    }
  }

  getConfiguration() {
    if (typeof this === 'object') {
      return JSON.stringify(this);
    }
    return '';
  }

  applyConfiguration(conf: Configuration) {
    this.timestamp = conf.timestamp;
    this.id = conf.id;
    this.pages = conf.pages;
    this.bgUrl = conf.bgUrl;
    return this;
  }

  addSite(pageId: string, site: Site) {
    this.pages.find(item => item.id === pageId)?.children.push(site);
    this.timestamp = Date.now();
    return this;
  }

  updateSite(pageId: string, site: Site) {
    const page = this.pages.find(item => item.id === pageId);
    if (page) {
      const index = page.children.findIndex(item => item.id === site.id);
      if (index > -1) {
        page.children[index] = {
          ...site,
          id: page.children[index].id,
          updateAt: Date.now(),
        };
        this.timestamp = Date.now();
      } else {
        console.error('site not found!');
      }
    } else {
      console.error('page not found!');
    }

    return this;
  }

  deleteSite(pageId: string, site: Site) {
    const page = this.pages.find(item => item.id === pageId);

    if (page) {
      page.children = page.children.filter(item => item.id !== site.id);
    }

    this.timestamp = Date.now();
    return this;
  }

  addPage(name: string, icon: string) {
    this.pages.push({
      id: 'page-' + Date.now(),
      name,
      icon: 'icon-' + icon,
      children: [],
    });
    this.timestamp = Date.now();
    return this;
  }

  updatePage(pageIndex: number, name: string, icon: string) {
    this.pages[pageIndex].name = name;
    this.pages[pageIndex].icon = icon;

    this.timestamp = Date.now();
    return this;
  }

  updateSiteList(pageId: string, siteList: (Widget | Site)[]) {
    const page = this.pages.find(item => item.id === pageId);

    if (page) {
      page.children = siteList;

      this.timestamp = Date.now();
    }

    return this;
  }

  deletePage(pageIndex: number) {
    this.pages.splice(pageIndex, 1);
    this.timestamp = Date.now();
    return this;
  }
}

export default Configuration;
