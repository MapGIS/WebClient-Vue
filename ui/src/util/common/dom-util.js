import { parseTime } from './time-util'

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += `${className}`
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ` ${cls}`
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = `${parseTime(new Date())}-${name}.${suffix}`
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function addFullScreenListener(listener) {
  document.addEventListener('fullscreenchange', listener)
  document.addEventListener('webkitfullscreenchange', listener)
  document.addEventListener('mozfullscreenchange', listener)
  document.addEventListener('msfullscreenchange', listener)
}

export function removeFullScreenListener(listener) {
  document.removeEventListener('fullscreenchange', listener)
  document.removeEventListener('webkitfullscreenchange', listener)
  document.removeEventListener('mozfullscreenchange', listener)
  document.removeEventListener('msfullscreenchange', listener)
}

export function inFullScreen(el) {
  if (el.requestFullscreen) {
    el.requestFullscreen()
    return true
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen()
    return true
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen()
    return true
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen()
    return true
  }
  return false
}

/**
 * 退出全屏
 */
export function outFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
