/**
 * 随机生成一个guid
 * @returns {string}
 */
export const newGuid = function () {
  let guid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      guid += "-";
    }
  }
  return guid;
};

/**
 * @description 生成UUID字符串
 */
export function uuid() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  const UuidStr = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      // tslint:disable-next-line: no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line: no-bitwise
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return UuidStr;
}

/**
 * @description 生成随机字符串
 */
export function randomid() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  const UuidStr = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // tslint:disable-next-line: no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line: no-bitwise
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return UuidStr;
}

/**
 * 深比较内容
 * @param {*} a 对象a
 * @param {*} b 对象b
 * @returns 是否相等
 */
export function deepEqual(a, b) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === "object" && a !== null && b !== null) {
    if (!(typeof b === "object")) return false;
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    for (const key in a) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return a === b;
}

export function colorHex(rgb) {
  let _this = rgb;
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (/^(rgb|RGB)/.test(_this)) {
    let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    let strHex = "#";
    for (let i = 0; i < aColor.length; i++) {
      let hex = Number(aColor[i]).toString(16);
      hex = hex < 10 ? 0 + "" + hex : hex; // 保证每个rgb的值为2位
      if (hex === "0") {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = _this;
    }
    return strHex;
  } else if (reg.test(_this)) {
    let aNum = _this.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return _this;
    } else if (aNum.length === 3) {
      let numHex = "#";
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i];
      }
      return numHex;
    }
  } else {
    return _this;
  }
}

export function colorRgb(sColor) {
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  sColor = sColor.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return sColorChange;
  } else {
    return sColor;
  }
}

export function gradientColor(startColor, endColor, step) {
  let startRGB = colorRgb(startColor); //转换为rgb数组模式
  let startR = startRGB[0];
  let startG = startRGB[1];
  let startB = startRGB[2];

  let endRGB = colorRgb(endColor);
  let endR = endRGB[0];
  let endG = endRGB[1];
  let endB = endRGB[2];

  let sR = (endR - startR) / step; //总差值
  let sG = (endG - startG) / step;
  let sB = (endB - startB) / step;

  let colorArr = [];
  for (let i = 0; i < step; i++) {
    //计算每一步的hex值
    let hex = colorHex(
      "rgb(" +
        parseInt(sR * i + startR) +
        "," +
        parseInt(sG * i + startG) +
        "," +
        parseInt(sB * i + startB) +
        ")"
    );
    colorArr.push(hex);
  }
  return colorArr;
}

/**
 * 获取数组最后一个元素
 * @param {array} array
 * @returns  元素
 */
export function last(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * 判断数组中是否含有某个元素
 * @param {*} valueOrFn
 * @param {array} array
 * @returns {boolean}
 */
export function oneOf(valueOrFn, array) {
  const that = this;
  return array.reduce((bool, item) => {
    let flag = false;
    if (typeof valueOrFn === "function") {
      flag = valueOrFn.call(that, item);
    } else if (item === valueOrFn) {
      flag = true;
    }
    return bool || flag;
  }, false);
}
