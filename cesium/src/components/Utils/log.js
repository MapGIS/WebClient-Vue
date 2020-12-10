/**
 * 输出正常信息到控制台。
 * @param  {...any} args
 */
export function log (...args) {
  console.log('[VUE_CESIUM]', ...args)
}
/**
 * 输出警告信息到控制台。
 * @param {*} msg
 * @param  {...any} args
 */
export function warn (msg, ...args) {
  console.warn(`[VUE_CESIUM] WARNING: ${msg}`, ...args)
}
/**
 * 输出错误信息到控制台。
 * @param {*} msg
 * @param  {...any} args
 */
export function error (msg, ...args) {
  console.error(`[VUE_CESIUM] ERROR: ${msg}`, ...args)
}
