<template>
  <div class="mapgis-ui-portal-serviceresource">
    <mapgis-ui-row style="margin-bottom:24px;">
      <mapgis-ui-col :span="4">
        <span style="float:right;line-height:32px;">服务类型：</span>
      </mapgis-ui-col>
      <mapgis-ui-col :span="20">
        <mapgis-ui-select v-model="serviceForm.serverType" style="width: 100%" @change="handleTypeChange">
          <!-- <mapgis-ui-select-option
            v-for="(t, i) in serviceTypes"
            :key="i"
            :value="t.value"
          >
            {{ t.title }}
          </mapgis-ui-select-option> -->
          <mapgis-ui-select-opt-group>
            <span slot="label">MapGIS REST服务</span>
            <mapgis-ui-select-option value="2">
              动态裁图
            </mapgis-ui-select-option>
            <!-- <mapgis-ui-select-option value="3">
              二维文档服务
            </mapgis-ui-select-option> -->
            <mapgis-ui-select-option value="5">
              瓦片服务
            </mapgis-ui-select-option>
          </mapgis-ui-select-opt-group>
          <mapgis-ui-select-opt-group>
            <span slot="label">其他服务</span>
            <!-- <mapgis-ui-select-option value="8">
              WMS服务
            </mapgis-ui-select-option> -->
            <mapgis-ui-select-option value="10">
              WMTS服务
            </mapgis-ui-select-option>
          </mapgis-ui-select-opt-group>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row style="margin-bttom:24px;">
      <mapgis-ui-col :span="4">
        <span style="float:right;line-height:32px;">服务名称：</span>
      </mapgis-ui-col>
      <mapgis-ui-col :span="20">
        <mapgis-ui-select v-model="serviceForm.serverName" style="width: 100%">
          <mapgis-ui-select-option
            v-for="(t, i) in serviceModels"
            :key="i"
            :value="t.name"
          >
            {{ t.name }}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
import axios from 'axios'

// import { Extend } from '@mapgis/webclient-es6-service'
import { RuleParse } from '../../RuleParas'
import { IDocument, Layer, Doc } from '@mapgis/webclient-store'
import { getPortalServices } from "../../../clouddisk/axios/portal";
import { getPortalUrl } from "../../../clouddisk/config/mapgis";

// const { RuleParse } = Extend
const { GeoJsonLayer, RasterTileLayer, VectorTileLayer } = Layer
const { defaultDocument } = Doc
const MAPGISSCALELIST = [
  295829355.45,
  147914677.725,
  73957338.8625,
  36978669.43125,
  18489334.715625,
  9244667.3578125,
  4622333.67890625,
  2311166.83945312,
  1155583.41972656,
  577791.709863281,
  288895.854931641,
  144447.92746582,
  72223.9637329102,
  36111.9818664551,
  18055.9909332275,
  9027.99546661377,
  4513.99773330688,
  2256.99886665344,
  1128.49943332672,
  564.249716663361
]

export default {
  name: "mapgis-ui-portal-serviceresource",
  components: {
  },
  data() {
    return {
      serviceTypes: [
        {
          key: 'MapGISREST',
          title: 'MapGIS REST服务',
          value: '2,3,4,5,7,17,18,19,20'
        },
        // {
        //   key: 'ArcGISREST',
        //   title: 'ArcGIS REST服务',
        //   value: '13,14,15'
        // },
        {
          key: 'WMS',
          title: 'WMS服务',
          value: '8'
        },
        // {
        //   key: 'WFS',
        //   title: 'WFS服务',
        //   value: '9'
        // },
        {
          key: 'WMTS',
          title: 'WMTS服务',
          value: '10'
        },
        // {
        //   key: 'WCS',
        //   title: 'WCS服务',
        //   value: '11'
        // },
      ],
      serviceModels: [],
      serviceForm: {
        serverType: '',
        serverName: '',
        // subType: undefined
      },
      serviceUrl: ''
    };
  },
  props: {
    currentDocument: {
      type: Object,
      default: () => {
        return {}
      }
    },
    handleNewDocument: Function
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    handleTypeChange () {
      this.serviceForm.serverName = ''
      let serviceFormdata = {
        serviceType: this.serviceForm.serverType || '',
        page: 1,
        pageSize: 1000,
        filter: 'page'
      }
      getPortalServices(serviceFormdata)
        .then(res => {
          if (res.status === 200) {
            let result = res.data
            let resultData = result.list
            let serviceData = []
            if (result.total > 0) {
              resultData.forEach(element => {
                let service = {
                  id: element.serviceModel.id,
                  name: element.serviceModel.name,
                  // subTypes: element.serviceModel.subTypes
                }
                serviceData.push(service)
              })
              this.serviceModels = serviceData
            } else {
              this.serviceModels = []
            }
          }
        })
        .catch(error => {
          vm.$notification.error({ message: "网络异常,请检查链接", description: error })
        })
    },
    // handleServiceNameSelect (index) {
    //   this.serviceForm.serverName = this.serviceModels[index].name
    //   this.serviceForm.subType = this.serviceModels[index].subTypes[0]
    // },
    handleAddServiceresource () {
      if (this.serviceForm.serverType === '' || this.serviceForm.serverName === '') {
        this.$message.error('请将所有项填写完整');
        this.$emit("handleLoading", true);
        this.$nextTick(() => {
          this.$emit("handleLoading", false);
        });
      } else {
        let portalBaseurl = getPortalUrl()
        let temUrl = portalBaseurl.split('://')[1]
        let portalIp = temUrl.split(':')[0]
        let portalPort = temUrl.split(':')[1]

        // console.warn('打印RuleParse', RuleParse)
        let parse = new RuleParse()
        let serverType = parseInt(this.serviceForm.serverType) === 2 ? 5 : parseInt(this.serviceForm.serverType)
        let capability = parse.GetCapabilities(serverType, portalIp, portalPort, this.serviceForm.serverName)
        this.serviceUrl = parse.GetMap(parseInt(this.serviceForm.serverType), portalIp, portalPort, this.serviceForm.serverName, 'url')

        this.checkCrs(capability)
        // console.warn('打印url', url)
        // this.paraDocument(url)
      }
    },
    checkCrs (url) {
      this.$emit("handleLoading", true);
      axios.get(url)
        .then(res => {
          if (res.status === 200) {
            this.$emit("handleLoading", false);
            let result = res.data
            if (typeof result === 'object') {
              let resolution = this.getTileResolution(result)
              if (resolution > 2) {
                this.$message.error('目前服务只支持经纬度坐标，无法添加非经纬度服务')
                this.serviceUrl = ''
              } else {
                let mapgisOffset = this.getOffset(result)
                let maxBounds = this.getMaxBounds(result)
                this.paraDocument(this.serviceUrl, mapgisOffset, maxBounds)
              }
            } else if (typeof result === 'string') {
              let checkString = result.substring(result.indexOf('<TileMatrixSet>'),result.indexOf('</TileMatrixSet>'))
              if (checkString.indexOf('4326') > 0 || checkString.indexOf('4490') > 0) {
                let mapgisOffset = this.getOffset(result)
                let maxBounds = this.getMaxBounds(result)
                this.paraDocument(this.serviceUrl, mapgisOffset, maxBounds)
              } else {
                this.$message.error('目前服务只支持经纬度坐标，无法添加非经纬度服务')
                this.serviceUrl = ''
              }
            }
          }
        })
        .catch(error => {
          this.$emit("handleLoading", false);
          this.$notification.error({ message: '网络异常,请检查链接', description: error })
        })
    },
    paraDocument (url, offset, maxBounds) {
      let serverName = this.serviceForm.serverName
      let doc = IDocument.deepclone(this.currentDocument)
      let layer
      layer = new RasterTileLayer(serverName)
      layer.subtype = 'Raster'
      layer.name = serverName
      layer.title = serverName
      layer.tileUrl = url
      layer.url = url
      layer.key = serverName
      layer.id = serverName
      layer.mapgisOffset = offset
      doc.addLayerInGroup(layer)
      doc.maxBounds = maxBounds

      console.warn('通过门户服务返回新的document给在线制图', doc, maxBounds)
      let payload = {
        document: doc
      }
      this.handleNewDocument(payload) // 将新生成的doc传给在线制图
      this.$emit('closeDialog') // 关闭导入文件对话框
    },
    getTileResolution (tile) {
      let result = -1
      let { TileInfo2 } = tile
      if (TileInfo2 && TileInfo2.tileInfo && TileInfo2.tileInfo.lods) {
        let lods = TileInfo2.tileInfo.lods
        result = lods.length > 0 ? lods[0].resolution : -1
      }
      return result
    },
    getOffset (responseData) {
      let offset = 0
      if (typeof responseData === 'object') {
        let { TileInfo2 } = responseData
        if (TileInfo2 && TileInfo2.tileInfo && TileInfo2.tileInfo.cols && TileInfo2.tileInfo.lods) {
          let cols = TileInfo2.tileInfo.cols
          let lods = TileInfo2.tileInfo.lods
          let scale = -1
          if (lods.length > 0) {
            for (let i = 0; i < lods.length; i++) {
              if (lods[i].scale > 0) {
                scale = lods[i].scale
                break
              }
            }
          }
          scale = Number(scale)
          let flag = MAPGISSCALELIST.indexOf(scale) >= 0
          // console.warn('【检查2项】', scale, MAPGISSCALELIST.indexOf(scale))
          if (flag && cols=== 256) offset = -1
        }
      } else if (typeof responseData === 'string') {
        let tempList = responseData.split('<ows:Abstract>')
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].indexOf('MapGIS') >= 0 && tempList[i].indexOf('96DPI') >= 0) {
            let checkScaleInfo = tempList[i].substring(tempList[i].indexOf('<ScaleDenominator>') + '<ScaleDenominator>'.length, tempList[i].indexOf('</ScaleDenominator>'))
            let checkTileWidth = tempList[i].substring(tempList[i].indexOf('<TileWidth>') + '<TileWidth>'.length, tempList[i].indexOf('</TileWidth>'))
            checkScaleInfo = Number(checkScaleInfo)
            checkTileWidth = Number(checkTileWidth)
            let flag = MAPGISSCALELIST.indexOf(checkScaleInfo) >= 0
            if (flag && checkTileWidth=== 256) offset = -1
            // console.warn('【检查2项】', checkScaleInfo, checkTileWidth)
            break
          }
        }
      }
      return offset
    },
    getMaxBounds (responseData) {
      let maxBounds = {
        east: 180,
        north: 90,
        south: -90,
        west: -180
      }
      if (typeof responseData === 'object') {
        let { TileInfo2 } = responseData
        if (TileInfo2 && TileInfo2.initialExtent && TileInfo2.initialExtent.xmax) {
          maxBounds.east = TileInfo2.initialExtent.xmax
          maxBounds.north = TileInfo2.initialExtent.ymax
          maxBounds.south = TileInfo2.initialExtent.ymin
          maxBounds.west = TileInfo2.initialExtent.xmin
        }
      } else if (typeof responseData === 'string') {
        let boundingBox = responseData.substring(responseData.indexOf('ows:BoundingBox'), responseData.indexOf('/ows:BoundingBox'))
        let lowerCorner = boundingBox.substring(boundingBox.indexOf('<ows:LowerCorner>') + 17, boundingBox.indexOf('</ows:LowerCorner>'))
        let upperCorner = boundingBox.substring(boundingBox.indexOf('<ows:UpperCorner>') + 17, boundingBox.indexOf('</ows:UpperCorner>'))
        maxBounds.east = Number(upperCorner.split(' ')[1]) || 180
        maxBounds.north = Number(upperCorner.split(' ')[0]) || 90
        maxBounds.south = Number(lowerCorner.split(' ')[0]) || -90
        maxBounds.west = Number(lowerCorner.split(' ')[1]) || -180
        // console.warn('【检查字符】', boundingBox)
      }
      return maxBounds
    }
  }
};
</script>

<style>
.mapgis-ui-portal-serviceresource {
}
</style>
