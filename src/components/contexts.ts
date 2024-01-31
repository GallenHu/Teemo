import * as React from "react";

const SettingContext = React.createContext<{
  engine: string;
  theme: string;
  background: string;
  setEngine: React.Dispatch<React.SetStateAction<string>>;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  setBackground: React.Dispatch<React.SetStateAction<string>>;
}>({
  engine: "",
  theme: "",
  background: "",
  setEngine: () => null,
  setTheme: () => null,
  setBackground: () => null,
});

export { SettingContext };
