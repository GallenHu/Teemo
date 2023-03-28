import { ContentType } from '@/types/configuration.d';
import constants from '@/constants';

interface Options {
  name: string;
  url: string;
  type?: ContentType;
  bgType: 'image' | 'color';
  bgColor?: string;
  bgImage?: string;
  iconText?: string;
}

export default class Site {
  id = '';
  name = '';
  url = '';
  type: ContentType = ContentType.SITE;
  bgType: 'image' | 'color' = 'image';
  bgColor: string = constants.DEFAULT_ICON_BG_COLOR;
  bgImage = '';
  iconText = '';
  updateAt = 0;

  constructor(options: Options) {
    Object.keys(options).forEach(key => {
      const val = (options as any)[key];

      if (val) {
        (this as any)[key] = val;
      }

      this.id = 'site_' + Date.now();
      this.updateAt = Date.now();

      return this;
    });
  }
}
