import API from './API'
// import axios from 'axios'
// import { getMapGISUrl, getMapgisToken, getMapgisPath } from '@/components/config/mapgis'
import { getMapGISUrl, getMapgisToken, getMapgisPath } from '../config/mapgis'

/**
 * 将云盘中矢量文件转换为空间数据库中矢量服务
 * @param {*} srcUrl 资源URL地址，只支持文件资源，且格式为wl、wp、wt、json、zip(shp)
 * @param {*} force 强制转换，不管之前是否转换过
 */
export function extract2vector (srcUrl, force) {
  const api = new API()
  const url = getMapGISUrl()
  const token = getMapgisToken()

  srcUrl = srcUrl === '' ? '-1' : srcUrl
  srcUrl = srcUrl || getMapgisPath()

  api.setBaseUrl(url)
  api.setAuthorization(token)
  api.setContentType('application/x-www-form-urlencoded')

  const data = {
    srcUrl: srcUrl,
    force: force
  }

  return api.post('/clouddisk/rest/tools/extract2vector?', data)
}

/**
 * 将云盘中瓦片文件转换为瓦片数据库中瓦片服务
 * @param {*} srcUrl 资源URL地址，只支持文件资源，且格式为wl、wp、wt、json、zip(shp)
 * @param {*} force 强制转换，不管之前是否转换过
 */
export function extract2tile (srcUrl, force) {
  const api = new API()
  const url = getMapGISUrl()
  const token = getMapgisToken()

  srcUrl = srcUrl === '' ? '-1' : srcUrl
  srcUrl = srcUrl || getMapgisPath()

  api.setBaseUrl(url)
  api.setAuthorization(token)
  api.setContentType('application/x-www-form-urlencoded')

  const data = {
    srcUrl: srcUrl,
    force: force
  }

  return api.post('/clouddisk/rest/tools/extract2tile?', data)
}

/**
 * 获取当前用户空间数据处理任务
 * @param {*} srcUrl 资源URL地址，只支持文件资源，且格式为wl、wp、wt、json、zip(shp)
 */
export function tilecut2raster (srcUrl) {
  const api = new API()
  const url = getMapGISUrl()
  const token = getMapgisToken()

  srcUrl = srcUrl === '' ? '-1' : srcUrl
  srcUrl = srcUrl || getMapgisPath()

  api.setBaseUrl(url)
  api.setAuthorization(token)
  api.setContentType('application/json')
  api.setTransformRequest(function (data) {
    const json = JSON.stringify(data)
    return json
  })

  const data = {
    'cutType': 'mkt',
    'cutInfo': {
      'startLevel': 6,
      'endLevel': 14
    }
  }

  return api.post(`/clouddisk/rest/tools/tasks/?srcUrl=${srcUrl}`, data)
}

/**
 * 获取当前用户空间数据处理任务
 * @param {string} srcUrl 资源URL地址，只支持文件资源，且格式为wl、wp、wt、json、zip(shp)
 * @param {string} taskID 任务id
 * @param {Number} beginTime 开始时间，单位：毫秒
 * @param {*} endTime 结束时间，单位：毫秒
 * @param {*} pageSize 页面大小
 * @param {*} pageNo 页面编号
 */
export function task (srcUrl, taskID, beginTime, endTime, pageSize, pageNum) {
  const api = new API()
  const url = getMapGISUrl()
  const token = getMapgisToken()

  srcUrl = srcUrl === '' ? undefined : srcUrl

  api.setBaseUrl(url)
  api.setAuthorization(token)

  const data = {
    srcUrl,
    taskID,
    beginTime,
    endTime,
    pageSize,
    pageNum
  }

  return api.get('/clouddisk/rest/tools/tasks', data)
}

export function deleteTaskInfo (taskID) {
  const api = new API()
  const url = getMapGISUrl()
  const token = getMapgisToken()

  api.setBaseUrl(url)
  api.setAuthorization(token)
  return api.delete('/clouddisk/rest/tools/tasks?taskID=' + taskID)
}

/**
 * 返回WMTS格式的栅格瓦片服务
 * @param {*} storeServiceUrl datastore基地址
 * @param {*} tileDataPath /库名/图层名
 */
export function getTileUrl (storeServiceUrl, tileDataPath) {
  let url = `${storeServiceUrl}/mongo${tileDataPath}/WMTS?TileMatrix={z}&TileCol={x}&TileRow={y}`
  return url
}

// 返回栅格瓦片预览地址
export function getNewTileUrl (storeServiceUrl, tileDataPath, dataSource, epsg) {
  let url = storeServiceUrl + '/mongo/rasterService?cacheurl=' + tileDataPath + '&dataseturl=' + dataSource + '&epsg=' + epsg + '&TileMatrix={z}&TileCol={x}&TileRow={y}'
  return url
}

// 返回单个tiff文件预览地址
export function getTiffUrl (storeServiceUrl, tiffDataPath, epsg) {
  let url = storeServiceUrl + '/mongo/rasterService_realTime?hdfsurl=' + tiffDataPath + '&epsg=' + epsg + '&TileMatrix={z}&TileCol={x}&TileRow={y}'
  return url
}

// 返回单个tiff文件获取元数据的服务地址
export function getTiffMetaUrl (storeServiceUrl, tiffDataPath, width, height) {
  let url = storeServiceUrl + '/mongo/tifMetaInfo?hdfsurl=' + tiffDataPath + '&&width=' + width + '&&height=' + height
  return url
}

// 返回单个tiff文件的元数据信息
export function getTiffMetadata (tiffMetaUrl) {
  const api = new API()
  return api.get(tiffMetaUrl)
}

// 返回实时矢量瓦片预览地址
export function getVectorTileUrl (storeServiceUrl, dataSoureType, dataSource, tolerance, filter) {
  let dataSoureType1 = 'pg'
  if (dataSoureType && dataSoureType !== 'DBPG') {
    dataSoureType1 = dataSoureType
  }
  let list = dataSource.split('/')
  // console.warn(list)
  // let libName = list[3]
  let srvName = list[list.length - 1]
  let url1 = storeServiceUrl + '/pgsql/vectortileservice_test?dataSoureType=' + dataSoureType1 + '&&dataUrl=' + dataSource + '&keepField='
  let url2 = '&&TileMatrix={z}&&TileCol={x}&&TileRow={y}&tolerance=' + tolerance + '&filter=' + filter
  return [srvName, url1, url2]
}

// 返回缓存矢量瓦片预览地址
export function getCacheVectorTileUrl (storeServiceUrl, dataSoureType, dataSource, epsg, tolerance, filter, tileDataPath, minLevel, maxLevel) {
  let url1
  let list = dataSource.split('/')
  let srvName = list[list.length - 1]

  let dataSoureType1 = 'pg'
  if (dataSoureType && dataSoureType !== 'DBPG') {
    dataSoureType1 = dataSoureType
  }

  if (tileDataPath && minLevel && maxLevel) {
    let mongoUrl = tileDataPath.split('/')
    let cachePath = mongoUrl[3] + '/' + mongoUrl[4]
    url1 = getMapGISUrl() + '/clouddisk/rest/tools/vector/tile?minLevel=' + minLevel + '&maxLevel=' + maxLevel + '&cachePath=' + cachePath + '&dataSoureType=' + dataSoureType1 + '&&dataUrl=' + dataSource + '&epsg=' + epsg + '&keepField='
  } else {
    url1 = getMapGISUrl() + '/clouddisk/rest/tools/vector/tile?dataSoureType=' + dataSoureType1 + '&&dataUrl=' + dataSource + '&epsg=' + epsg + '&keepField='
  }
  let url2 = '&&TileMatrix={z}&&TileCol={x}&&TileRow={y}&tolerance=' + tolerance + '&filter=' + filter
  return [srvName, url1, url2]
}

/**
 * 返回geojson格式的矢量要素服务
 * @param {*} storeServiceUrl datastore基地址
 * @param {*} vclsDataPath 矢量要素名 /库名/空间名/图层名
 * @param {*} pageSize 返回的图元数量限制
 */
export function getVectorUrl (storeServiceUrl, vclsDataPath, pageSize) {
  let url = `${storeServiceUrl}/datastore/rest/dataset/pg/query${vclsDataPath}`
  if (pageSize) {
    url += `?pageSize=${pageSize}&sref=epsg:4326&includeProperties=true`
  } else {
    url += '?sref=epsg:4326&includeProperties=true'
  }
  return url
}

// 新接口用于空间数据查询地理数据
export function getNewVectorUrl (gdbp, includeProperites, epsg, pageSize) {
  let url = getMapGISUrl() + '/giscore/dataconvert/rest/geodataset/query?epsg=' + epsg + '&gdbp=' + gdbp + '&includeProperites=' + includeProperites + '&pageSize=' + pageSize
  return url
}

//
export function cutTileTask (tileCutForm) {
  const api = new API()
  const url = getMapGISUrl()
  const token = getMapgisToken()

  api.setBaseUrl(url)
  api.setAuthorization(token)
  api.setContentType('application/x-www-form-urlencoded')

  let srcUrl = tileCutForm.dataseturl
  let minLevel = tileCutForm.startLevel
  let maxLevel = tileCutForm.endLevel
  let keepTp = tileCutForm.keepTp

  if (minLevel && maxLevel && minLevel !== '' && maxLevel !== '') {
    return api.post('/clouddisk/rest/tools/vector/tile/cut?srcUrl=' + srcUrl + '&keepTp=' + keepTp + '&minLevel=' + minLevel + '&maxLevel=' + maxLevel)
  } else {
    return api.post('/clouddisk/rest/tools/vector/tile/cut?srcUrl=' + srcUrl + '&keepTp=' + keepTp)
  }
}
