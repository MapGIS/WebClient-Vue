<template>
  <div>
  </div>
</template>

<script>
export default {
  inject: ["Cesium", "vueCesium", "viewer"],

  props: {
    positions: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: {
        startHeight: 0,      // 洪水淹没水体起始高度
        minHeight: 0,        // 淹没动画高度起始点
        maxHeight: 100,      // 最大淹没高度，淹没动画高度终止点
        floodColor: new Cesium.Color(0.0, 0.4, 1.0, 0.1), // 淹没颜色
        floodSpeed: 0.05,    // 淹没速度默认0.05米/秒
        frequency: 100,      // 水纹频率
        animationSpeed: 0.01,// 水纹速度
        amplitude: 10,       // 水波高度
        specularIntensity: 1.0   // 反射光线强度
      }
    }
  },

  data () {
    return {};
  },
  created () { },
  mounted () {
    this.mount();
  },
  destroyed () {
    this.unmount();
  },
  watch: {},
  methods: {
    createCesiumObject () {
      const { Cesium, vueCesium, viewer } = this;
      return new window.CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: viewer
      });
    },
    mount () {
      const { viewer, vueIndex, vueKey, positions, options = {}, } = this;
      const { minHeight, maxHeight, floodSpeed, floodColor, frequency, animationSpeed, amplitude, specularIntensity } = options;
      let advancedAnalysisManager = this.createCesiumObject();

      //初始化洪水淹没分析类
      flood = advancedAnalysisManager.createFlood(positions, {
        //设置洪水淹没区域动画最低高度
        minHeight: minHeight, //设置洪水淹没
        //设置洪水淹没区域最高高度
        maxHeight: maxHeight,
        //设置洪水上涨速度
        floodSpeed: floodSpeed,
      });

      flood.floodColor = floodColor;
      //水纹频率 指波浪的个数
      flood.frequency = frequency;
      //水纹速度
      flood.animationSpeed = animationSpeed;
      //水波的高度
      flood.amplitude = amplitude;
      // 指定光线强度
      flood.specularIntensity = specularIntensity;

      //添加洪水淹没结果显示
      viewer.scene.VisualAnalysisManager.add(flood);

      vueCesium.AdvancedAnalysisManager.addSource(vueKey, vueIndex, advancedAnalysisManager, {
        flood: flood
      });

      this.$emit("load", this);
    },
    unmount () {
      let { viewer, vueKey, vueIndex } = this;
      let find = vueCesium.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
      if (find && find.options && find.options.flood) {
        viewer.scene.VisualAnalysisManager.remove(find.options.flood);
      }
      this.$emit("unload", this);
    }
  }
}

</script>

<style>
</style>