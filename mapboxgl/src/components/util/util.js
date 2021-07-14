/**
 * 随机生成一个guid
 * @returns {string}
 */
export const newGuid = function() {
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
  const UuidStr = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // tslint:disable-next-line: no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line: no-bitwise
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
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
  const UuidStr = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
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
