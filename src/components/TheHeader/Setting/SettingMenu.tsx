import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import { SettingContext } from "../../contexts";

export default function () {
  const { mode, setMode } = useColorScheme();

  const { background, setBackground } = React.useContext(SettingContext);

  const handleChange = (field: string, data: any) => {
    if (field === "theme") {
      setMode(data);
    }
  };

  return (
    <div className="px-[12px] mt-[20px]">
      <form>
        <Stack spacing={2} alignItems="flex-start">
          <FormControl sx={{ width: "100%" }}>
            <FormLabel>主题模式</FormLabel>
            <Select
              name="theme"
              defaultValue={mode}
              onChange={(e, d) => handleChange("theme", d)}
            >
              <Option value="system">跟随系统</Option>
              <Option value="light">浅色</Option>
              <Option value="dark">深色</Option>
            </Select>
          </FormControl>

          <FormControl sx={{ width: "100%" }}>
            <FormLabel>背景</FormLabel>
            <Select
              name="background"
              defaultValue={background}
              onChange={(e, d) => handleChange("background", d)}
            >
              <Option value="default">默认</Option>
            </Select>
          </FormControl>
        </Stack>
      </form>
    </div>
  );
}
