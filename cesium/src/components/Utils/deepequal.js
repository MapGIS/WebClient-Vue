/**
 * @description 两个对象深比较
 */
export function deepEqual(a, b) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeof a === "object" && a !== null && b !== null) {
    if (!(typeof b === "object")) {
      return false;
    }
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false;
    }
    for (const key in a) {
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}

function getType(obj) {
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    return "Object";
  } else if (Object.prototype.toString.call(obj) === "[object Array]") {
    return "Array";
  } else {
    return "nomal";
  }
}

export function deepCopy(obj) {
  if (getType(obj) === "nomal") {
    return obj;
  } else {
    // tslint:disable-next-line: prefer-const
    let newObj = getType(obj) === "Object" ? {} : [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepCopy(obj[key]);
      }
    }
    return newObj;
  }
}

export default deepEqual;
