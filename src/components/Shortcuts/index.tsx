import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Shortcut } from "../../types/shortcut";
import { DraggableItem } from "./ShortcutItem";
import { SHORTCUTS_MARKET } from "../../constants/shortcuts";

interface GridListProps {
  items: Shortcut[];
}

const GridList: React.FC<GridListProps> = ({ items }) => {
  const [list, setList] = useState(items);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = list[dragIndex];
    const updatedList = [...list];
    updatedList.splice(dragIndex, 1);
    updatedList.splice(hoverIndex, 0, draggedItem);
    setList(updatedList);
  };

  return (
    <div
      className="flex gap-[20px] absolute w-full top-[100%] mt-[20px]"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      {list.map((item, index) => (
        <DraggableItem
          key={index}
          item={item}
          index={index}
          moveItem={moveItem}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <GridList items={SHORTCUTS_MARKET} />
    </DndProvider>
  );
};

export default App;
