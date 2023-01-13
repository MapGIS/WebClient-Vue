<template>
  <mapgis-popup
    v-if="coordinates.length"
    :coordinates="coordinates"
    :offset="popupOffset"
    anchor="bottom"
    showed
    :closeOnClick="false"
  >
    <div slot="default">
      <slot name="popup">
        <div :class="`${prefixCls}-popup-content`" :style="markerStyle">
          <p v-if="area">周长：{{ perimeter }}</p>
          <p>长度：{{ perimeter }}</p>
          <p v-if="area">面积：{{ area }}</p>
        </div>
      </slot>
    </div>
  </mapgis-popup>
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
    },
    popupOffset() {
      // mapboxgl默认标注图片高度为41px
      return [0, 0];
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
<style scoped>
.measure-marker-popup {
  display: flex;
  flex-direction: column-reverse;
}
.measure-marker-popup-tip {
  align-self: center;
  width: 0;
  height: 0;
  border-bottom: none;
  z-index: 1;
}
</style>
