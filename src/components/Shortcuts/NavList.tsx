import React, { useState } from "react";
import { styled } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Sheet from "@mui/joy/Sheet";
import ImageIcon from "../ImageIcon/index";
import { Shortcut } from "../../types/shortcut";
import { SHORTCUTS_MARKET } from "../../constants/shortcuts";

interface ListProps {
  title: string;
  items: Shortcut[];
}

const List: React.FC<ListProps> = ({ title, items }) => {
  const [list, setList] = useState(items);

  return (
    <div className=" mb-[50px] ">
      <div className="mb-[12px]">
        <Typography level="title-sm">{title}</Typography>
      </div>

      <div className="flex items-center px-[20px] py-[14px] rounded-md bg-white dark:bg-slate-600">
        {list.map((item, i) => {
          return (
            <Link
              key={i}
              href={item.url}
              target="_blank"
              color="primary"
              level="body-sm"
              underline="none"
              variant="plain"
              sx={{
                width: "100px",
                marginRight: "10px",
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              <ImageIcon src={item.icon} height="18px" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="w-[800px] h-[80%] mx-auto pt-[50px] ">
      {Object.keys(SHORTCUTS_MARKET).map((key) => {
        return <List key={key} title={key} items={SHORTCUTS_MARKET[key]} />;
      })}
    </div>
  );
};

export default Page;
