import { useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";

function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return children;
}

export default ThemeProvider;

/*
What does this do?
- Reads the currently selected theme from Zustand.
- Applies it to the HTML root element.
- When the theme changes, CSS variables update automatically.
- All pages and components inherit the selected theme.
*/
