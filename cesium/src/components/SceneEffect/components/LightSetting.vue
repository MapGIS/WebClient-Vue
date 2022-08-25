<template>
  <div class="light-setting">
    <mapgis-ui-switch-panel
      size="default"
      label="光照"
      :checked="lightSetting.sunlight"
      @changeChecked="enableSunlight"
    >
      <mapgis-ui-form layout="vertical">
        <mapgis-ui-form-item label="光照类型">
          <mapgis-ui-select v-model="lightingMode">
            <mapgis-ui-select-option :value="'DAYNIGHT_SHADING'">
              太阳光照
            </mapgis-ui-select-option>
            <mapgis-ui-select-option :value="'VERTEX_LIGHTING'">
              顶点光照
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </mapgis-ui-form-item>
      </mapgis-ui-form>
      <mapgis-ui-color-pick-panel
        label="光照颜色"
        :color="lightSetting.sunlightParams.lightColor"
        :disableAlpha="false"
        :labelCol="24"
        :wrapperCol="24"
        @input="lightColorChange"
      />
    </mapgis-ui-switch-panel>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-input-number-panel
      size="large"
      label="模型亮度"
      v-model="lightSetting.lightIntensity"
      :range="[1, 200]"
      @change="lightIntensityChange"
    />
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "SceneEffect",
  mixins: [ServiceLayer],
  props: {
    initLightSetting: {
      type: Object,
      default: () => {
        return {
          sunlight: false,
          sunlightParams: {
            lightingMode: "DAYNIGHT_SHADING",
            lightColor: "rgba(255,255,255,255)"
          },
          lightIntensity: 10
        };
      }
    }
  },
  computed: {
    lightSetting: {
      get() {
        return this.initLightSetting;
      },
      set() {
        this.$emit("updateLightSetting", this.lightSetting);
      }
    },
    lightingMode: {
      get() {
        return this.lightSetting.sunlightParams.lightingMode;
      },
      set(val) {
        const { viewer, Cesium } = this;
        this.lightSetting.sunlightParams.lightingMode = val;
        viewer.scene.globe.lightingMode = Cesium.LightingMode[val];
      }
    }
  },
  data() {
    return {
      lightingModes: [
        {
          key: "DAYNIGHT_SHADING",
          value: "太阳光照"
        },
        {
          key: "VERTEX_LIGHTING",
          value: "顶点光照"
        }
      ]
    };
  },
  watch: {
    initLightSetting(e) {
      this.init();
    }
  },
  methods: {
    init() {
      if (!this.lightSetting) {
        return;
      }
      const { sunlight, sunlightParams, lightIntensity } = this.lightSetting;
      const { lightColor, lightingMode } = sunlightParams;
      this.enableSunlight(sunlight);
      if (sunlight) {
        this.lightColorChange(lightColor);
        viewer.scene.globe.lightingMode = Cesium.LightingMode[lightingMode];
      }
      this.lightIntensityChange(lightIntensity);
    },
    //太阳
    enableSunlight(e) {
      const { viewer } = this;
      this.lightSetting.sunlight = e;
      this.$emit("updateSpin", true);
      let vm = this;

      setTimeout(function() {
        viewer.scene.globe.enableLighting = vm.lightSetting.sunlight;
        // var sunLight = new Cesium.SunLight({color:Cesium.Color.RED});
        // viewer.scene.light = sunLight
        vm.$emit("updateSpin", false);
      }, 400);
    },
    //光照颜色、带有法线数据的模型的颜色
    lightColorChange(e) {
      this.lightSetting.sunlightParams.lightColor = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
      const { Cesium, viewer } = this;
      let color = Cesium.Color.fromCssColorString(
        this.lightSetting.sunlightParams.lightColor
      );
      viewer.scene.light.color = color;
    },
    //带有法线数据的模型的亮度
    lightIntensityChange(e) {
      const { viewer } = this;
      this.lightSetting.lightIntensity = e;
      viewer.scene.light.intensity = this.lightSetting.lightIntensity;
    }
  }
};
</script>

<style scoped>
.dividerWrapper {
  height: 13px;
}
.divider {
  display: block;
  height: 1px;
  position: absolute;
  left: 16px;
  right: 16px;
  margin: 6px 0;
  background: #f0f0f0;
}
</style>
