<template>
  <div style="display: none">
    <!-- slot for custom marker -->
    <slot name="marker" />
    <!-- slot for popup -->
    <slot v-if="marker" />
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-marker",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    text: {
      type: String,
      default: ""
    },
    fontSize: {
      type: String,
      default: "16px"
    },
    fontFamily: {
      type: String,
      default: "宋体"
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: "#000000"
    },
    iconUrl: {
      type: String,
      required: true
    },
    iconHeight: {
      type: Number,
      default: 50
    },
    iconWidth: {
      type: Number,
      default: 50
    },
    farDist: {
      type: Number,
      default: 10000000
    },
    nearDist: {
      type: Number,
      default: 1
    },
    iconPos: {
      type: String,
      default: "center"
    },
    heightReference: {
      type: String,
      default: "clamped"
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },
  data() {
    return {
      marker: undefined
    };
  },
  provide() {
    const self = this;
    return {
      get marker() {
        // 提供marker给子组件popup或者插槽槽
        return self.marker;
      }
    };
  },
  mounted() {
    let vm = this;
    Object.keys(this.$props).forEach(function(key) {
      if (key !== "vueKey" && key !== "vueIndex") {
        vm.$watch(key, function() {
          vm.$_unmount();
          vm.$_mount();
        });
      }
    });
    this.$_mount();
  },
  destroyed() {
    this.$_unmount();
  },
  methods: {
    $_mount() {
      let vm = this;
      window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
        vm.$_init(webGlobe);
      }, this.vueKey);
    },
    $_unmount() {
      const { vueKey, vueIndex } = this;
      const vm = this;
      let CesiumZondy = this.CesiumZondy || window.CesiumZondy;
      window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
        let MarkerManager = CesiumZondy.MarkerManager.findSource(
          vueKey,
          vueIndex
        );
        let webGlobeMarker = vm.webGlobe || webGlobe;
        webGlobeMarker.viewer.entities.remove(MarkerManager.source);
        CesiumZondy.MarkerManager.deleteSource(vueKey, vueIndex);
      }, vueKey);
    },
    $_init(webGlobe) {
      const { CesiumZondy } = this;
      let Cesium = this.Cesium || window.Cesium;
      let webGlobeMarker = this.webGlobe || webGlobe;
      let labelLayer = new CesiumZondy.Manager.LabelLayer({
        viewer: webGlobeMarker.viewer
      });
      let heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      switch (this.heightReference) {
        case "clamped":
          heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
          break;
        case "absolute":
          heightReference = Cesium.HeightReference.NONE;
          break;
        case "above":
          heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
          break;
      }
      if (this.height > 0) {
        heightReference = Cesium.HeightReference.NONE;
      }
      this.$_append(labelLayer, heightReference);
      this.marker = this;
      console.log("marker", this);
    },
    $_append(labelLayer, heightReference) {
      let icon = labelLayer.appendLabelIcon(
        //文本内容
        this.text,
        //经度、纬度、高度
        this.longitude,
        this.latitude,
        this.height,
        //文字大小、字体
        this.fontSize + " " + this.fontFamily,
        //文字颜色
        Cesium.Color.fromCssColorString(this.color),
        // "data/picture/icon.png",
        this.iconUrl,
        this.iconWidth,
        this.iconHeight,
        //最远显示距离：相机到注记的距离大于该值 注记不显示
        this.farDist,
        //最近显示距离：相机到注记的距离小于该值 注记不显示
        this.nearDist,
        //图片位置：'center','top','bottom'
        this.iconPos,
        "",
        //相对位置
        heightReference
      );
      this.$_addIcon(icon);
    },
    $_addIcon(icon) {
      const { vueKey, vueIndex } = this;
      let CesiumZondy = this.CesiumZondy || window.CesiumZondy;
      CesiumZondy.MarkerManager.addSource(vueKey, vueIndex, icon);
    },
    togglePopup() {
      const { longitude, latitude, height } = this;
      let children = this.$children;
      if (!children || children.length <= 0) return;
      let popup = children[0];
      let vnode = popup.$vnode;
      if (!vnode) return;
      let { tag } = vnode;
      if (!tag || tag.indexOf("mapgis-3d-popup") < 0) return;
      if (!popup.$props.position) {
        popup.$props.position = { longitude, latitude, height };
        popup.togglePopup();
      }
      popup.togglePopup();
    }
  }
};
</script>
