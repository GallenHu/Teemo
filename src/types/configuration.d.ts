import type { WidgetName } from '@/types/widget';
import Site from '@/containers/Desktop/SiteList/helper/Site';

export enum ContentType {
  WIDGET = 'widget',
  SITE = 'site',
}

export interface Widget {
  type: ContentType.WIDGET;
  name: WidgetName;
  id: string;
}

export interface Page {
  id: string;
  name: string;
  icon: string;
  children: (Widget | Site)[];
}
