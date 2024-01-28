import * as React from "react";
import IconG from "../../assets/google.svg";
import IconB from "../../assets/baidu.svg";
import { EngineContext } from "../contexts";

export default function TheLogo() {
  const { engine, setEngine } = React.useContext(EngineContext);
  const ICONS = {
    baidu: IconB,
    google: IconG,
  } as Record<string, string>;

  const toggleEngine = () => {
    if (engine === "baidu") {
      setEngine("google");
    } else {
      setEngine("baidu");
    }
  };

  return (
    <div className="text-center w-full" onClick={toggleEngine}>
      <img src={ICONS[engine]} className="inline-block w-[300px]" />
    </div>
  );
}
