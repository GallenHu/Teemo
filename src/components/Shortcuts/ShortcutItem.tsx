import { useDrag, useDrop, DndProvider } from "react-dnd";
import { Shortcut } from "../../types/shortcut";

interface DraggableItemProps {
  item: Shortcut;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = "ITEM";

export const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  moveItem,
}) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <a
        href={item.url}
        target="_blank"
        className="inline-flex items-center opacity-30 hover:opacity-100"
      >
        <div
          className="w-[18px] h-[18px] bg-contain bg-no-repeat bg-center rounded"
          style={{ backgroundImage: `url(${item.icon})` }}
        ></div>
        <div className="text-[14px] text-center ml-[4px] ">{item.title}</div>
      </a>
    </div>
  );
};
