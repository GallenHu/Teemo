import { ReactNode, useState } from "react";
import "./style.css";

interface Item {
  key: string;
  label: ReactNode;
  children: ReactNode | ReactNode[];
}

interface Props {
  items: Item[];
  active: string;
  onChange: (key: string, index: number) => void;
}

export default function (props: Props) {
  const { items } = props;

  const activeItem = items.find((item) => item.key === props.active);

  return (
    <div className="flex">
      <div className="head w-[170px] min-h-[200px]">
        {items.map((item, i) => (
          <div
            className={[
              item.key === activeItem?.key ? "active" : "",
              "cursor-default",
              "py-[6px]",
              "px-[6px]",
            ].join(" ")}
            key={item.key}
            onClick={() => props.onChange(item.key, i)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div>{activeItem?.children}</div>
    </div>
  );
}
