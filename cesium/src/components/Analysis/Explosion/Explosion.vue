<template>
  <div>
    <slot>
      <mapgis-ui-group-tab title="图层"></mapgis-ui-group-tab>
      <mapgis-ui-select
        class="mapgis-3d-explosion-analysis-layers"
        :autoWidth="true"
        size="default"
        v-model="currentModelId"
        @change="onSelectedModelChange"
        placeholder="请选择图层"
      >
        <mapgis-ui-select-option
          v-for="(l, i) in models"
          :key="i"
          :value="l.id"
          >{{ l.title }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>

      <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
      <mapgis-ui-setting-form :layout="layout" size="default">
        <mapgis-ui-form-item label="分组字段">
          <mapgis-ui-row>
            <mapgis-ui-col :span="24">
              <mapgis-ui-select
                v-if="explosionFields.length > 0"
                v-model="settingCopy.explosionField"
                placeholder="请选择分组字段"
                @change="onExplosionFieldChange"
              >
                <mapgis-ui-select-option
                  v-for="item in explosionFields"
                  :key="item.name"
                >
                  {{ item.alias || item.name }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
              <mapgis-ui-input
                v-else
                v-model="settingCopy.explosionField"
                placeholder="请输入属性字段"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="分组方式">
          <mapgis-ui-row>
            <mapgis-ui-col :span="24">
              <mapgis-ui-select
                v-model="settingCopy.groupType"
                :disabled="disableGroupTypeChange"
                @change="onGroupTypeChange"
              >
                <mapgis-ui-select-option
                  v-for="item in groupTypes"
                  :key="item.value"
                >
                  {{ item.label }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </mapgis-ui-col></mapgis-ui-row
          >
        </mapgis-ui-form-item>
        <mapgis-ui-form-item
          label="初始分段数"
          v-show="settingCopy.groupType == 'MapgisUiExplosionRange'"
        >
          <mapgis-ui-input-number-addon
            v-model.number="segments"
            :min="2"
            :max="maxSegments"
            @change="getDirectionsArray"
          />
        </mapgis-ui-form-item>
        <!-- <mapgis-ui-form-item label="爆炸方向">
          <mapgis-ui-radio-group v-model="axis" size="small">
            <mapgis-ui-radio value="X"> X轴 </mapgis-ui-radio>
            <mapgis-ui-radio value="Y"> Y轴(垂直方向) </mapgis-ui-radio>
            <mapgis-ui-radio value="Z"> Z轴 </mapgis-ui-radio>
          </mapgis-ui-radio-group>
        </mapgis-ui-form-item> -->
        <mapgis-ui-form-item>
          <mapgis-ui-group-tab
            title="爆炸距离"
            :isTitleBold="false"
            :hasTopMargin="false"
            :hasBottomMargin="false"
          >
            <mapgis-ui-tooltip slot="tip" placement="top">
              <template slot="title">
                <span>{{ info }}</span>
              </template>
              <mapgis-ui-iconfont type="mapgis-info"></mapgis-ui-iconfont>
            </mapgis-ui-tooltip>
          </mapgis-ui-group-tab>
          <mapgis-ui-input-number-addon
            v-model.number="settingCopy.distance"
            :min="0"
            addon-after="米"
            @change="getDirectionsArray"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-switch-panel
          size="default"
          label="高级设置"
          v-model="openAdvancedSetting"
        >
          <directions-setting
            v-model="directionsArray"
            :rangeField="settingCopy.explosionField"
            :rangeFieldMode="rangeFieldMode"
            :rangeMaxValue="groupMaxValue"
          >
          </directions-setting>
        </mapgis-ui-switch-panel>
      </mapgis-ui-setting-form>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button type="primary" @click="explosion">
          开始爆炸
        </mapgis-ui-button>
        <mapgis-ui-button @click="removeExplosion"> 结束爆炸 </mapgis-ui-button>
      </mapgis-ui-setting-footer>
    </slot>
  </div>
</template>

<script>
import VueOptions from '../../Base/Vue/VueOptions'
import BaseLayer from '../BaseLayer'
import * as Feature from '../../service/comprehensive-query/util/feature'
import { drawerProps } from '../../../../../ui/src/components/drawer/Drawer.vue'
import DirectionsSetting from './components/DirectionsSetting.vue'

const mockData = {
  type: 'FeatureCollection',
  dataCount: 2,
  features: [
    {
      type: 'Feature',
      properties: {
        oid: 1,
        AREA: 0
      }
    },
    {
      type: 'Feature',
      properties: {
        oid: 2,
        AREA: 1
      }
    }
  ]
}

export default {
  name: 'mapgis-3d-explosion-analysis',
  inject: ['Cesium', 'vueCesium', 'viewer'],
  mixins: [BaseLayer],
  components: {
    DirectionsSetting
  },
  props: {
    ...VueOptions,
    layout: {
      type: String,
      default: 'vertical' // 'horizontal' 'vertical' 'inline'
    },
    // 模型集合
    models: {
      type: Array,
      default: () => []
    },
    setting: {
      type: Object,
      default: () => {
        return {
          groupType: 'MapgisUiExplosionUnique',
          explosionField: 'oid',
          distance: 1
        }
      }
    }
  },
  computed: {
    rangeFieldMode() {
      return this.settingCopy.groupType === 'MapgisUiExplosionUnique'
        ? 'unique'
        : 'range'
    },
    rangeFormOptions() {
      return [
        {
          id: this.vueIndex,
          type: this.settingCopy.groupType,
          props: {
            size: 'small',
            field: this.settingCopy.explosionField,
            dataSource: this.dataSource || mockData,
            segments: this.segments
          },
          customProps: {
            showBorder: false
          }
        }
      ]
    }
  },
  data() {
    return {
      // m3d版本支持2.0和2.1
      m3dVersion: '2.0',
      // 默认设置
      settingCopy: {
        groupType: 'MapgisUiExplosionUnique',
        explosionField: 'oid',
        distance: 1000
      },
      // 爆炸方法集
      groupTypes: [
        {
          label: '单值',
          value: 'MapgisUiExplosionUnique'
        },
        {
          label: '分段',
          value: 'MapgisUiExplosionRange'
        }
        // {
        //   label: "随机",
        //   value: "MapgisUiExplosionRandom"
        // }
      ],
      currentModelId: undefined,
      explosionFields: [],
      dataSource: undefined,
      openAdvancedSetting: false,
      disableGroupTypeChange: true,
      segments: 5,
      maxSegments: 5,
      directionsArray: [],
      groupMaxValue: 0,
      // axis: 'Y',
      info: '爆炸距离默认值为模型包围盒高度/2。默认爆炸方向为Y轴(垂直方向)'
    }
  },
  watch: {
    models: {
      handler: function (models) {
        this.currentModelId = undefined
      },
      deep: true
    },
    setting: {
      handler: function (setting) {
        this.settingCopy = JSON.parse(JSON.stringify(setting))
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.mount()
  },
  destroyed() {
    this.unmount()
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this
      return new Promise(
        (resolve) => {
          resolve()
        },
        (reject) => {}
      )
    },
    mount() {
      const { Cesium, viewer, vueCesium, vueKey, vueIndex } = this
      const vm = this
      let promise = this.createCesiumObject()
      promise.then(function (dataSource) {
        vm.$emit('load', vm)
        vueCesium.ExplosionManager.addSource(vueKey, vueIndex, dataSource, {
          modelExplosionTool: undefined,
          m3dSet: undefined
        })
      })
    },
    unmount() {
      this.removeExplosion()
      let { vueCesium, vueKey, vueIndex } = this
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex)
      if (find) {
      }
      vueCesium.ExplosionManager.deleteSource(vueKey, vueIndex)
      this.$emit('unload', this)
    },

    /**
     * 判断传入的m3d、Cesium3DTileset图层是否加载完毕
     */
    _m3dIsReady() {
      const { vueKey, currentModelId } = this
      return new Promise((resolve, reject) => {
        if (currentModelId.length > 0) {
          this.$_getAll3DTileSetArray(
            function (m3ds) {
              if (m3ds && m3ds.length > 0) {
                resolve(m3ds)
              } else {
                reject(null)
              }
            },
            vueKey,
            currentModelId
          )
        } else {
          reject(null)
        }
      })
    },
    /**
     * 选择分组字段
     */
    onExplosionFieldChange(val) {
      if (!this.explosionFields) {
        return
      }
      const field = this.explosionFields.find((item) => item.name === val)
      const fieldType = field.type
      if (fieldType.toLowerCase() === 'string') {
        // 字符串类型的字段只支持单值分组
        this.disableGroupTypeChange = true
        this.settingCopy.groupType = 'MapgisUiExplosionUnique'
      } else {
        // 非字符串类型的字段支持单值和分组
        this.disableGroupTypeChange = false
      }
      this.getDirectionsArray()
    },

    onGroupTypeChange() {
      this.getDirectionsArray()
    },
    /**
     * 切换模型
     */
    onSelectedModelChange(val) {
      const { Cesium, vueCesium, vueKey, vueIndex } = this
      this.removeExplosion()
      vueCesium.ExplosionManager.changeOptions(
        vueKey,
        vueIndex,
        'modelExplosionTool',
        undefined
      )
      vueCesium.ExplosionManager.changeOptions(
        vueKey,
        vueIndex,
        'm3dSet',
        undefined
      )
      this.queryFeatures = undefined
      this.M3DFeatures = undefined
      this.maxSegments = 5
      this.currentModelId = val
      const currentModel = this.models.find((item) => item.id === val)
      const { url, searchParams } = currentModel
      this._m3dIsReady().then((m3dSetArray) => {
        if (m3dSetArray && m3dSetArray.length > 0) {
          const modelExplosionTool = new Cesium.ModelExplosion(viewer)
          vueCesium.ExplosionManager.changeOptions(
            vueKey,
            vueIndex,
            'modelExplosionTool',
            modelExplosionTool
          )
          vueCesium.ExplosionManager.changeOptions(
            vueKey,
            vueIndex,
            'm3dSet',
            m3dSetArray
          )
          const m3dSet = m3dSetArray[0]
          const zmin = m3dSet._root.boundingVolume.minimumHeight
          const zmax = m3dSet._root.boundingVolume.maximumHeight
          this.settingCopy.distance = Math.ceil((zmax - zmin) / 2)
          this.m3dVersion = m3dSet._version
          if (searchParams && searchParams.searchName) {
            // 存在searchParams，则查询属性字段等
            const tempUrl = new URL(url)
            const domain = tempUrl.origin
            this.getFields({ domain, searchParams })
            return
          }
          // 如果没有挂searchName，则需要从M3DSet中去拿对应的属性信息，没有属性信息，就直接使用FID
          this.M3DFeatures = this.getM3DFeatures(m3dSet._root.children)
          this.maxSegments = this.M3DFeatures.length
          const fields = []
          const { properties } = this.M3DFeatures[0]
          const keys = Object.keys(properties)
          for (let k = 0; k < keys.length; k++) {
            const field = {
              type: typeof properties[keys[k]],
              name: keys[k]
            }
            fields.push(field)
          }
          if (JSON.stringify(this.explosionFields) !== JSON.stringify(fields)) {
            this.explosionFields = fields
            this.settingCopy.explosionField = fields[0].name
            this.onExplosionFieldChange(this.explosionFields[0].name)
          }
          this.getDirectionsArray()
        }
      })
    },
    /**
     * 从M3D中获取要素
     */
    getM3DFeatures(childrenArray) {
      let features = []
      for (let i = 0; i < childrenArray.length; i++) {
        const m3dObj = childrenArray[i]
        if (m3dObj.children && m3dObj.children.length > 0) {
          const tempFeatures = this.getM3DFeatures(m3dObj.children)
          features = [...features, ...tempFeatures]
        } else {
          const contentFeatures = this.getContentFeatures(m3dObj._content)
          const zmin = m3dObj._boundingVolume.minimumHeight
          const zmax = m3dObj._boundingVolume.maximumHeight
          for (let j = 0; j < contentFeatures.length; j++) {
            // 获取要素的全部属性名
            const featureProperty = contentFeatures[j].getPropertyIds()
            // 根据属性名得到属性值
            const contentFeaturesMap = featureProperty.reduce(
              (acc, item, index) => {
                acc[item] = contentFeatures[j].getProperty(item)
                return acc
              },
              {}
            )
            const feature = {
              type: 'Feature',
              id: j,
              centerHeight: (zmin + zmax) / 2,
              properties: contentFeaturesMap
            }
            features.push(feature)
          }
        }
      }
      return features
    },
    /**
     * 获取全部瓦片对应的要素
     */
    getContentFeatures(content) {
      let res = []
      const contentArray = content._contents
      if (contentArray) {
        contentArray.forEach((item) => {
          const tempFeatures = this.getContentFeatures(item)
          res = [...res, ...tempFeatures]
        })
      } else {
        const features = content.batchTable._features
        return features
      }
      return res
    },

    /**
     * 获取分组字段选项数组
     */
    async getFields(params) {
      // 先支持简单要素类的查询，调用igs的资源接口
      const { domain, searchParams } = params
      const { searchName, searchServiceType } = searchParams
      if (searchServiceType === 'IGSVector3D' || 'IGSVector') {
        const tempParams = {
          domain,
          url: searchName,
          pageCount: 99999,
          page: 0,
          returnGeometry: true
        }
        this.geoJSONData = await Feature.FeatureQuery.igsQueryResourceServer(
          tempParams
        )
        const { fields } = this.geoJSONData
        this.explosionFields = fields
        this.settingCopy.explosionField = fields[0].name
        this.onExplosionFieldChange(fields[0].name)
        const { features } = this.geoJSONData
        if (features && features.length > 0) {
          features.map((feature) => {
            const { attributes, bound } = feature
            const { zmin, zmax } = bound
            let direction
            feature.centerHeight = (zmin + zmax) / 2
            feature.properties = attributes
          })
          this.queryFeatures = features
          this.maxSegments = this.queryFeatures.length
          this.getDirectionsArray()
        }
        return fields
      }
    },
    getDirectionsArray() {
      const { M3DFeatures, queryFeatures } = this
      // const { explosionField } = this.settingCopy
      if (M3DFeatures && M3DFeatures.length > 0) {
        this.$_featuresToDirections(M3DFeatures)
      } else if (queryFeatures && queryFeatures.length > 0) {
        this.$_featuresToDirections(queryFeatures)
      }
    },
    /**
     * 基于features构造Directions
     */
    $_featuresToDirections(features) {
      const { explosionField } = this.settingCopy
      const directionsArray = []
      if (this.rangeFieldMode === 'unique') {
        // 单值
        // 需要将属性值相等的先过滤
        const newFeatures = []
        // 根据属性值进行排序。
        features.sort(function (a, b) {
          return b.properties[explosionField] - a.properties[explosionField]
        })
        for (let n = 0; n < features.length; n++) {
          // 如果多个要素对应的属性值一致，则直接取第一个就行
          if (
            n > 0 &&
            features[n].properties[explosionField] ==
              features[n - 1].properties[explosionField]
          ) {
            continue
          }
          newFeatures.push(features[n])
        }
        // 根据各要素中心点高度进行排序。基于最中心要素计算
        newFeatures.sort(function (a, b) {
          return b.centerHeight - a.centerHeight
        })
        const centerIndex = Math.floor(newFeatures.length / 2)
        for (let i = 0; i < newFeatures.length; i++) {
          const feature = newFeatures[i]
          let direction
          if (i === centerIndex) {
            direction = '0, 0, 0'
          } else {
            direction = `0,${(centerIndex - i) * this.settingCopy.distance},0`
          }
          directionsArray.push({
            direction,
            value: feature.properties[explosionField]
          })
        }
      } else if (this.rangeFieldMode === 'range') {
        // 分段
        // 1、先遍历出当前分组的值，然后对值进行从小到大排序，默认分组段数为3，数据量小于3的不分组
        features.sort(function (a, b) {
          return a.properties[explosionField] - b.properties[explosionField]
        })
        // 2、根据最小最大值求出间隔值
        const groupMinValue = Number(features[0].properties[explosionField])
        const groupMaxValue = Number(
          features[features.length - 1].properties[explosionField]
        )
        const interval = (groupMaxValue - groupMinValue) / this.segments

        // 3、根据分段数、最小最大值，间隔值，求出分段数组
        let groupDirectionsArray = []
        for (let t = 1; t <= this.segments; t++) {
          let start
          let end
          if (t === 1) {
            start = Number(groupMinValue.toFixed(2))
            end = Number((groupMinValue + t * interval).toFixed(2))
          } else if (t === this.segments) {
            start = Number((groupMinValue + (t - 1) * interval).toFixed(2))
            end = Number(groupMaxValue.toFixed(2))
            this.groupMaxValue = end
          } else {
            start = Number((groupMinValue + (t - 1) * interval).toFixed(2))
            end = Number((groupMinValue + t * interval).toFixed(2))
          }
          const groupFeatures = features.filter((item) => {
            if (end !== groupMaxValue) {
              return (
                item.properties[explosionField] >= start &&
                item.properties[explosionField] < end
              )
            } else {
              return (
                item.properties[explosionField] >= start &&
                item.properties[explosionField] <= end
              )
            }
          })
          // 求分组中要素集合的中心点，各要素中心点和再除以要素的数量
          let groupCenterHeightSum = 0
          for (let c = 0; c < groupFeatures.length; c++) {
            groupCenterHeightSum += groupFeatures[c].centerHeight
          }
          const centerHeight = groupCenterHeightSum / groupFeatures.length
          groupDirectionsArray.push({
            start,
            end,
            centerHeight
          })
        }
        // 4、基于分组中要素集的中心点从大到小排序
        groupDirectionsArray.sort(function (a, b) {
          return b.centerHeight - a.centerHeight
        })
        const groupCenterIndex = Math.floor(features.length / 2)
        for (let i = 0; i < groupDirectionsArray.length; i++) {
          const groupDirection = groupDirectionsArray[i]
          let direction
          if (i === groupCenterIndex) {
            direction = '0, 0, 0'
          } else {
            direction = `0,${
              (groupCenterIndex - i) * this.settingCopy.distance
            },0`
          }
          const { start, end } = groupDirection
          directionsArray.push({
            start,
            end,
            direction
          })
        }
      }
      this.directionsArray = directionsArray
    },
    /**
     * 爆炸分析
     */
    explosion() {
      const vm = this
      const { Cesium, vueCesium, vueKey, vueIndex } = this
      const { groupType, explosionField } = this.settingCopy
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex)
      let modelExplosionTool
      let m3dSetArray
      if (find && find.options) {
        modelExplosionTool = find.options.modelExplosionTool
        m3dSetArray = find.options.m3dSet
      }
      if (m3dSetArray && m3dSetArray.length > 0) {
        const valueGroups = vm.getValueGroups()
        const type =
          groupType === 'MapgisUiExplosionUnique' ? 'unique' : 'range'
        let field = this.settingCopy.explosionField
        if (this.queryFeatures) {
          // 关联查询，最终要把值映射到OID/tid
          //过滤字段，2.0 OID, 2.1 tid
          field = this.m3dVersion === '2.0' ? 'OID' : 'tid'
        }
        modelExplosionTool.explosionByField(m3dSetArray, {
          //过滤数据
          valueGroups,
          //过滤类型，unique：单值，range：分段
          type,
          //过滤字段
          field,
          //爆炸方向，true：单方向，false：多方向
          singleDirection: false,
          //是否每帧执行爆炸操作，默认false，有lod数据时，请设置为true可实时更新模型位置
          enableFrameFunction: true
        })
      }
    },
    /**
     * 计算用于爆炸分析的爆炸距离数组
     */
    getValueGroups() {
      const { directionsArray } = this
      const valueGroups = []
      for (let i = 0; i < directionsArray.length; i += 1) {
        let { direction } = directionsArray[i]
        const directionStrs = direction.split(',')
        direction = new Cesium.Cartesian3(
          Number(directionStrs[0]),
          Number(directionStrs[1]),
          Number(directionStrs[2])
        )
        if (this.M3DFeatures) {
          switch (this.settingCopy.groupType) {
            case 'MapgisUiExplosionUnique':
              const value = directionsArray[i].value
              valueGroups.push({
                value,
                direction
              })
              break
            case 'MapgisUiExplosionRange':
              const { start, end } = directionsArray[i]
              valueGroups.push({
                start,
                end:
                  end === this.groupMaxValue ? end : end - 0.01 * (end - start),
                direction
              })
              break
            default:
              break
          }
        } else if (this.queryFeatures) {
          const { queryFeatures } = this
          const { explosionField } = this.settingCopy
          // 关联查询，最终要把值映射到OID
          switch (this.settingCopy.groupType) {
            case 'MapgisUiExplosionUnique':
              const value = directionsArray[i].value
              const tempFeatures = queryFeatures.filter(
                (item) => item.properties[explosionField] == value
              )
              for (let f = 0; f < tempFeatures.length; f++) {
                valueGroups.push({
                  value: tempFeatures[f].properties.FID,
                  direction
                })
              }
              break
            case 'MapgisUiExplosionRange':
              const { start, end } = directionsArray[i]
              // 查找属性值在这个范围内的要素
              const groupFeatures = queryFeatures.filter((item) => {
                if (end !== this.groupMaxValue) {
                  return (
                    item.properties[explosionField] >= start &&
                    item.properties[explosionField] < end
                  )
                } else {
                  return (
                    item.properties[explosionField] >= start &&
                    item.properties[explosionField] <= end
                  )
                }
              })
              if (groupFeatures && groupFeatures.length) {
                // 获取对应的FID的范围
                let tempStart
                let tempEnd
                if (groupFeatures.length == 1) {
                  tempStart = groupFeatures[0].properties.FID
                  tempEnd = groupFeatures[0].properties.FID
                } else {
                  groupFeatures.sort(function (a, b) {
                    return b.properties.FID - a.properties.FID
                  })
                  tempStart =
                    groupFeatures[groupFeatures.length - 1].properties.FID
                  tempEnd = groupFeatures[0].properties.FID
                }
                valueGroups.push({
                  start: tempStart,
                  end: tempEnd,
                  direction
                })
              }

              break
            default:
              break
          }
        }
      }
      return valueGroups
    },
    /**
     * 结束爆炸，恢复模型
     */
    removeExplosion() {
      const { vueCesium, vueKey, vueIndex } = this
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex)
      let modelExplosionTool
      let m3dSetArray
      if (find && find.options) {
        modelExplosionTool = find.options.modelExplosionTool
        m3dSetArray = find.options.m3dSet
        if (modelExplosionTool && m3dSetArray) {
          modelExplosionTool.resetExplosionByField(m3dSetArray)
        }
      }
    }
  }
}
</script>

<style scoped>
.model {
  font-size: 12px;
}
.mapgis-ui-radio-wrapper {
  font-size: 12px;
}
</style>
