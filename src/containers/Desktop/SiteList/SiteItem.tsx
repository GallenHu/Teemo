import IconColorBg from '@/components/IconColorBg';
import type Site from '@/containers/Desktop/SiteList/helper/Site';
import { Page } from '@/types/configuration.d';
import { NotificationCircle } from 'baseui/badge';
import Delete from 'baseui/icon/delete';
import type { FC } from 'react';
import { useRef, forwardRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

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

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const SiteItem: FC<SiteProps> = ({
  index,
  manageMode,
  site,
  page,
  onClickSite,
  onClickDeleteIcon,
  bindLongPress,
  moveCard,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem, void, unknown>(
    () => ({
      accept: 'card',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item: DragItem) {
        const dragSiteId = item.id;
        const overIndex = index; // will change on drag

        moveCard(dragSiteId, overIndex);
      },
    }),
    [site.id, index, moveCard]
  );

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: (): DragItem => {
      return { id: site.id, index, type: 'card' };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    // end: (item, monitor) => {
    //   const { id: siteId, index: originalIndex } = item;
    //   const didDrop = monitor.didDrop();
    //   if (!didDrop) {
    //     moveCard(siteId, originalIndex);
    //   }
    // },
    canDrag() {
      return !!manageMode;
    },
  });

  const SiteIcon = forwardRef((_, ref) => {
    return (
      <div
        ref={ref}
        className={['site-item', isDragging && 'dragging-item'].join(' ')}
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
  });

  drag(ref);

  return manageMode ? (
    <NotificationCircle content={<Delete className="icon-close" onClick={() => onClickDeleteIcon(site, page)} />}>
      <SiteIcon ref={(node: HTMLElement) => drag(drop(node))} />
    </NotificationCircle>
  ) : (
    <SiteIcon ref={(node: HTMLElement) => drag(drop(node))} />
  );
};

export default SiteItem;
