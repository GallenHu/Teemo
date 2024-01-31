import * as React from "react";

const SettingContext = React.createContext<{
  engine: string;
  background: string;
  setEngine: React.Dispatch<React.SetStateAction<string>>;
  setBackground: React.Dispatch<React.SetStateAction<string>>;
}>({
  engine: "",
  background: "",
  setEngine: () => null,
  setBackground: () => null,
});

export { SettingContext };
