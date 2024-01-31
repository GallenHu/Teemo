import * as React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import { SettingContext } from "../../contexts";

export default function () {
  const { theme, background, setTheme, setBackground } = React.useContext(
    SettingContext
  );

  const handleChange = (field: string, d: any) => {
    console.log(field, d);
  };

  return (
    <div className="px-[12px] mt-[20px]">
      <form>
        <Stack spacing={2} alignItems="flex-start">
          <FormControl sx={{ width: "100%" }}>
            <FormLabel>主题模式</FormLabel>
            <Select
              name="theme"
              defaultValue={theme}
              onChange={(e, d) => handleChange("theme", d)}
            >
              <Option value="auto">自动</Option>
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
