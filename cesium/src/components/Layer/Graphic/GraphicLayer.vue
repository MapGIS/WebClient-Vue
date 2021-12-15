<template>
  <div class="mapgis-3d-graphic-container" v-if="dataSourceCopy">
    <div></div>
    <div>
      <mapgis-ui-card
        style="width:100%"
        :tab-list="tabListNoTitle"
        :active-tab-key="noTitleKey"
        @tabChange="key => onTabChange(key, 'noTitleKey')"
      >
        <p v-if="noTitleKey === 'list'">
          article content
        </p>
        <div v-else-if="noTitleKey === 'edit'">
          <div :key="index" v-for="(row, index) in editList[currentEditType]">
            <mapgis-ui-input-row v-if="row.type === 'inputRow'" :title="row.title"/>
          </div>
        </div>
      </mapgis-ui-card>
    </div>
  </div>
</template>

<script>
import GraphicLayerService from "./GraphicLayerService";

export default {
  name: "mapgis-3d-graphic-layer",
  mixins: [GraphicLayerService],
  model: {
    prop: "dataSource",
    event: "change"
  },
  props: {
    //数据源支持geojson
    dataSource: {
      type: Array
    }
  },
  data() {
    return {
      //切换面板参数
      tabListNoTitle: [
        {
          key: 'list',
          tab: '标注列表',
        },
        {
          key: 'edit',
          tab: '设置面板',
        }
      ],
      //当前显示面板
      noTitleKey: 'list',
      //设置面板显示参数
      editList: {
        point: [{
          type: "inputRow",
          title: "名称"
        }, {
          type: "inputRow",
          title: "半径"
        }, {
          type: "inputRow",
          title: "填充颜色"
        }, {
          type: "inputRow",
          title: "透明度"
        }, {
          type: "inputRow",
          title: "外边线"
        }, {
          type: "inputRow",
          title: "外边线颜色"
        }, {
          type: "inputRow",
          title: "外边线透明度"
        }]
      },
      //当前编辑的类型
      currentEditType: "point",
      //数据源副本
      dataSourceCopy: undefined
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    onTabChange(key, type) {
      this[type] = key;
    },
  },
}
</script>

<style scoped>
.mapgis-3d-graphic-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 332px;
  height: 785px;
  background: white;
}
</style>