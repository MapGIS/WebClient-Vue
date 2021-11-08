/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = `${+new Date()}`
  const randomNum = `${parseInt((1 + Math.random()) * 65536)}`
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
 * 判断一个字符串是否为数字字符串
 * @param str
 * @returns {boolean}
 */
export function isNumeric(str) {
  const regPos = /^\d+(\.\d+)?$/ // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
  if (regPos.test(str) || regNeg.test(str)) {
    if (str.length > 1 && str.substr(0, 1) === '0') {
      // 如果是0开始的长度大于1的字符串则认为是字符串
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

// 记忆函数：缓存函数的运算结果（这里只适用于参数为字符串类型）
function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

// 横线转驼峰命名
// ab-cd-ef ==> abCdEf
const camelizeRE = /-(\w)/g
function _camelize(str) {
  return str.replace(camelizeRE, function(_, c) {
    return c ? c.toUpperCase() : ''
  })
}
// 使用记忆函数
export const camelize = cached(_camelize)

// 驼峰命名转横线命名：拆分字符串，使用 - 相连，并且转换为小写
// abCd ==> ab-cd
const hyphenateRE = /\B([A-Z])/g
function _hyphenate(str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}
// 使用记忆函数
export const hyphenate = cached(_hyphenate)

// 字符串首位大写
// abc ==> Abc
function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
// 使用记忆函数
export const capitalize = cached(_capitalize)
