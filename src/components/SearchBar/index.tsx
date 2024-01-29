import * as React from "react";
import { SearchOutlined } from "@ant-design/icons";
import Autocomplete from "@mui/joy/Autocomplete";
import Button from "@mui/joy/Button";
import { EngineContext } from "../contexts";
import { getSuggestions } from "../../services/search";
import {
  BUTTON_COLORS,
  BUTTON_VARIANT,
  BUTTON_TEXT,
  ENGINE_URL,
} from "../../constants";

export default function SearchBar() {
  const [options, setOptions] = React.useState<string[]>([]);
  // const [value, setValue] = React.useState<string>();
  const [inputValue, setInputValue] = React.useState("");
  const { engine } = React.useContext(EngineContext);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = ENGINE_URL[engine].replace("$key$", inputValue);
    window.open(url, "_blank", "noopener");
  };

  const onInputChange = async (_: any, newInputValue: string) => {
    const data = await getSuggestions(newInputValue);
    const suggestions = data.s || [];
    setOptions(suggestions);

    setInputValue(newInputValue);
  };

  return (
    <form onSubmit={submit}>
      <Autocomplete
        className=" w-full"
        sx={{
          "--Input-decoratorChildHeight": "45px",
          "--Input-radius": "10px",
        }}
        type="search"
        freeSolo
        disableClearable
        inputValue={inputValue}
        onInputChange={onInputChange}
        options={options.map((option) => option)}
        startDecorator={<SearchOutlined />}
        endDecorator={
          <Button
            className="w-[120px]"
            type="submit"
            variant={BUTTON_VARIANT[engine]}
            color={BUTTON_COLORS[engine]}
            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={submit}
          >
            {BUTTON_TEXT[engine]}
          </Button>
        }
      />
    </form>
  );
}
