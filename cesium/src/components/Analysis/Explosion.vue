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
          :value="l.vueIndex"
          >{{ l.title }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>

      <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
      <mapgis-ui-setting-form :layout="layout" size="default">
        <mapgis-ui-form-item label="分组方式">
          <mapgis-ui-row>
            <mapgis-ui-col :span="24">
              <mapgis-ui-select
                v-model="settingCopy.groupType"
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
        <mapgis-ui-form-item label="分组字段">
          <mapgis-ui-row>
            <mapgis-ui-col :span="24">
              <mapgis-ui-select
                v-if="explosionFields.length > 0"
                v-model="settingCopy.explosionField"
                placeholder="请选择分组字段"
              >
                <mapgis-ui-select-option
                  v-for="item in explosionFields"
                  :key="item.value"
                >
                  {{ item.label }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
              <mapgis-ui-input
                v-else
                v-model="settingCopy.explosionField"
                placeholder="请输入属性字段"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-custom-panel
              ref="rangeForm"
              :options="rangeFormOptions"
            />
          </mapgis-ui-row>
        </mapgis-ui-form-item>
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
          explosionField: "oid"
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
            dataSource: this.sourceData || mockData
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
        explosionField: "oid"
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
      sourceData: undefined
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
    onGroupTypeChange(val) {
      this.sourceData = { ...mockData };
    },
    onSelectedModelChange(val) {
      this.currentModelId = val;
    },
    explosion() {
      const vm = this;
      const { Cesium, vueCesium, vueKey, vueIndex } = this;
      const { groupType, explosionField } = this.settingCopy;
      this._m3dIsReady().then(m3dSetArray => {
        if (m3dSetArray && m3dSetArray.length > 0) {
          vueCesium.ExplosionManager.changeOptions(
            vueKey,
            vueIndex,
            "m3dSet",
            m3dSetArray
          );
          let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
          let modelExplosionTool;
          if (find && find.options) {
            modelExplosionTool = find.options.modelExplosionTool;
          }
          const valueGroups = vm.getValueGroups();
          const type =
            groupType === "MapgisUiExplosionUnique" ? "unique" : "range";

          modelExplosionTool.explosionByField(m3dSetArray, {
            //过滤数据
            valueGroups,
            //过滤类型，unique：单值，range：分段
            type,
            //过滤字段，1.0数据可不填，默认为oid
            field: explosionField,
            //爆炸方向，true：单方向，false：多方向
            singleDirection: false,
            //是否每帧执行爆炸操作，默认false，有lod数据时，请设置为true可实时更新模型位置
            enableFrameFunction: false
          });
        }
      });
    },
    getValueGroups() {
      const valueGroups = [];
      const rangeForm = this.$refs.rangeForm.$_getForm();
      const rangeArr = rangeForm[this.vueIndex];
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
            const value = Number(rangeArr[i].value);
            valueGroups.push({
              value,
              direction
            });
            break;
          case "MapgisUiExplosionRange":
            const { start, end } = rangeArr[i];
            valueGroups.push({
              start,
              end,
              direction
            });
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
