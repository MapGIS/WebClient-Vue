import colorPalette from "./colorPalette";
import layoutFactory from "../layout/layout.json";
import themeFactory from "../theme/theme.json";
import { isArray } from "../../vue-types/utils";
import cssVars from "css-vars-ponyfill";
import tinyColor from "tinycolor2";

const lightTheme = themeFactory && themeFactory[1];
const standardLayout = layoutFactory && layoutFactory[0];

/* export type ThemeStyleParams = typeof lightTheme;

export interface FunctionColorParams {
  successColor? | string[];
  infoColor? | string[];
  warningColor? | string[];
  dangerColor? | string[];
}

export interface ExtraColorParams {
  [prop];
}

export interface StyleReplacerParams {
  themeStyle: ThemeStyleParams;
  primarySerialColors?[];
  functionSerialColors?: FunctionColorParams;
  extraSerialColors: ExtraColorParams;
} */

const $blue6 = "#1890ff";
const $green6 = "#52c41a";
const $glod6 = "#faad14";
const $red6 = "#f5222d";

const antdPrimaryColor = $blue6;
const antdFunctionColors = {
  infoColor: $blue6,
  successColor: $green6,
  warningColor: $glod6,
  dangerColor: $red6
};

const isBrowser = typeof window !== "undefined";
const isNativeSupport =
  isBrowser &&
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports("(--a: 0)");

export function getColorWithOpacity(color, opacity, isStack = true) {
  if (!color) {
    return color;
  }
  const originColor = tinyColor(color);
  const originOpacity = originColor.getAlpha();
  if (isStack) {
    originColor.setAlpha(originOpacity * opacity);
  } else {
    originColor.setAlpha(opacity);
  }
  const nextColor = originColor.toRgbString();
  return nextColor;
}

export function getDarkenColor(color, amount) {
  return tinyColor(color)
    .darken(amount)
    .toString();
}

export function getDerivedColorsByTextColor(textColor, opacity) {
  if (!textColor) {
    return textColor;
  }
  const baseTextColorOpacity = 0.65;
  const originTextColor = tinyColor(textColor);
  const originOpacity = originTextColor.getAlpha();
  originTextColor.setAlpha((originOpacity * opacity) / baseTextColorOpacity);
  const derivedColor = originTextColor.toRgbString();
  return derivedColor;
}

export function getPrimarySerialColors(nextThemeInfo) {
  const series = [];
  const nextThemeStyle = nextThemeInfo;
  let prevPrimaryColor;
  if (
    nextThemeStyle &&
    nextThemeStyle.colorGroup &&
    nextThemeStyle.colorGroup[0]
  ) {
    prevPrimaryColor = nextThemeStyle.colorGroup[0];
  }
  const acceptColor = prevPrimaryColor || antdPrimaryColor;
  for (let index = 1; index <= 10; index++) {
    let nextColor;
    switch (index) {
      case 2:
        nextColor = prevPrimaryColor
          ? getColorWithOpacity(acceptColor, 0.15)
          : colorPalette(acceptColor, index);
        break;
      case 5:
        nextColor = colorPalette(acceptColor, index);
        break;
      case 6:
        nextColor = acceptColor;
        break;
      case 7:
        nextColor = colorPalette(acceptColor, index);
        break;
      default:
        nextColor = colorPalette(acceptColor, index);
        break;
    }
    series.push(nextColor);
  }
  return series;
}

export function getFunctionSerialColors(functionColors) {
  const seriesIndex = [1, 2, 3, 4, 5, 6, 7];
  const acceptFunctionColors = functionColors || antdFunctionColors;
  const nextFunctionSerialColors = {};
  for (let key in acceptFunctionColors) {
    if (antdFunctionColors.hasOwnProperty(key)) {
      const color = acceptFunctionColors[key] || antdFunctionColors[key];
      nextFunctionSerialColors[key] = [];
      seriesIndex.forEach(item => {
        const nextColor = item === 6 ? color : colorPalette(color, item);
        nextFunctionSerialColors[key].push(nextColor);
      });
    }
  }
  return nextFunctionSerialColors;
}

export function getExtralColors(
  themeStyleData,
  primarySerialColors,
  functionColors
) {
  const tableHeaderSortActiveBg = getDarkenColor(
    themeStyleData.backgroundLight,
    3
  );
  const extraSerialColors = {
    textColorWithoutOpacity: getColorWithOpacity(
      themeStyleData.textColor,
      1,
      false
    ),
    backgroundWithoutOpacity: getColorWithOpacity(
      themeStyleData.background,
      1,
      false
    ),
    componentBackgroundWithoutOpacity: getColorWithOpacity(
      themeStyleData.componentBackground,
      1,
      false
    ),
    primaryShadowColor: getColorWithOpacity(primarySerialColors[4], 0.25),
    dangerShadowColor: getColorWithOpacity(functionColors.dangerColor[4], 0.25),
    disabledDarkenBgColor10: getDarkenColor(themeStyleData.disabledBgColor, 10),
    tableHeaderSortActiveBg,
    tableHeaderFilterActiveBg: getDarkenColor(tableHeaderSortActiveBg, 5)
  };
  return extraSerialColors;
}

export function dealWithTheme(nextThemeStyle) {
  const defaultThemeStyle = nextThemeStyle.style || "light";
  const defaultTheme = themeFactory.find(
    item => item.label === defaultThemeStyle
  );
  // 合并 lightTheme 是因为可能其他 theme 没有完整的参数，如 disableColor
  const themeStyleData = Object.assign(
    {},
    lightTheme,
    defaultTheme,
    nextThemeStyle
  );
  const serialColorsReplacer = getPrimarySerialColors(themeStyleData);
  const functionSerialColorsReplacer = getFunctionSerialColors(themeStyleData);
  const nextThemeStyleData = Object.assign({}, themeStyleData, {
    selectedColor: serialColorsReplacer[1],
    // 影响在theme.json中设置的hoverColor样式
    // hoverColor: serialColorsReplacer[4],
    clickColor: serialColorsReplacer[6]
  });
  const nextThemeData = {
    themeStyle: nextThemeStyleData,
    primarySerialColors: serialColorsReplacer,
    functionSerialColors: functionSerialColorsReplacer,
    extraSerialColors: getExtralColors(
      themeStyleData,
      serialColorsReplacer,
      functionSerialColorsReplacer
    )
  };
  setRootStyle(nextThemeData);
  return nextThemeData;
}

function setRootStyle(themeData) {
  const {
    themeStyle,
    primarySerialColors,
    functionSerialColors,
    extraSerialColors
  } = themeData;
  const primaryColor = themeStyle.colorGroup[0];
  const variables = {
    "--antd-wave-shadow-color": primaryColor,
    "--primary-color": primaryColor
  };
  const themeInfo = Object.assign({}, themeStyle, extraSerialColors);
  const themeKeys = Object.keys(themeInfo);
  primarySerialColors.forEach((color, index) => {
    const varKey = `--primary-${index + 1}`;
    variables[varKey] = color;
  });
  for (let key in functionSerialColors) {
    functionSerialColors[key].forEach((color, index) => {
      const varKey = `--${key.replace("Color", "")}-${index + 1}`;
      variables[varKey] = color;
    });
  }
  themeKeys.forEach(key => {
    if (!isArray(themeInfo[key])) {
      const varKey = `--${key.replace(/[A-Z]/g, "-$&").toLowerCase()}`;
      variables[varKey] = themeInfo[key];
    }
  });
  const rootStyle = `:root ${JSON.stringify(variables, null, 2)
    .replace(/(:.+),/g, "$1;")
    .replace(/"/g, "")}`;
  const antdStyleId = "mapgis-ui-style";
  let antStyleTag = document.getElementById(antdStyleId);
  if (!antStyleTag) {
    antStyleTag = document.createElement("style");
    antStyleTag.setAttribute("id", antdStyleId);
    antStyleTag.setAttribute("type", "text/css");
    document.head.insertBefore(antStyleTag, document.head.firstChild);
    const options = {
      include:
        "style#mapgis-ui-style, link[href*=webclient-vue-ui], link[href*=styles]",
      silent: true,
      onlyLegacy: true,
      variables: {},
      watch: false
    };
    if (!isNativeSupport) {
      options.onlyLegacy = false;
      options.watch = true;
      options.variables = variables;
    }
    cssVars(options);
  }
  antStyleTag.innerHTML = rootStyle;
}

export function dealWithLayout(nextLayoutStyle) {
  const defaultLayoutStyle = nextLayoutStyle || "admin";
  const defaultLayout = layoutFactory.find(
    item => item.label === defaultLayoutStyle.label
  );
  const layoutInfo = Object.assign({}, defaultLayout);
  const variables = {};

  const layoutKeys = Object.keys(layoutInfo);
  layoutKeys.forEach(key => {
    if (!isArray(layoutInfo[key])) {
      const varKey = `--${key.replace(/[A-Z]/g, "-$&").toLowerCase()}`;
      variables[varKey] = layoutInfo[key];
    }
  });

  const nextLayoutData = {
    layoutStyle: layoutInfo
  };

  const rootStyle = `:root ${JSON.stringify(variables, null, 2)
    .replace(/(:.+),/g, "$1;")
    .replace(/"/g, "")}`;
  const antdLayoutId = "mapgis-ui-layout";
  let antdLayoutTag = document.getElementById(antdLayoutId);
  if (!antdLayoutTag) {
    antdLayoutTag = document.createElement("style");
    antdLayoutTag.setAttribute("id", antdLayoutId);
    antdLayoutTag.setAttribute("type", "text/css");
    document.head.insertBefore(antdLayoutTag, document.head.firstChild);
    const options = {
      include:
        "style#mapgis-ui-layout, link[href*=webclient-vue-ui], link[href*=styles]",
      silent: true,
      onlyLegacy: true,
      variables: {},
      watch: false
    };
    if (!isNativeSupport) {
      options.onlyLegacy = false;
      options.watch = true;
      options.variables = variables;
    }
    cssVars(options);
  }
  antdLayoutTag.innerHTML = rootStyle;
  return nextLayoutData;
}
