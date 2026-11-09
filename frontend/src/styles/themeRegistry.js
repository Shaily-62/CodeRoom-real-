export const themes = {
  dark: {
    id: "dark",
    name: "Dark",
    description: "Graphite and Sage",
    type: "dark",
  },

  light: {
    id: "light",
    name: "Light",
    description: "Warm Ivory and Sage",
    type: "light",
  },
};

export const defaultTheme = "dark";

export const getTheme = (themeId) => {
  return themes[themeId] || themes[defaultTheme];
};