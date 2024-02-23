import * as React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import "./App.scss";
import PageContainer from "./PageContainer/index";
import TheHeader from "./TheHeader/index";
import SearchBar from "./SearchBar/index";
import TheLogo from "./TheLogo/index";
import NavListShortcuts from "./Shortcuts/NavList";
import { SettingContext } from "./contexts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { smoothScroll } from "../utils/index";

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

  let timer: any;

  React.useEffect(() => {
    const top0 = document.getElementById("main")?.offsetTop || 0;
    const top1 = document.getElementById("nav")?.offsetTop || 0;

    const handleScroll = (e: any) => {
      e.preventDefault();

      if (timer) {
        return;
      }

      const scrollTop = document.documentElement.scrollTop;
      const duration = 400;

      if (e.deltaY > 0) {
        // down
        if (Math.abs(scrollTop - top0) < 30) {
          smoothScroll(top1, duration);
        }
      } else if (Math.abs(scrollTop - top1) < 30) {
        smoothScroll(top0, duration);
      }

      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
      }, duration);
    };

    document.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <CssVarsProvider defaultMode="system" theme={theme}>
      <SettingContext.Provider value={contextValue}>
        <PageContainer id="main">
          <div className="relative h-full">
            <TheHeader />
            <div className="absolute left-[50%] top-[50%] w-[80%] max-w-[600px] -translate-x-2/4 -translate-y-full">
              <TheLogo></TheLogo>
              <SearchBar></SearchBar>
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
