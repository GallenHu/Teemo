import * as React from "react";

const EngineContext = React.createContext<{
  engine: string;
  setEngine: React.Dispatch<React.SetStateAction<string>>;
}>({ engine: "", setEngine: () => null });

export { EngineContext };
