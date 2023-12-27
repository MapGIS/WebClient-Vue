<template>
  <div>
    <slot>
      <mapgis-ui-group-tab title="图层"></mapgis-ui-group-tab>
      <mapgis-ui-select
        class="mapgis-3d-explosion-analysis-layers"
        :autoWidth="true"
        size="default"
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
            :max="dataSource && dataSource.dataCount ? dataSource.dataCount : 5"
          />
        </mapgis-ui-form-item>
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
            @change="getDataSource"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-switch-panel
          size="default"
          label="高级设置"
          v-model="openAdvancedSetting"
        >
          <mapgis-ui-custom-panel ref="rangeForm" :options="rangeFormOptions" />
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
import VueOptions from "../Base/Vue/VueOptions";
import BaseLayer from "./BaseLayer";
import * as Feature from "../service/comprehensive-query/util/feature";
import { drawerProps } from "../../../../ui/src/components/drawer/Drawer.vue";

const mockData = {
  type: "FeatureCollection",
  dataCount: 2,
  features: [
    {
      type: "Feature",
      properties: {
        oid: 1,
        AREA: 0
      }
    },
    {
      type: "Feature",
      properties: {
        oid: 2,
        AREA: 1
      }
    }
  ]
};

export default {
  name: "mapgis-3d-explosion-analysis",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    ...VueOptions,
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
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
          groupType: "MapgisUiExplosionUnique",
          explosionField: "oid",
          distance: 1
        };
      }
    }
  },
  computed: {
    rangeFormOptions() {
      return [
        {
          id: this.vueIndex,
          type: this.settingCopy.groupType,
          props: {
            size: "small",
            field: this.settingCopy.explosionField,
            dataSource: this.dataSource || mockData,
            segments: this.segments
          },
          customProps: {
            showBorder: false
          }
        }
      ];
    }
  },
  data() {
    return {
      // 默认设置
      settingCopy: {
        groupType: "MapgisUiExplosionUnique",
        explosionField: "oid",
        distance: 1000
      },
      // 爆炸方法集
      groupTypes: [
        {
          label: "单值",
          value: "MapgisUiExplosionUnique"
        },
        {
          label: "分段",
          value: "MapgisUiExplosionRange"
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
      disableGroupTypeChange: false,
      segments: 5,
      info:
        "爆炸距离默认值为模型包围盒高度/2。爆炸方向默认为垂直方向。要素平移距离默认值=(要素中心点高程-索引号最小的要素中心点高程)*爆炸距离。"
    };
  },
  watch: {
    models: {
      handler: function(models) {
        if (models && models.length > 0) {
          this.currentModelId = models[0].vueIndex;
        }
      },
      deep: true,
      immediate: true
    },
    setting: {
      handler: function(setting) {
        this.settingCopy = JSON.parse(JSON.stringify(setting));
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { Cesium, viewer, vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        let modelExplosionTool = new Cesium.ModelExplosion(viewer);
        vueCesium.ExplosionManager.addSource(vueKey, vueIndex, dataSource, {
          modelExplosionTool: modelExplosionTool,
          m3dSet: undefined
        });
      });
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
      if (find) {
      }
      vueCesium.ExplosionManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
      this.removeExplosion();
    },

    /**
     * 判断传入的m3d、Cesium3DTileset图层是否加载完毕
     */
    _m3dIsReady() {
      const { vueKey, currentModelId } = this;
      return new Promise((resolve, reject) => {
        if (currentModelId.length > 0) {
          this.$_getAll3DTileSetArray(
            function(m3ds) {
              if (m3ds && m3ds.length > 0) {
                resolve(m3ds);
              } else {
                reject(null);
              }
            },
            vueKey,
            currentModelId
          );
        } else {
          reject(null);
        }
      });
    },
    onExplosionFieldChange(val) {
      if (!this.explosionFields) {
        return;
      }
      const field = this.explosionFields.find(item => item.name === val);
      const fieldType = field.type;
      if (
        this.dataSource.dataCount < 3 ||
        fieldType.toLowerCase() === "string"
      ) {
        // 字符串类型的字段只支持单值分组
        this.disableGroupTypeChange = true;
      } else {
        // 非字符串类型的字段支持单值和分组
        this.disableGroupTypeChange = false;
      }
    },
    onSelectedModelChange(val) {
      this.currentModelId = val;
      const currentModel = this.models.find(item => item.id === val);
      const { url, searchParams } = currentModel;
      if (searchParams && searchParams.searchName) {
        // 存在searchParams，则查询属性字段等
        const tempUrl = new URL(url);
        const domain = tempUrl.origin;
        this.getFields({ domain, searchParams });
      }
      const { Cesium, vueCesium, vueKey, vueIndex } = this;
      this._m3dIsReady().then(m3dSetArray => {
        if (m3dSetArray && m3dSetArray.length > 0) {
          vueCesium.ExplosionManager.changeOptions(
            vueKey,
            vueIndex,
            "m3dSet",
            m3dSetArray
          );
          const m3dSet = m3dSetArray[0];
          const zmin = m3dSet._root.boundingVolume.minimumHeight;
          const zmax = m3dSet._root.boundingVolume.maximumHeight;
          this.settingCopy.distance = Math.ceil((zmax - zmin) / 2);
          // 如果没有挂searchName，则需要从M3DSet中去拿对应的属性信息，没有属性信息，就直接使用FID
          if (!searchParams || !searchParams.searchName) {
            const features = this.getM3DFeatures(m3dSet._root.children);
            // console.log(features);
            features.sort(function(a, b) {
              return a.id - b.id;
            });
            let firstFeatureCenterHeight = 0; //第一个要素中心点高度
            const tempFeatures = [];
            for (let i = 0; i < features.length; i++) {
              const feature = features[i];
              let direction;
              if (i === 0) {
                firstFeatureCenterHeight = feature.centerHeight;
                direction = "0, 0, 0";
                const { properties } = feature;
                const keys = Object.keys(properties);
                const fields = [];
                for (let k = 0; k < keys.length; k++) {
                  const field = {
                    type: typeof properties[keys[k]],
                    name: keys[k]
                  };
                  fields.push(field);
                }
                this.explosionFields = fields;
                this.settingCopy.explosionField = fields[0].name;
              } else {
                direction = `0,0,${(feature.centerHeight -
                  firstFeatureCenterHeight) *
                  this.settingCopy.distance}`;
              }
              tempFeatures.push({
                type: feature.type,
                properties: feature.properties,
                direction,
                id: feature.id
              });
            }
            this.dataSource = {
              type: "FeatureCollection",
              dataCount: tempFeatures.length,
              features: tempFeatures
            };
            this.onExplosionFieldChange(this.explosionFields[0].name);
          }
        }
      });
    },
    getM3DFeatures(childrenArray) {
      let features = [];
      for (let i = 0; i < childrenArray.length; i++) {
        const m3dObj = childrenArray[i];
        if (m3dObj.children && m3dObj.children.length > 0) {
          const tempFeatures = this.getM3DFeatures(m3dObj.children);
          features = [...features, ...tempFeatures];
        } else {
          const obj = m3dObj.content._attMap._obj;
          const zmin = m3dObj._boundingVolume.minimumHeight;
          const zmax = m3dObj._boundingVolume.maximumHeight;
          const keys = Object.keys(obj);
          for (let j = 0; j < keys.length; j++) {
            const feature = {
              type: "Feature",
              id: keys[j],
              centerHeight: (zmin + zmax) / 2,
              properties: obj[keys[j]]
            };
            features.push(feature);
          }
        }
      }
      return features;
    },
    async getFields(params) {
      // 先支持简单要素类的查询，调用igs的资源接口
      const { domain, searchParams } = params;
      const { searchName, searchServiceType } = searchParams;
      if (searchServiceType === "IGSVector3D" || "IGSVector") {
        const tempParams = {
          domain,
          url: searchName,
          pageCount: 99999,
          page: 0,
          returnGeometry: true
        };
        this.geoJSONData = await Feature.FeatureQuery.igsQueryResourceServer(
          tempParams
        );
        // console.log("geoJSONData", this.geoJSONData);
        const { fields } = this.geoJSONData;
        this.explosionFields = fields;
        this.settingCopy.explosionField = fields[0].name;
        this.getDataSource();
        this.onExplosionFieldChange(fields[0].name);
        return fields;
      }
    },
    getDataSource() {
      if (!this.geoJSONData) {
        return;
      }
      const { features } = this.geoJSONData;
      let tempFeatures = [];
      let firstFeatureCenterHeight = 0; //第一个要素中心点高度
      if (features[0].attributes && features[0].attributes.FID) {
        features.sort(function(a, b) {
          return a.attributes.FID - b.attributes.FID;
        });
      }
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const { attributes, bound } = feature;
        const { zmin, zmax } = bound;
        let direction;
        const centerHeight = (zmin + zmax) / 2;
        if (i === 0) {
          firstFeatureCenterHeight = centerHeight;
          direction = "0, 0, 0";
        } else {
          let distance = Number(
            (centerHeight - firstFeatureCenterHeight).toFixed(2)
          );
          if (distance === 0) {
            distance = 0.1;
          }
          direction = `0,0,${distance * this.settingCopy.distance}`;
        }
        tempFeatures.push({
          type: "Feature",
          properties: attributes,
          bound,
          direction,
          id: attributes.FID !== undefined ? attributes.FID : i
        });
      }
      this.dataSource = {
        type: "FeatureCollection",
        dataCount: features.length,
        features: tempFeatures
      };
    },
    explosion() {
      const vm = this;
      const { Cesium, vueCesium, vueKey, vueIndex } = this;
      const { groupType, explosionField } = this.settingCopy;
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
      let modelExplosionTool;
      let m3dSetArray;
      if (find && find.options) {
        modelExplosionTool = find.options.modelExplosionTool;
        m3dSetArray = find.options.m3dSet;
      }
      if (m3dSetArray && m3dSetArray.length > 0) {
        const valueGroups = vm.getValueGroups();
        const type =
          groupType === "MapgisUiExplosionUnique" ? "unique" : "range";

        modelExplosionTool.explosionByField(m3dSetArray, {
          //过滤数据
          valueGroups,
          //过滤类型，unique：单值，range：分段
          type: "unique",
          //过滤字段，1.0数据可不填，默认为oid
          field: "oid",
          //爆炸方向，true：单方向，false：多方向
          singleDirection: false,
          //是否每帧执行爆炸操作，默认false，有lod数据时，请设置为true可实时更新模型位置
          enableFrameFunction: false
        });
      }
    },
    getValueGroups() {
      const valueGroups = [];
      const rangeForm = this.$refs.rangeForm.$_getForm();
      const rangeArr = rangeForm[this.vueIndex];
      const key = this.settingCopy.explosionField;
      let tempDataSourceCopy = [];
      if (this.settingCopy.groupType === "MapgisUiExplosionRange") {
        const features = this.dataSource.features;
        for (let i = 0; i < features.length; i++) {
          if (
            features[i].properties[key] !== "" &&
            features[i].properties[key] !== null &&
            features[i].properties[key] !== undefined
          ) {
            const obj = {};
            obj[key] = features[i].properties[key];
            obj.direction = features[i].direction;
            obj.id = features[i].id;
            tempDataSourceCopy.push(obj);
          }
        }
        tempDataSourceCopy.sort(function(a, b) {
          return a[key] - b[key];
        });
      }
      for (let i = 0; i < rangeArr.length; i += 1) {
        let { direction } = rangeArr[i];
        const directionStrs = direction.split(",");
        direction = new Cesium.Cartesian3(
          Number(directionStrs[0]),
          Number(directionStrs[1]),
          Number(directionStrs[2])
        );
        switch (this.settingCopy.groupType) {
          case "MapgisUiExplosionUnique":
            // 这里要根据this.settingCopy.groupType的数据类型在确定是数字还是字符串，这里先默认是数字类型
            const value = Number(rangeArr[i].id);
            valueGroups.push({
              value,
              direction
            });
            break;
          case "MapgisUiExplosionRange":
            // 实质上会换算到FID，跟进FID进行单值爆炸，只是对应值范围内，平移距离相等
            const { start, end } = rangeArr[i];
            for (let i = 0; i < tempDataSourceCopy.length; i++) {
              if (
                tempDataSourceCopy[i][key] >= start &&
                tempDataSourceCopy[i][key] <= end
              ) {
                const value = tempDataSourceCopy[i].id;
                valueGroups.push({
                  value,
                  direction
                });
              }
            }
            break;
          default:
            break;
        }
      }
      return valueGroups;
    },
    removeExplosion() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
      let modelExplosionTool;
      if (find && find.options) {
        modelExplosionTool = find.options.modelExplosionTool;
        modelExplosionTool.resetExplosionByField();
      }
    }
  }
};
</script>

<style scoped>
.model {
  font-size: 12px;
}
.mapgis-ui-radio-wrapper {
  font-size: 12px;
}
</style>
