import { func } from 'assert-plus'
import url from 'url'

export function getQueryParams(urlString) {
  const query = url.parse(urlString, true).query

  if (query) {
    return query
  }

  return {}
}

export function getQueryPath(urlString) {
  const urlObject = url.parse(urlString)

  return `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`
}

export function isUrlValid(urlString) {
  const urlMatch = /^https?:\/\//

  return urlMatch.test(urlString)
}

/**
 * @description 根据ip和port获取orgin
 * @param {*} options.ip ip支持域名
 * @param {*} options.port
 * @param {*} options.protocol
 * @returns
 */
export function getOrigin({ ip, port, protocol }) {
  const tempProtocol = protocol || window.location.protocol;
  let tempOrigin = `${tempProtocol}//${ip}`;
  if (port && port !== "") {
    tempOrigin += `:${port}`;
  }
  return tempOrigin;
}