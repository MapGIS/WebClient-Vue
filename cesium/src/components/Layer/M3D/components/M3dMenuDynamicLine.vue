<template>
  <div class="mapgis-3d-m3d-menu-dynamicline">
    <mapgis-ui-divider style="fontSize:14px"> 扫描设置 </mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-dynamic-line">
      <mapgis-ui-color-pick-panel
        transparent
        label="光线颜色"
        v-model="lightColor"
        :disableAlpha="false"
        :labelCol="24"
        :wrapperCol="24"
      />

      <mapgis-ui-input-number-panel
        transparent
        size="large"
        label="扫描速度"
        tooltip="扫描速度,建议取值区间(0,1)，值越小，扫描速度越慢"
        v-model="scanSpeed"
        :step="0.1"
        :range="[0, 1]"
      >
      </mapgis-ui-input-number-panel>

      <mapgis-ui-input-number-panel
        transparent
        size="large"
        label="扫描线宽度"
        tooltip="扫描线宽度,建议取值区间(0,1)，值越小，扫描线越细"
        v-model="lineWidth"
        :step="0.1"
        :range="[0, 1]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-row>
        <label class="mapgis-3d-m3d-menu-bloom-label">底部高度偏移</label>
        <mapgis-ui-tooltip style="margin-left: 4px">
          <template slot="title">模型底部相对于制图原点的高度偏移</template>
          <mapgis-ui-iconfont type="mapgis-info-circle" />
        </mapgis-ui-tooltip>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-input-number
          v-model="bottomHeightOffset"
          label="底部高度偏移"
          placeholder="底部高度偏移"
          :step="0.1"
          :style="{ width: '256px' }"
        ></mapgis-ui-input-number>
      </mapgis-ui-row>
    </div>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="addEffect">执行动态线</mapgis-ui-button>
      <mapgis-ui-button @click="removeEffect">删除动态线</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import BaseLayer from "../BaseLayer";
import EffectMixin from "./mixins/EffectMixin";

export default {
  name: "mapgis-3d-m3d-menu-dynamic-line",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
  mixins: [BaseLayer, EffectMixin],
  props: {
    version: {
      type: String
    },
    layerIndex: {
      type: [Number, String]
    }
  },
  data() {
    return {
      layout: "horizontal",
      // 扫描速度
      scanSpeed: 0.5,
      // 扫描线宽度
      lineWidth: 0.2,
      // 扫描线颜色
      lightColor: "#FFFF00",
      // 底部高度偏移
      bottomHeightOffset: 0.0
    };
  },
  created() {},
  mounted() {},
  destroyed() {
    this.unmount();
  },
  watch: {},
  methods: {
    /**
     * 添加呼吸灯特效
     * */
    addEffect() {
      const { Cesium } = this;
      // 1 获取MapGISM3DSet对象

      let tileset = this.getM3DSet();
      if (!tileset) return

      // 2 如果MapGISM3DSet对象上有style，则备份
      this.setHighLightBack(tileset)
      // 置空style，否则会影响自定义着色器
      tileset.style = undefined

      // 3 设置自定义着色器
      // 3.1 构造扫描线颜色字符串
      const color = Cesium.Color.fromCssColorString(this.lightColor)
      const colorVec4Sting = this.formatNumberToString(color.red) + ', ' + this.formatNumberToString(color.green) + ', ' + this.formatNumberToString(color.blue) + ', ' + this.formatNumberToString(color.alpha)
      // 3.2 获取外包盒半径
      const radius = this.formatNumberToString(tileset.boundingSphere.radius)
      // 3.3 获取扫描线宽
      const lineWidth = this.formatNumberToString(this.lineWidth / 10)
      // 3.4 获取底部高度偏移
      const bottomHeightOffset = this.formatNumberToString(this.bottomHeightOffset)
      // 3.5 设置自定义着色器
      tileset.customShader = new Cesium.CustomShader({
        uniforms: {},
        fragmentShaderText: `
          void fragmentMain(vec4 position, float frameNumber, vec4 oid, inout vec4 fragColor) {
            float currentHeight = position.y + ${bottomHeightOffset} + ${radius};
            // 将0~1之间的值映射到20~720之间
            float mappedSpeed = ${this.scanSpeed} * (20.0 - 720.0) + 720.0;
            // 根据当前帧时间(czm_frameNumber)，获取当前顶点所处的周期
            float time = fract(frameNumber / mappedSpeed);
            // 获取当前高度占整体高度的百分比，0到1之间的值
            // clamp参考https://learn.microsoft.com/zh-cn/previous-versions/hh308289(v=vs.120)
            currentHeight = clamp(currentHeight / ${radius * 2}, 0.0, 1.0);
            // 处理周期
            time = abs(time - 0.5) * 2.0;
            // 根据高度和周期计算光圈
            float circle = step(${lineWidth}, abs(currentHeight - time));
            if (abs(currentHeight - time) < ${lineWidth}) {
                circle = abs(currentHeight - time) * (1.0 / ${lineWidth});
            }
            fragColor += vec4(${colorVec4Sting}) * (1.0 - circle);
          }
        `
      });
    }
  }
};
</script>

<style scoped>
.mapgis-3d-m3d-menu-dynamicline {
  height: 100%;
  width: 100%;
}
.mapgis-3d-m3d-menu-dynamic-line {
  height: 248px;
  overflow-y: auto;
  width: 275px;
}
.mapgis-3d-m3d-menu-bloom-label {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: white;
}
</style>
