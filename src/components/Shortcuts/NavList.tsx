import React, { useState } from "react";
import { styled } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Sheet from "@mui/joy/Sheet";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Shortcut } from "../../types/shortcut";
import { DraggableItem } from "./ShortcutItem";
import { SHORTCUTS_MARKET } from "../../constants/shortcuts";

interface ListProps {
  title: string;
  items: Shortcut[];
}

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(71, 85, 105)" : "inherit",
  ...theme.typography["body-sm"],
  padding: theme.spacing(1),
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

const List: React.FC<ListProps> = ({ title, items }) => {
  const [list, setList] = useState(items);

  return (
    <div className="w-[800px] mx-auto mb-[50px] ">
      <Typography>{title}</Typography>

      <div className="flex items-center p-[20px] bg-white dark:bg-slate-600">
        {list.map((item) => {
          return (
            <span>
              <Item>{item.title}</Item>
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="w-[80%] h-[80%] mx-auto p-[20px] bg-slate-100 dark:bg-slate-800">
      {Object.keys(SHORTCUTS_MARKET).map((key) => {
        return <List title={key} items={SHORTCUTS_MARKET[key]} />;
      })}
    </div>
  );
};

export default Page;
