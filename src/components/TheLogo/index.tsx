import * as React from "react";
import IconG from "../../assets/google.svg";
import IconB from "../../assets/baidu.svg";
import { SettingContext } from "../contexts";

export default function TheLogo() {
  const { engine, setEngine } = React.useContext(SettingContext);
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
    <div className="w-full text-center">
      <img
        src={ICONS[engine]}
        alt={engine}
        className="inline-block w-[50%]"
        onClick={toggleEngine}
      />
    </div>
  );
}
