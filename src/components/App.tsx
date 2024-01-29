import * as React from "react";
import "./App.scss";
import SearchBar from "./SearchBar/index";
import TheLogo from "./TheLogo/index";
import { EngineContext } from "./contexts";
import { useLocalStorage } from "../hooks/useLocalStorage";

function App() {
  const [value, setValue] = useLocalStorage("engine", "baidu");

  const contextValue = React.useMemo(
    () => ({
      engine: value,
      setEngine: setValue,
    }),
    [value, setValue]
  );

  return (
    <EngineContext.Provider value={contextValue}>
      <div className="relative h-full">
        <div className="absolute left-[50%] top-[50%] w-[600px] -translate-x-2/4 -translate-y-full">
          <TheLogo></TheLogo>
          <SearchBar></SearchBar>
        </div>
      </div>
    </EngineContext.Provider>
  );
}

export default App;
