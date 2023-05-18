import themeFactory from "./theme.json";

export function getTheme(themeStyle) {
  let theme = themeFactory.find(item => item.label === themeStyle);
  return theme;
}
