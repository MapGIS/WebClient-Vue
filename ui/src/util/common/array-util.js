import { _isNaN } from './common-util'

// 求取数组中非NaN数据中的最小值
// min([1, 2, '11', null, 'fdf', []]) ==> 1
export function min(arr) {
  arr = arr.filter(item => !_isNaN(item))
  return arr.length ? Math.min.apply(null, arr) : undefined
}

// 求取数组中非NaN数据中的最大值
// max([1, 2, '11', null, 'fdf', []]) ==> 11
export function max(arr) {
  arr = arr.filter(item => !_isNaN(item))
  return arr.length ? Math.max.apply(null, arr) : undefined
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  return Array.from(new Set(arr))
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function clean(arr) {
  const newArray = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      newArray.push(arr[i])
    }
  }
  return newArray
}
