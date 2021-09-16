<template>
  <div :class="prefixCls" v-if="marker">
    <mapgis-marker :coordinates="marker.coordinates" anchor="bottom">
      <div slot="marker" :class="`${prefixCls}-popup`">
        <div :class="`${prefixCls}-popup-tip`"></div>
        <div :class="`${prefixCls}-popup-content`" :style="markerStyle">
          <p>周长: {{ marker.perimeter }}</p>
          <p v-if="marker.area">面积: {{ marker.area }}</p>
        </div>
      </div>
    </mapgis-marker>
  </div>
</template>
<script>
import dep from "../store/dep";

export default {
  name: "measure-marker",
  data: vm => ({
    prefixCls: "measure-marker",
    marker: null,
    markerStyle: {}
  }),
  methods: {
    /**
     * 订阅: 更新
     */
    update() {
      const { textSize, textType, textColor } = dep.getStyles();
      this.marker = dep.getResult();
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
    border: 10px solid transparent;
    border-bottom: none;
    z-index: 1;
  }
  &-popup-content {
    padding: 5px 16px;
  }
}
</style>
