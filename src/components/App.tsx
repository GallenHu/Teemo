import * as React from "react";
import "./App.scss";
import TheHeader from "./TheHeader/index";
import SearchBar from "./SearchBar/index";
import TheLogo from "./TheLogo/index";
import { SettingContext } from "./contexts";
import { useLocalStorage } from "../hooks/useLocalStorage";

function App() {
  const [engine, setEngine] = useLocalStorage("engine", "baidu");
  const [theme, setTheme] = useLocalStorage("theme", "auto");
  const [bg, setBg] = useLocalStorage("background", "default");

  const contextValue = React.useMemo(
    () => ({
      engine,
      theme,
      background: bg,
      setEngine,
      setTheme,
      setBackground: setBg,
    }),
    [engine, theme, bg, setEngine, setTheme, setBg]
  );

  return (
    <SettingContext.Provider value={contextValue}>
      <div className="relative h-full">
        <TheHeader />
        <div className="absolute left-[50%] top-[50%] w-[600px] -translate-x-2/4 -translate-y-full">
          <TheLogo></TheLogo>
          <SearchBar></SearchBar>
        </div>
      </div>
    </SettingContext.Provider>
  );
}

export default App;
