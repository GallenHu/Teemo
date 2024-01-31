import * as React from "react";
import { SearchOutlined } from "@ant-design/icons";
import Autocomplete from "@mui/joy/Autocomplete";
import Button from "@mui/joy/Button";
import { SettingContext } from "../contexts";
import { getSuggestions } from "../../services/search";
import {
  BUTTON_COLORS,
  BUTTON_VARIANT,
  BUTTON_TEXT,
  ENGINE_URL,
} from "../../constants";
import { useDebounce } from "react-use";
import useKeyboardJs from "react-use/lib/useKeyboardJs";

export default function SearchBar() {
  const [options, setOptions] = React.useState<string[]>([]);
  // Dropdown Value (hidden)
  const [value, setValue] = React.useState<string>("");
  // Input Value
  const [inputValue, setInputValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const { engine } = React.useContext(SettingContext);
  const inputRef = React.useRef<any>();

  const [isPressedHotkeyFocus] = useKeyboardJs("/");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const url = ENGINE_URL[engine].replace("$key$", value);
    window.open(url, "_blank", "noopener");
  };

  const fetch = async (keyword: string) => {
    if (!keyword) {
      setOptions([]);
      return;
    }
    const data = await getSuggestions(keyword);
    const suggestions = data.s || [];
    setOptions(suggestions);
  };

  // 正常输入将触发 InputChange, 方向键不会
  const onInputChange = (evt: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    setValue(newInputValue);
    setSearchValue(newInputValue);
  };

  const onKeyUp = (evt: any) => {
    if (evt.key.toLowerCase() === "enter") {
      submit();
    }
  };

  const onHighlightChange = (
    event: React.SyntheticEvent,
    option: string | null
  ) => {
    if (option) {
      setValue(option);
      setInputValue(option);
    }
  };

  useDebounce(
    () => {
      fetch(searchValue);
    },
    300,
    [searchValue]
  );

  React.useEffect(() => {
    if (isPressedHotkeyFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  }, [isPressedHotkeyFocus]);

  return (
    <form onSubmit={submit}>
      <Autocomplete
        className=" w-full"
        sx={{
          "--Input-decoratorChildHeight": "45px",
          "--Input-radius": "10px",
        }}
        type="search"
        slotProps={{
          input: {
            ref: inputRef,
          },
        }}
        freeSolo
        disableClearable
        autoFocus
        value={value}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onKeyUp={onKeyUp}
        options={options}
        /* do not filter */
        filterOptions={(x) => x}
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
        onHighlightChange={onHighlightChange}
      />
    </form>
  );
}
