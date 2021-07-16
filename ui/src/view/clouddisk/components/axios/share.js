import API from './API'
import { getMapGISUrl, getMapgisToken } from '../config/mapgis'

/**
 * 获取当前用户分享列表或者别人分享给自己的资源列表
 * @param {*} srcUrl 资源URL地址
 * @param {*} isFolder 是否是文件夹，默认为false
 * @param {*} shareUrl 公共分享地址
 * @param {*} shareIDs 分享信息ID列表，用逗号分割
 * @param {*} isValid 分享是否有效，默认全部取出，可取值true(有效)、false(失效)
 * @param {*} includeVisitUsers 获取我的分享资源时是否包含自定义用户，默认为true，当取分享给我的信息时，该参数失效
 * @param {*} isShareToMe 是否是获取分享给我的资源，默认为false
 */
export function shareFile (srcUrl, share) {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  const data = {
    shareEndTime: share.shareEndTime,
    open: share.open,
    allInnerUser: share.allInnerUser,
    users: share.users,
    userGroups: share.userGroups,
    innerUserRole: share.innerUserRole
  }

  api.setBaseUrl(url)
  api.setAuthorization(token)
  // api.setContentType('application/x-www-form-urlencoded')
  api.setContentType('application/json')
  api.setTransformRequest(function (data) {
    const json = JSON.stringify(data)
    return json
  })

  return api.post(url + '/clouddisk/rest/file/share?srcUrl=' + srcUrl.srcUrl + '&isFolder=' + srcUrl.isFolder, data)
}

/**
 * 获取当前用户分享列表或者别人分享给自己的资源列表
 * @param {*} isShareToMe 是否是获取分享给我的资源，默认为false
 * @param {*} isInnerPublic 是否为公共数据
 * @param {*} srcUrl 地址
 */
export function getShareList (isShareToMe, isInnerPublic, srcUrl) {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  api.setBaseUrl(url)
  api.setAuthorization(token)
  if (isShareToMe === isInnerPublic) {
    if (srcUrl) {
      return api.get('/clouddisk/rest/file/share?isShareToMe=' + isShareToMe + '&srcUrl=' + srcUrl.srcUrl + '&isFolder=' + srcUrl.isFolder)
    } else {
      return api.get('/clouddisk/rest/file/share?isShareToMe=' + isShareToMe)
    }
  } else {
    if (srcUrl) {
      return api.get('/clouddisk/rest/file/share?isShareToMe=' + isShareToMe + '&isInnerPublic=' + isInnerPublic + '&srcUrl=' + srcUrl.srcUrl + '&isFolder=' + srcUrl.isFolder)
    } else {
      return api.get('/clouddisk/rest/file/share?isShareToMe=' + isShareToMe + '&isInnerPublic=' + isInnerPublic)
    }
  }
}

/**
 * 获取用户列表
 * @param {*} ids 用户id列表
 * @param {*} keywords 关键字
 * @param {*} pageNum 页码，从1开始
 * @param {*} pageSize 每页条数，默认为10
 */
export function getUserList (keyword) {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  api.setBaseUrl(url)
  api.setAuthorization(token)
  if (!keyword) {
    return api.get('/clouddisk/rest/users?')
  } else {
    return api.get('/clouddisk/rest/users?keywords=' + keyword)
  }
}

/**
 * 获取分享操作角色列表
 */
export function getRoleList () {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  api.setBaseUrl(url)
  api.setAuthorization(token)
  return api.get('/clouddisk/rest/file/share/roles?')
}

/**
 * 获取分享地址或随机密码
 * @param {*} srcUrl 空间根地址，获取组织分享文件时使用
 * @param {*} isFolder 是否是文件夹，默认为false
 */
export function getShareAddress (srcUrl, isFolder) {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  api.setBaseUrl(url)
  api.setAuthorization(token)
  return api.get('/clouddisk/rest/file/share/autogenerate?srcUrl=' + srcUrl + '&isFolder=' + isFolder)
}

/**
 * 删除分享信息
 * @param {*} shareID 分享信息ID
 */
export function deleteShareFile (shareID) {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  api.setBaseUrl(url)
  api.setAuthorization(token)
  api.setContentType('application/x-www-form-urlencoded')
  return api.delete('/clouddisk/rest/file/share?shareID=' + shareID)
}

/**
 * 获取角色的权限信息
 * @param {*} roleid roleid
 */
export function getRolePermissionInfo (roleid) {
  const url = getMapGISUrl()
  const api = new API()
  const token = getMapgisToken()
  api.setBaseUrl(url)
  api.setAuthorization(token)
  return api.get('/clouddisk/rest/permission?roleId=' + roleid)
}
