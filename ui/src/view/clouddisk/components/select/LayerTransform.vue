<template>
  <div>
  </div>
</template>
<script>

import axios from 'axios'
import {
  getGeoMetadata,
  saveJsonFile,
  getFileDownloadUrlWithAuth
} from '../../axios/files.js'
import {
  getNewVectorUrl,
  getCacheVectorTileUrl,
  getTiffUrl,
  getTiffMetaUrl,
  getNewTileUrl
} from '../../axios/gis'
import { FileType } from '../../util/fileType'
import { getMapgisPath, getMapGISUrl } from '../../config/mapgis'


import { IDocument, Layer, Doc } from '@mapgis/webclient-store' // 这些项在线制图应该也已经添加了依赖，demo界面通过npm link连接
const { GeoJsonLayer, RasterTileLayer, VectorTileLayer } = Layer
const { defaultDocument } = Doc


export default {
  name: "mapgis-ui-clouddisk-transform",
  data() {
    return {
      GjsonSize: window.localStorage.getItem('mapgis_clouddisk_GjsonSize') || 1000,
      vectorTileSize: window.localStorage.getItem('mapgis_clouddisk_vectorTileSize') || 500000,
      onlyOneField: window.localStorage.getItem('mapgis_clouddisk_onlyOneField') || false,
      mapstudioUrlMark: window.localStorage.getItem('mapgis_clouddisk_mapstudioUrlMark') || '/mapstudioweb/#/?share=',
      filterPGFields: ["mpLayer", "mpLength", "mpArea", "mpPerimeter", "mpgmod_time"],
      cdToken: window.localStorage.getItem('mapgis_clouddisk_token') || '',
    };
  },
  props: {
    selectLists: {
      type: Array,
      default: []
    },
    selectStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentDocument: {
      type: Object,
      default: () => {
        return {};
      }
    },
    handleNewDocument: Function
  },
  mounted() {},
  watch: {
    // selectLists(next) {
    //   console.warn('监听到变化', next)
    // }
  },
  methods: {
    openStyle () {
      // console.warn('看是否传过来模板（1个）：', this.selectsInfo)
      if (this.selectStyle) {
        if (this.selectStyle.isfolder === true) {
          this.$notification.error({ message: '不可选择文件夹！', description: '请选择专题图模板文件' })
          // this.loadingModal = false
          // this.$nextTick(() => {
          //   this.loadingModal = true
          // })
        } else {
          // console.warn('看是否关闭：', this.selectsInfo)
          let downloadFileUrl = getFileDownloadUrlWithAuth(this.selectStyle.url, false)
          axios.get(downloadFileUrl)
            .then(res => {
              if (res.status === 200) {
                let result = res.data
                let { errorCode, msg } = result
                if (errorCode < 0) {
                  this.$notification.error({ message: errorCode, description: msg })
                  // this.loadingModal = false
                  // this.$nextTick(() => {
                  //   this.loadingModal = true
                  // })
                } else {
                  // console.warn('下载结果：', result)
                  let payload = {
                    document: result
                  }
                  this.handleNewDocument(payload) // 将新生成的template传给在线制图
                  // this.handleClose()
                }
              }
            })
            .catch(error => {
              this.$notification.error({ message: '网络异常,请检查链接', description: error })
              // this.loadingModal = false
              // this.$nextTick(() => {
              //   this.loadingModal = true
              // })
            })
        }
      } else {
        // this.handleClose()
      }
    },
    addLayer () {
      console.warn('准备添加图层', this.selectLists, this.currentDocument)
      // let payload = {
      //   document: this.selectLists
      // }
      // this.handleNewDocument(payload) // 将新生成的doc传给在线制图
      let layers = []
      if (this.selectLists.length <= 0) return
      for (let i = 0; i < this.selectLists.length; i++) {
        let layer = this.selectLists[i]
        let { xattrs, type, title, url } = layer
        if (!xattrs) {
          this.$notification.error({ message: "当前选择的某个图层缺少图层信息", description: '请检查所选图层是否导入！' })
          continue
        }
        let {
          hasVector,
          dataSource,
          dataSourceType,
          storeServiceUrl,
          vclsinfo,
          tileDataPath,
          minLevel,
          maxLevel
        } = xattrs
        let path
        // let uuid = md5(url)
        let uuid = title
        let subtype
        let sourceLayer // 矢量瓦片必填
        let path1 // 矢量瓦片url的前半部分
        let path2 // 矢量瓦片url的后半部分
        if (vclsinfo) {
          subtype = vclsinfo.geomType
          if (vclsinfo.count <= 0) {
            this.$notification.error({ message: '当前选择的某个图层要素数为0', description: '请检查图层！' })
            continue
          }
        }
        if (!storeServiceUrl) {
          this.$notification.error({ message: '当前选择的某个图层缺少图层信息', description: '请检查图层！' })
          continue
        }
        if (vclsinfo && vclsinfo.count > this.GjsonSize) { // 实时矢量瓦片
          if (hasVector && dataSource) {
            let temp = []
            temp = getCacheVectorTileUrl(storeServiceUrl, dataSourceType, dataSource, 4326, 0.5, 0.5, tileDataPath, minLevel, maxLevel)
            // if (vclsinfo.count < this.vectorTileSize) {
            //   temp = getCacheVectorTileUrl(storeServiceUrl, dataSourceType, dataSource, 4326, 0.5, 0.5, tileDataPath, minLevel, maxLevel)
            // } else {
            //   temp = getCacheVectorTileUrl(storeServiceUrl, dataSourceType, dataSource, 4326, 0.2, 0.2, tileDataPath, minLevel, maxLevel)
            // }
            // let temp = getVectorTileUrl(storeServiceUrl, dataSourceType, dataSource, 0.2, 0.2)
            sourceLayer = temp[0] // 图层在数据库中的表名
            path1 = temp[1] // 矢量瓦片url的前半部分
            path2 = temp[2] // 矢量瓦片url的后半部分
            // 这里写一个定值
            // sourceLayer = '地类图斑_mkt'
            // path = 'http://192.168.96.101:9091/pgsql/vectortileservice_test?dataSoureType=pg&&dataUrl=gdbp://profind@192.168.96.10130001profind/profind/sfcls/地类图斑_mkt&&keepField=地类名称&&TileMatrix={z}&&TileCol={x}&&TileRow={y}'
          }
          layers.push({ name: title, path1: path1, path2: path2, type: type, uuid: uuid, subtype: subtype, isVectorTile: true, sourceLayer: sourceLayer, dataSource: dataSource })
        } else { // GeoJSON
          let metaPath = null
          if (hasVector && dataSource) { // 每个图层都有各自的边界、中心点
            path = getNewVectorUrl(dataSource, true, 4326, this.GjsonSize) + `&Authorization=${this.cdToken}`
          } else if (!hasVector && tileDataPath) { // 镶嵌数据集
            // path = getTileUrl(storeServiceUrl, tileDataPath)
            if (layer.type === FileType.TIF || layer.type === FileType.TIFF) {
              path = getTiffUrl(storeServiceUrl, tileDataPath, 4326) + `&Authorization=${this.cdToken}`
              metaPath = getTiffMetaUrl(storeServiceUrl, tileDataPath, 0, 0) + `&Authorization=${this.cdToken}`
            } else {
              path = getNewTileUrl(storeServiceUrl, tileDataPath, dataSource, 3857) + `&Authorization=${this.cdToken}`
            }
          } else {
            this.$notification.error({ message: '当前选择的某个图层缺少图层信息', description: '请检查所选图层是否导入！' })
            continue
          }
          layers.push({ name: title, path: path, type: type, uuid: uuid, subtype: subtype, cdUrl: url, dataSource: dataSource, metaPath: metaPath })
        }
      }

      let promiseFuns = []
      layers.forEach(item => {
        let promiseFunction
        if (item.type !== FileType.MOSA && item.type !== FileType.TIF && item.type !== FileType.TIFF) {
          promiseFunction = this.getGisMetadata(item)
        } else {
          promiseFunction = this.getTiffMetadata(item)
        }
        promiseFuns.push(promiseFunction)
      })
      Promise.all(promiseFuns)
        .then(res => {
          // console.warn('多接口返回结果', res)
          this.openPreviewLayers(res)
        })
        .catch(err => {
          console.warn('错误', err)
          if (err.message) {
            this.$notification.error(err)
          } else {
            this.$notification.error({ message: '前端解析出现错误', description: err })
          }
          // self.$store.commit('CHANGE_FILES_LOADING', { loading: false })
        })
    },
    openPreviewLayers (layers) {
      let doc
      doc = this.paraDocument(layers)
      // console.warn('看doc', doc)
      let payload = {
        document: doc
      }
      this.handleNewDocument(payload) // 将新生成的doc传给在线制图
      // this.handleClose()
      let folderDir = getMapgisPath() + '/工作目录/工程文件Cache'
      let fileName = doc.layers[0].name + '_自动创建.style'
      let srcUrl = folderDir + '/' + fileName
      let fileAttribute = JSON.stringify(this.getFileAttr(doc, srcUrl))
      fileAttribute = encodeURIComponent(fileAttribute)
      // console.warn('路径', folderDir, fileName)
      saveJsonFile(folderDir, fileName, fileAttribute, doc)
        .then(res => {
          if (res.status === 200) {
            let result = res.data
            let { errorCode, msg } = result
            if (errorCode < 0) {
              this.$notification.error({ message: errorCode, description: msg })
            } else {
              console.warn('【新工程已保存回云盘】')
              // let baseProjectUrl = getFileDownloadUrlWithAuth(srcUrl, false)
              // let projectUrl = Buffer.from(baseProjectUrl, 'utf-8').toString('base64') // 编码方式
              // projectUrl = encodeURIComponent(projectUrl)
              // // console.warn('base64编码前后', baseProjectUrl, projectUrl)
              // let studioUrl = window.localStorage.getItem('mapgis_studio_url') + '/mapstudioweb/#/?share=' + projectUrl
              // console.warn('【添加图层后的地址】', studioUrl)
              // console.warn('跳转地址', studioUrl)
              // window.open(studioUrl)
              // window.open(studioUrl, '_self')
            }
          }
        })
        .catch(error => {
          this.$notification.error({ message: '网络异常,请检查链接', description: error })
        })
    },
    paraDocument (layers) {
      let currentLayers = this.currentDocument.layers
      let doc = IDocument.deepclone(this.currentDocument)
      layers.forEach(l => {
        let flag = false
        flag = this.checkDuplication(l.uuid)
        if (!flag) {
          let layer
          if (l.type === '.mosa' || l.type === '.tif') {
            layer = new RasterTileLayer(l.name)
            layer.subtype = 'Raster'
            layer.name = l.name
            layer.title = l.name
            layer.gdbp = l.dataSource || '' // 这里以及下面的gdbp很重要，用于在线制图判定该图层是否来自云盘，后期建议改为专门加一个标识记录该图层来自云盘
            layer.tileUrl = l.path
            layer.url = l.path
            layer.key = l.uuid
            layer.id = l.uuid
            doc.addLayerInGroup(layer)
          } else if (l.isVectorTile) {
            layer = new VectorTileLayer(l.name)
            layer.name = l.name
            layer.title = l.name
            layer.gdbp = l.dataSource
            layer.type = 'VectorTile'
            layer.key = l.uuid
            layer.id = l.uuid
            layer.url = l.path
            layer.source = l.uuid
            layer.sourceLayer = l.sourceLayer
            layer.minZoom = this.previewZoom.minZoom
            layer.maxZoom = this.previewZoom.maxZoom
            switch (l.subtype) {
              case 1:
                layer.subtype = 'Circle'
                break
              case 2:
                layer.subtype = 'Line'
                break
              case 3:
                layer.subtype = 'Fill'
                layer.style = {
                  'fill-color': '#1890FF',
                  // 'fill-outline-color': '#FFFFFF'
                  'fill-outline-color': { 'stops': [[0, 'rgba(0,0,0,0)'], [20, '#ffffff']] }
                }
                break
            }
            doc.addLayerInGroup(layer)
          } else {
            layer = new GeoJsonLayer(l.name)
            layer.title = l.name
            layer.gdbp = l.dataSource
            layer.url = l.path
            layer.key = l.uuid
            layer.id = l.uuid
            layer.cdUrl = l.cdUrl
            switch (l.subtype) {
              case 1:
                layer.subtype = 'Circle'
                break
              case 2:
                layer.subtype = 'Line'
                break
              case 3:
                layer.subtype = 'Fill'
                layer.style = {
                  'fill-color': '#1890FF',
                  // 'fill-outline-color': '#FFFFFF'
                  'fill-outline-color': { 'stops': [[0, 'rgba(0,0,0,0)'], [20, '#ffffff']] }
                }
                break
            }
            doc.addLayerInGroup(layer)
          }
        }
      })
      // if (currentLayers.length <= 0) {
      doc.maxBounds = layers[0].maxBounds
      doc.current = {
        id: doc.layers[0].id,
        name: doc.layers[0].name,
        type: doc.layers[0].type
      }
      doc.center = layers[0].center
      // doc.sprite = this.http + '://' + this.ip + ':' + this.socket + '/static/sprites/sprite-mapbox'
      // doc.glyphs = this.http + '://' + this.ip + ':' + this.socket + '/static/font/{fontstack}/{range}.pbf'
      if (layers[0].type !== '.mosa') {
        doc.crs = {
          'epsg': 'EPSG_4326',
          'proj': '+proj=longlat +datum=WGS84 +no_defs'
        }
      }
      // }
      return doc
    },
    getGisMetadata (item) {
      return new Promise((resolve, reject) => {
        let gdbp = item.dataSource
        getGeoMetadata(gdbp, 4326)
          .then(res => {
            if (res.status === 200) {
              let result = res.data
              let { data, errorCode, msg } = result[0]
              if (errorCode < 0) {
                let errorText = { message: errorCode, description: msg }
                reject(errorText)
              } else {
                let fields = data.schema.fields
                let keepField = ''
                fields = fields.filter(item => {
                  return !this.checkFields(item)
                })
                fields.forEach(ele => {
                  keepField += ele.name + ','
                })
                keepField = keepField.slice(0, -1) // 全部属性字段，这两个二选一
                if (item.isVectorTile) {
                  keepField = this.onlyOneField ? fields[0].name : keepField // 只取所有属性字段的第一个，这两个二选一
                  item.path = item.path1 + keepField + item.path2 + `&Authorization=${this.cdToken}`
                } else { // geojson取全部字段
                  item.path = item.path + '&fields=' + keepField + `&Authorization=${this.cdToken}`
                }

                // if (j === 0) {
                let newXmin = data.geometry.spatialAttr.xmin
                let newYmin = data.geometry.spatialAttr.ymin
                let newXmax = data.geometry.spatialAttr.xmax
                let newYmax = data.geometry.spatialAttr.ymax
                let newX = (newXmax + newXmin) / 2
                let newY = (newYmax + newYmin) / 2
                item.center = [newX, newY]
                item.maxBounds = {
                  'west': newXmin,
                  'south': newYmin,
                  'east': newXmax,
                  'north': newYmax
                }
                resolve(item)
                // layers[0].maxBounds = {
                //   'west': -180,
                //   'south': -90,
                //   'east': 180,
                //   'north': 90
                // }
                // }
                // console.warn('layers', styleSaveUrl, layers)
                // this.openPreviewLayers(styleSaveUrl, layers)
              }
            }
          })
          .catch(error => {
            let errorText = { message: '网络异常,请检查链接', description: error }
            reject(errorText)
          })
      })
    },
    getTiffMetadata (item) { // 该方法只是将原layer返回，后面若需要加tiff或镶嵌数据集的图层范围等信息可写在此处
      return new Promise((resolve, reject) => {
        resolve(item)
      })
    },
    checkFields (item) {
      let flag = false
      if (this.filterPGFields.length > 0) {
        this.filterPGFields.forEach(field => {
          if (field.toLowerCase() === item.name.toLowerCase()) {
            flag = true
          }
        })
      }
      return flag
    },
    checkDuplication (uuid) {
      let flag = false
      if (this.currentDocument.layers.length > 0) {
        this.currentDocument.layers.forEach(item => {
          if (item.key === uuid) flag = true
        })
      }
      return flag
    },
    getFileAttr (doc, url) {
      let fileAttr = {}
      fileAttr.baseUrl = getMapGISUrl()
      fileAttr.preview = this.getEncodePreviewUrl(url)
      fileAttr.crs = doc.crs.epsg || 'EPSG_4326'
      fileAttr.xmin = doc.maxBounds.west || -180
      fileAttr.xmax = doc.maxBounds.east || 180
      fileAttr.ymin = doc.maxBounds.south || -90
      fileAttr.ymax = doc.maxBounds.north || 90
      // fileAttr.center = doc.center || [0, 0]
      return fileAttr
    },
    getEncodePreviewUrl (url) {
      let result
      let baseProjectUrl = getFileDownloadUrlWithAuth(url, false)
      let projectUrl = Buffer.from(baseProjectUrl, 'utf-8').toString('base64') // 编码方式
      projectUrl = encodeURIComponent(projectUrl)
      result = this.mapstudioUrlMark + projectUrl
      return result
    }
  }
};
</script>

<style scoped>
</style>
