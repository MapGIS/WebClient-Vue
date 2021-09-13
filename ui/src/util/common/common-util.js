const _toString = Object.prototype.toString

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = s => bw.includes(s)
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}

export function isTrue(v) {
  return v === true
}

export function isFalse(v) {
  return v === false
}

// 检测是不是除了 symbol 以外的原始数据
export function isStatic(v) {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'undefined' ||
    v === null
  )
}

// 检测数据是不是原始数据
export function isPrimitive(v) {
  return isStatic(v) || typeof v === 'symbol'
}

// 判断数据是不是数值类型的数据
export function isNumber(obj) {
  return obj === +obj
}

// 判断数据是不是字符串类型的数据
export function isString(obj) {
  return obj === `${obj}`
}

// 判断数据是不是布尔类型的数据
export function isBoolean(obj) {
  return obj === !!obj
}

// 判断数据是不是引用类型的数据 (例如： arrays, functions, objects, regexes, new Number(0),以及 new String(''))
export function isObject(v) {
  const type = typeof v
  return v !== null && (type == 'object' || type == 'function')
}

// 判断数据是否是 类对象。 如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"
export function isObjectLike(v) {
  return v != null && typeof v == 'object'
}

// 判断数据是不是Object类型的数据
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

// 判断数据是不是正式表达式类型的数据
export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

// 判断数据是不是函数
export function isFunction(v) {
  return _toString.call(v) === '[object Function]'
}

// 判断数据是不是数组类型的数据
export function isArray(v) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(v)
  }
  return _toString.call(v) === '[object Array]'
}

// 判断数据是否是类数组
export function isArrayLike(v) {
  return v != null && isValidArrayIndex(v.length) && !isFunction(v)
}

// 判断数据是不是时间对象
export function isDate(v) {
  return _toString.call(v) === '[object Date]'
}

// 判断数据是不是Promise类型的数据
export function isPromise(v) {
  return (
    isDef(v) && typeof v.then === 'function' && typeof v.catch === 'function'
  )
}

/**
 * 判断数据是不是有效的数组索引
 */
export function isValidArrayIndex(v) {
  const n = parseFloat(String(v))
  return n >= 0 && Math.floor(n) === n && isFinite(v)

  // 另一种实现方式
  // return (
  //   typeof v == 'number' && v > -1 && v % 1 == 0 && v <= Number.MAX_SAFE_INTEGER
  // )
}

// 判断数据是否为空
// 如果是null，直接返回true；如果是类数组，判断数据长度；
// 如果是Object对象，判断是否具有属性；
// 如果是其他数据，直接返回false(也可改为返回true)
export function isEmpty(v) {
  if (v == null) {
    return true
  }
  if (isArrayLike(v)) {
    return !v.length
  } else if (isPlainObject(v)) {
    for (const key in v) {
      if (Object.hasOwnProperty.call(v, key)) {
        return false
      }
    }
  }
  return false
}

// 检查数据是否是非数字值
export function _isNaN(v) {
  return !(typeof v === 'string' || typeof v === 'number') || isNaN(v)
}

// 获取数据类型，返回结果为 Number、String、Object、Array等
export function getRawType(v) {
  return _toString.call(v).slice(8, -1)
}

/**
 * Convert an input v to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber(v) {
  const n = parseFloat(v)
  return isNaN(n) ? v : n
}

/**
 * Convert an Array-like object to a real Array.
 */
export function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

// 返回一个lower - upper之间的随机数
// lower、upper无论正负与大小，但必须是非NaN的数据
// random(0, 0.5) ==> 0.3567039135734613
// random(2, 1) ===> 1.6718418553475423
// random(-2, -1) ==> -1.4474325452361945
export function random(lower, upper) {
  lower = +lower || 0
  upper = +upper || 0
  return Math.random() * (upper - lower) + lower
}

/**
 * 参数是否是其中之一
 * @param {*} value
 * @param {*} validList
 * @returns
 */
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @desc 函数防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 * @param immediate true - 立即执行， false - 延迟执行
 */
export function debounce(func, wait, immediate) {
  let timer
  return function() {
    const context = this
    const args = arguments

    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timer = setTimeout(() => {
        func.apply
      }, wait)
    }
  }
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
export function throttle(func, wait, type) {
  let previous = 0
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (type === 1) {
      const now = Date.now()

      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
