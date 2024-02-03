import * as React from "react";

interface ContainerComponentProps {
  children: React.ReactNode;
  id: string;
}

export default function (props: ContainerComponentProps) {
  return (
    <div id={props.id} className="h-screen bg-white dark:bg-slate-800">
      {props.children}
    </div>
  );
}
