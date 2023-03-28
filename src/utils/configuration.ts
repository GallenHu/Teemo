import { Page } from '@/types/configuration';
import Site from '@/containers/Desktop/SiteList/helper/Site';
import DEFAULT_PAGES from '@/constants/default-pages';

class Configuration {
  timestamp = 0; // updatedAt
  id = '';
  pages = [...DEFAULT_PAGES] as Page[];

  constructor(defaultData?: Configuration) {
    if (defaultData) {
      this.applyConfiguration(defaultData);
    } else {
      this.timestamp = Date.now();
      this.id = window.btoa('anonymous') + '_' + this.timestamp;
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
    return this;
  }

  addSite(pageId: string, site: Site) {
    this.pages.find(item => item.id === pageId)?.children.push(site);
    this.timestamp = Date.now();
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

  deletePage(pageIndex: number) {
    this.pages.splice(pageIndex, 1);
    this.timestamp = Date.now();
    return this;
  }
}

export default Configuration;
