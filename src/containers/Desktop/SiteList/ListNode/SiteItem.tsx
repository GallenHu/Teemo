import { forwardRef } from 'react';
import IconColorBg from '@/components/IconColorBg';
import { Page } from '@/types/configuration';
import { NotificationCircle } from 'baseui/badge';
import Delete from 'baseui/icon/delete';
import type Site from '@/containers/Desktop/SiteList/helper/Site';

export interface SiteProps {
  index: number;
  manageMode: boolean;
  site: Site;
  page: Page;
  onClickSite: (site: Site, page: Page) => void;
  onClickDeleteIcon: (site: Site, page: Page) => void;
  bindLongPress: any;
  moveCard: (cardId: string, targetIndex: number) => void;
}

const SiteItem = forwardRef<HTMLDivElement, SiteProps>(
  ({ index, manageMode, site, page, onClickSite, onClickDeleteIcon, bindLongPress, moveCard }, ref) => {
    const SiteIcon = () => {
      return (
        <div
          ref={ref}
          className={['site-item'].join(' ')}
          key={site.id}
          onClick={() => onClickSite(site, page)}
          {...bindLongPress()}
        >
          {site.bgType === 'image' ? (
            <div className="icon" style={{ backgroundImage: `url(${site.bgImage})` }}></div>
          ) : (
            <IconColorBg bgColor={site.bgColor} text={site.iconText || site.name.slice(0, 1).toUpperCase()} />
          )}
          <div className="name">{site.name}</div>
        </div>
      );
    };

    return manageMode ? (
      <NotificationCircle content={<Delete className="icon-close" onClick={() => onClickDeleteIcon(site, page)} />}>
        <SiteIcon />
      </NotificationCircle>
    ) : (
      <SiteIcon />
    );
  }
);

export default SiteItem;
