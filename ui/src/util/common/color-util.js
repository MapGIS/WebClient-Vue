export function isHex(color) {
  return color.length >= 4 && color[0] == '#'
}

export function isRgb(color) {
  return color.length >= 10 && color.slice(0, 3) == 'rgb'
}

export function isRgba(color) {
  return color.length >= 13 && color.slice(0, 4) == 'rgba'
}

/**
 * 获取颜色的r g b a,支持#16进制模式和rgb字符串模式
 * @param color
 * @param opacity
 * @returns {{a: number, r: number, b: number, g: number}}
 */
export function getColorObject(color, opacity) {
  let tempColor = color
  if (color.indexOf('rgb') === -1) {
    tempColor = this.hexToRgba(color, opacity)
  }
  const strs = tempColor.split(',')
  const r = Number(strs[0].split('(')[1])
  const g = Number(strs[1])
  let b = 0
  let a = 1
  if (strs.length > 3) {
    b = Number(strs[2])
    a = Number(strs[3].split(')')[0])
  } else if (strs.length == 3) {
    b = Number(strs[2].split(')')[0])
  }
  return {
    r,
    g,
    b,
    a
  }
}

/**
 *
 * @param color 16进制颜色转rgba
 */
export function hexToRgba(color, opacity) {
  if (opacity === undefined) {
    opacity = 1
  }
  let sColor = color.toLowerCase()
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`))
    }
    return `rgba(${sColorChange.join(',')},${opacity})`
  }
  return sColor
}

/**
 *
 * @param color rgb转16进制
 */
export function rgbToHex(color) {
  if (!color.includes('rgb')) {
    return color
  }
  const colorStr = color.split('(')[1].split(')')[0]
  const arr = colorStr.split(',')
  const r = parseInt(arr[0])
  const g = parseInt(arr[1])
  const b = parseInt(arr[2])
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  return hex.toLocaleUpperCase()
}

/**
 * rgba转16进制
 * @param color rgba
 * @param disableAlpha 禁用透明度
 */
export function rgbaToHex(color, disableAlpha) {
  if (!color.includes('rgb')) {
    return color
  }
  if (!color.includes('a') || disableAlpha) {
    // 如果是rgb或者rgba
    return this.rgbToHex(color)
  }
  const colorStr = color.split('(')[1].split(')')[0]
  const arr = colorStr.split(',')
  const a = Number(arr[3] ? arr[3] : 1)
  // 十六进制透明度枚举
  const alpha = new Map()
  alpha.set('00', 0)
  alpha.set('0C', 0.05)
  alpha.set('19', 0.1)
  alpha.set('26', 0.15)
  alpha.set('33', 0.2)
  alpha.set('3F', 0.25)
  alpha.set('4C', 0.3)
  alpha.set('59', 0.35)
  alpha.set('66', 0.4)
  alpha.set('72', 0.45)
  alpha.set('7F', 0.5)
  alpha.set('8C', 0.55)
  alpha.set('99', 0.6)
  alpha.set('A5', 0.65)
  alpha.set('B2', 0.7)
  alpha.set('BF', 0.75)
  alpha.set('CC', 0.8)
  alpha.set('D8', 0.85)
  alpha.set('E5', 0.9)
  alpha.set('F2', 0.95)
  alpha.set('FF', 1)
  let alphaHex = 'FF'
  for (const item of alpha) {
    if (item[1] == a) {
      alphaHex = item[0]
      break
    }
  }
  const rgbHex = this.rgbToHex(color)
  return `${rgbHex}${alphaHex}`
}

/**
 * rgba转字符串
 * @param rgba rgba对象
 * @param disableAlpha 禁用透明度
 */
export function colorObjectToRgba(rgba, disableAlpha) {
  let colorStr = ''
  if (rgba.a !== undefined) {
    colorStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
    // 已传入disableAlpha，并且为true
    if (disableAlpha) {
      colorStr = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
    }
  } else {
    colorStr = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
  }
  return colorStr
}
