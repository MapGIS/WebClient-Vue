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
