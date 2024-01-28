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
      <div className="h-full relative">
        <div className="absolute w-[600px] top-[50%] left-[50%] -mt-[300px] -translate-x-2/4">
          <TheLogo></TheLogo>
          <SearchBar></SearchBar>
        </div>
      </div>
    </EngineContext.Provider>
  );
}

export default App;
