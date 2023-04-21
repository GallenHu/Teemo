import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TheWidget from '@/components/TheWidget';
import SiteItem from './SiteItem';
import { ContentType, Page, Widget } from '@/types/configuration.d';
import type Site from '@/containers/Desktop/SiteList/helper/Site';

interface Props {
  type: ContentType;
  name: string;
  manageMode: boolean;
  node: Site | Widget;
  page: Page;
  index: number;
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

const ListNode: FC<Props> = props => {
  const { type, index, moveCard, node, manageMode } = props;

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
    [node.id, index, moveCard]
  );

  const [, drag] = useDrag({
    type: 'card',
    item: (): DragItem => {
      return { id: node.id, index, type: 'card' };
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

  return type === ContentType.WIDGET ? (
    <TheWidget {...props} ref={(node: HTMLDivElement) => drag(drop(node))} />
  ) : (
    <SiteItem {...props} ref={(node: HTMLDivElement) => drag(drop(node))} site={props.node as Site}></SiteItem>
  );
};

export default ListNode;
