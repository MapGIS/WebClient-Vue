<template>
  <mapgis-marker
    v-if="coordinates.length"
    :coordinates="coordinates"
    :class="prefixCls"
    anchor="bottom"
  >
    <slot name="marker" :class="`${prefixCls}-popup`">
      <div :class="`${prefixCls}-popup-tip`"></div>
      <div :class="`${prefixCls}-popup-content`" :style="markerStyle">
        <p>周长：{{ perimeter }}</p>
        <p v-if="area">面积：{{ area }}</p>
      </div>
    </slot>
  </mapgis-marker>
</template>
<script>
import dep from "../store/dep";

export default {
  name: "measure-marker",
  data: vm => ({
    prefixCls: "measure-marker",
    marker: {},
    markerStyle: {}
  }),
  computed: {
    area({ marker }) {
      return marker.planeArea;
    },
    perimeter({ marker }) {
      return marker.planeLength || marker.planePerimeter;
    },
    coordinates({ marker }) {
      return marker.coordinates || [];
    }
  },
  methods: {
    /**
     * 订阅: 更新
     */
    update() {
      const { textSize, textType, textColor } = dep.getStyles();
      this.marker = dep.getResult() || {};
      this.markerStyle = {
        fontSize: `${textSize}px`,
        fontFamily: textType,
        color: textColor
      };
    }
  },
  created() {
    dep.addSub(this);
  },
  beforeDestroy() {
    dep.removeSub(this);
  }
};
</script>
<style lang="scss" scoped>
.measure-marker {
  &-popup {
    display: flex;
    flex-direction: column-reverse;
  }
  &-popup-tip {
    align-self: center;
    width: 0;
    height: 0;
    border-bottom: none;
    z-index: 1;
  }
}
</style>
