import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppTheme, ThemeMode, createTheme } from "@/constants/theme";

const THEME_STORAGE_KEY = "@dropset_pro:theme-preference";

interface ThemeContextValue {
  mode: ThemeMode;
  theme: AppTheme;
  colors: AppTheme["colors"];
  tokens: AppTheme["tokens"];
  toggleTheme: () => void;
  setThemeMode: (nextMode: ThemeMode) => Promise<void>;
  isReady: boolean;
}

export const [ThemeProvider, useTheme] = createContextHook<ThemeContextValue>(() => {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          if (isMounted) {
            setMode(stored);
          }
        }
      } catch (error) {
        console.log("ThemeProvider hydration error", error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const theme = useMemo(() => createTheme(mode), [mode]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch((error) =>
      console.log("ThemeProvider SystemUI error", error)
    );
  }, [theme.colors.background]);

  const setThemeMode = useCallback(
    async (nextMode: ThemeMode) => {
      setMode(nextMode);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
      } catch (error) {
        console.log("ThemeProvider setThemeMode error", error);
      }
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setThemeMode(mode === "dark" ? "light" : "dark");
  }, [mode, setThemeMode]);

  return {
    mode,
    theme,
    colors: theme.colors,
    tokens: theme.tokens,
    toggleTheme,
    setThemeMode,
    isReady,
  };
});
