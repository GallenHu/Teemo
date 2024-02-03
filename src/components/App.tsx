import * as React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import "./App.scss";
import PageContainer from "./PageContainer/index";
import TheHeader from "./TheHeader/index";
import SearchBar from "./SearchBar/index";
import TheLogo from "./TheLogo/index";
import HomeListShortcuts from "./Shortcuts/HomeList";
import NavListShortcuts from "./Shortcuts/NavList";
import { SettingContext } from "./contexts";
import { useLocalStorage } from "../hooks/useLocalStorage";

declare module "@mui/joy/Button" {
  interface ButtonPropsSizeOverrides {
    xs: true;
    xl: true;
  }
}

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

  const theme = extendTheme({
    components: {
      JoyButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.size === "xs" && {
              "--Icon-fontSize": "1rem",
              "--Button-gap": "0.25rem",
              minHeight: "var(--Button-minHeight, 1.75rem)",
              fontSize: theme.vars.fontSize.xs,
              paddingBlock: "2px",
              paddingInline: "0.5rem",
            }),
          }),
        },
      },
    },
  });

  return (
    <CssVarsProvider defaultMode="system" theme={theme}>
      <SettingContext.Provider value={contextValue}>
        <PageContainer id="main">
          <div className="relative h-full">
            <TheHeader />
            <div className="absolute left-[50%] top-[50%] w-[80%] max-w-[600px] -translate-x-2/4 -translate-y-full">
              <TheLogo></TheLogo>
              <SearchBar></SearchBar>

              <HomeListShortcuts />
            </div>
          </div>
        </PageContainer>

        <PageContainer id="nav">
          <NavListShortcuts />
        </PageContainer>
      </SettingContext.Provider>
    </CssVarsProvider>
  );
}

export default App;
