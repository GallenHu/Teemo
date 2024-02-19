import { useDrag, useDrop, DndProvider } from "react-dnd";
import { Shortcut } from "../../types/shortcut";
import Button from "@mui/joy/Button";
import ImageIcon from "../ImageIcon";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import "./style.css";

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
    <div
      className="shortcut-item relative h-[36px] opacity-20 hover:opacity-100"
      ref={(node) => drag(drop(node))}
    >
      <a href={item.url} target="_blank" className="inline-flex items-center ">
        <Button
          variant="plain"
          color="neutral"
          startDecorator={<ImageIcon src={item.icon} height="18px" />}
        >
          {item.title}
        </Button>
      </a>

      <Dropdown>
        <MenuButton
          className="right-0 top-[6px] dropdown-trigger"
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "xs" },
          }}
        >
          <MoreOutlined className="text-[12px]" />
        </MenuButton>
        <Menu size="sm">
          <MenuItem>
            <DeleteOutlined />
            <span>移除</span>
          </MenuItem>
        </Menu>
      </Dropdown>
    </div>
  );
};
