import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import "./App.scss";
import TheHeader from "./TheHeader/index";
import SearchBar from "./SearchBar/index";
import TheLogo from "./TheLogo/index";
import Shortcuts from "./Shortcuts/index";
import { SettingContext } from "./contexts";
import { useLocalStorage } from "../hooks/useLocalStorage";

function App() {
  const [engine, setEngine] = useLocalStorage("engine", "baidu");
  const [bg, setBg] = useLocalStorage("background", "default");

  const contextValue = React.useMemo(
    () => ({
      engine,
      background: bg,
      setEngine,
      setBackground: setBg,
    }),
    [engine, bg, setEngine, setBg]
  );

  return (
    <CssVarsProvider defaultMode="system">
      <SettingContext.Provider value={contextValue}>
        <div className="relative h-full bg-white dark:bg-slate-800">
          <TheHeader />
          <div className="absolute left-[50%] top-[50%] w-[80%] max-w-[600px] -translate-x-2/4 -translate-y-full">
            <TheLogo></TheLogo>
            <SearchBar></SearchBar>

            <Shortcuts></Shortcuts>
          </div>
        </div>
      </SettingContext.Provider>
    </CssVarsProvider>
  );
}

export default App;
