<template>
  <div class="mapgis-3d-m3d-menu-bloom">
    <mapgis-ui-divider style="fontSize:14px"> 泛光设置 </mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-bloom-content">
      <div>
        <mapgis-ui-color-pick-panel
          transparent
          label="颜色设置"
          v-model="lightColor"
          :disableAlpha="false"
          :labelCol="24"
          :wrapperCol="24"
        />
      </div>

      <mapgis-ui-input-number-panel
        size="large"
        label="呼吸速度"
        tooltip="呼吸灯速度,建议取值区间(0,1)，值越小，闪烁速度越慢"
        v-model="breathSpeed"
        :step="0.1"
        :range="[0, 1]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-switch-panel
        v-model="enableGradient"
        label="启用渐变"
        size="small"
        layout="horizontal"
      >
        <mapgis-ui-row>
          <label class="mapgis-3d-m3d-menu-bloom-label">渐变中心高度</label>
          <mapgis-ui-tooltip style="margin-left: 4px">
            <template slot="title">从指定高度开始渐变</template>
            <mapgis-ui-iconfont type="mapgis-info-circle" style="color: white"/>
          </mapgis-ui-tooltip>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-input-number
            v-model="gradientCenterHeight"
            label="渐变中心高度"
            placeholder="渐变中心高度"
            :step="0.1"
            :style="{ width: '256px' }"
          ></mapgis-ui-input-number>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <label class="mapgis-3d-m3d-menu-bloom-label">渐变半径</label>
          <mapgis-ui-tooltip style="margin-left: 4px">
            <template slot="title">渐变效果半径</template>
            <mapgis-ui-iconfont type="mapgis-info-circle" style="color: white"/>
          </mapgis-ui-tooltip>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-input-number
            v-model="gradientRadius"
            label="渐变半径"
            placeholder="渐变半径"
            :step="0.1"
            :style="{ width: '256px' }"
          ></mapgis-ui-input-number>
        </mapgis-ui-row>
      </mapgis-ui-switch-panel>
    </div>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="addEffect">执行泛光</mapgis-ui-button>
      <mapgis-ui-button @click="removeEffect">删除泛光</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import BaseLayer from "../BaseLayer";
import EffectMixin from "./mixins/EffectMixin";

export default {
  name: "mapgis-3d-m3d-menu-bloom",
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
  watch: {},
  data() {
    return {
      // 泛光颜色
      lightColor: "#FF0000",
      // 呼吸灯速度，越小越慢
      breathSpeed: 0.5,
      // 如果tileset上已经设置了style，则备份下来，删除泛光时还原
      highLightBack: undefined,
      // 是否启用渐变
      enableGradient: false,
      // 渐变中心高度
      gradientCenterHeight: 0.0,
      // 渐变半径
      gradientRadius: 1.0
    };
  },
  created() {},
  mounted() {},
  destroyed() {
    this.unmount();
  },
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
      // 3.1 构造呼吸灯颜色字符串
      const color = Cesium.Color.fromCssColorString(this.lightColor)
      const colorVec4Sting = this.formatNumberToString(color.red) + ', ' + this.formatNumberToString(color.green) + ', ' + this.formatNumberToString(color.blue) + ', ' + this.formatNumberToString(color.alpha)
      // 3.2 启用渐变
      if (this.enableGradient) {
        // 3.2.1 获取渐变中心高度
        const gradientCenterHeight = this.formatNumberToString(this.gradientCenterHeight)
        // 3.2.2 获取渐变半径
        const gradientRadius = this.formatNumberToString(this.gradientRadius)
        // 3.2.3 设置带渐变的泛光效果
        tileset.customShader = new Cesium.CustomShader({
          uniforms: {},
          fragmentShaderText: `
          void fragmentMain(vec4 position, float frameNumber, vec4 oid, inout vec4 fragColor) {
            // 将0~1之间的值映射到5~720之间
            float mappedSpeed = ${this.breathSpeed} * (5.0 - 720.0) + 720.0;
            // 根据当前帧时间(czm_frameNumber)，获取当前顶点所处的周期
            float time = fract(frameNumber / mappedSpeed);
            time = abs(time - 0.5) * 2.0;
            float diffHeight = abs((position.y) + ${gradientCenterHeight});
            float mappedValue = clamp(diffHeight / ${gradientRadius}, 0.0, 1.0);
            fragColor += vec4(${colorVec4Sting}) * (1.0 - mappedValue) * time;
          }
        `
        });
      }
      // 3.3 不启用渐变，设置不带渐变的泛光效果
      else {
        tileset.customShader = new Cesium.CustomShader({
          uniforms: {},
          fragmentShaderText: `
          void fragmentMain(vec4 position, float frameNumber, vec4 oid, inout vec4 fragColor) {
            // 将0~1之间的值映射到5~720之间
            float mappedSpeed = ${this.breathSpeed} * (5.0 - 720.0) + 720.0;
            // 根据当前帧时间(czm_frameNumber)，获取当前顶点所处的周期
            float time = fract(frameNumber / mappedSpeed);
            time = abs(time - 0.5) * 2.0;
            fragColor += vec4(${colorVec4Sting}) * 0.5 * time;
          }
        `
        });
      }
    }
  }
};
</script>

<style>
.mapgis-3d-m3d-menu-bloom {
  height: 100%;
  width: 100%;
}
.mapgis-3d-m3d-menu-bloom-content {
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
