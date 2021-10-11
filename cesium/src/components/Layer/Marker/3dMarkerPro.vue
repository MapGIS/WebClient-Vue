<template>
  <mapgis-3d-marker
    :longitude="popupPosition.longitude"
    :latitude="popupPosition.latitude"
    :height="popupPosition.height"
    :iconUrl="img"
    :fid="marker.fid"
    :changeEvent="changeEvent"
    :farDist="200000000"
    @mouseEnter="mouseOver"
    @mouseLeave="mouseOut"
  >
    <mapgis-3d-popup
      :vue-key="vueKey"
      :position="{
        longitude: popupPosition.longitude,
        latitude: popupPosition.latitude,
        height: popupPosition.height
      }"
      :visible="showPopup"
      @change="changePopup"
      v-on:load="bindEvent"
      :forceRender="true"
    >
      <div slot="default">
        <slot
          name="popup"
          :marker="marker"
          :field-configs="fieldConfigs"
          :property-keys="propertyKeys"
        >
          <mapgis-ui-list
            item-layout="horizontal"
            :data-source="propertyKeys"
            size="small"
            class="table-marker"
          >
            <mapgis-ui-list-item
              slot="renderItem"
              slot-scope="item"
              class="table-marker-item"
            >
              <div style="width: 130px" :title="propertyName(item)">
                {{ propertyName(item) }}
              </div>
              <div style="width: 170px" :title="marker.properties[item]">
                {{ marker.properties[item] }}
              </div>
            </mapgis-ui-list-item>
          </mapgis-ui-list>
        </slot>
      </div>
    </mapgis-3d-popup>
  </mapgis-3d-marker>
</template>

<script>
/**
 * cesium标注，弹出框使用@mapgis/webclient-vue-cesium里的popup
 */
export default {
  name: "mapgis-3d-marker-pro",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    vueKey: String,
    marker: {
      type: Object,
      required: true
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => []
    },
    // 当前显示弹出框的标注id
    currentMarkerId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      showPopup: false,
      entityNames: []
    };
  },
  computed: {
    img() {
      return this.marker.img;
    },
    popupPosition() {
      if (!this.marker) {
        return {};
      }
      const { coordinates } = this.marker;
      const height = coordinates.length > 2 ? Number(coordinates[2]) : 0;
      const position = {
        longitude: Number(coordinates[0]),
        latitude: Number(coordinates[1]),
        height: height
      };
      return position;
    },
    // 根据filedConfigs做一个过滤，去除不可见的
    propertyKeys() {
      const keys = Object.keys(this.marker.properties);
      return keys.filter(key => {
        const config = this.fieldConfigs.find(config => config.name === key);

        if (
          config &&
          Object.hasOwnProperty.call(config, "visible") &&
          !config.visible
        ) {
          return false;
        }

        return true;
      });
    },
    propertyName() {
      return function(key) {
        const config = this.fieldConfigs.find(config => config.name === key);

        if (config && Object.hasOwnProperty.call(config, "title")) {
          return config.title;
        }

        return key;
      };
    }
  },
  watch: {
    // 更换图片，更换地图上的标注
    img: {
      deep: true,
      handler() {
        this.updateMarker();
      }
    },
    currentMarkerId: {
      deep: true,
      immediate: true,
      handler() {
        // 当前显示弹出框的标注与组件内的id不一致时，隐藏弹出框
        if (this.currentMarkerId !== this.marker.fid) {
          this.showPopup = false;
        }
      }
    }
  },
  mounted() {
    const webGlobe = this.CesiumZondy.getWebGlobe(this.vueKey) || this.webGlobe;
    this.updateMarker();
  },
  beforeDestroy() {},
  methods: {
    changePopup(val) {
      this.showPopup = val;
      if (!val) {
        this.$emit("change", "");
      }
    },
    bindEvent() {
      this.$emit("popupload", this.marker.fid);
    },
    updateMarker() {
      /* let marker = { ...this.marker };
      marker.name = marker.fid;
      marker.center = marker.coordinates; */
    },
    changeEvent(enable) {
      this.showPopup = enable;
    },
    mouseOver(event) {
      const { changeEvent, fid } = event;
      if (changeEvent) {
        changeEvent(true);
      } else {
        this.showPopup = true;
      }
      this.$emit("marker-id", fid);
      this.$emit("mouseenter", event, fid);
    },
    mouseOut(event) {
      const { changeEvent, fid } = event;
      if (changeEvent) {
        changeEvent(false);
      } else {
        this.showPopup = false;
      }
      this.$emit("mouseleave", event, fid);
    }
  }
};
</script>

<style lang="less">
.cesium-popup {
  .cesium-popup-content-wrapper {
    border: none;
    /* background: @base-bg-color;
    box-shadow: 0px 1px 2px 0px @shadow-color; */
  }
  .cesium-popup-tip-container {
    .cesium-popup-tip {
      /* background: @base-bg-color;
      box-shadow: 0px 1px 2px 0px @shadow-color; */
    }
  }
  .cesium-popup-close-button {
    /* color: @text-color; */
    cursor: pointer;
    font-weight: normal;
    &:hover {
      /* color: @primary-color; */
    }
  }
}
</style>
<style lang="less" scoped>
.cesium-popup {
  .cesium-popup-content-wrapper {
    .table-marker {
      max-width: 240px;
      max-height: 200px;
      overflow: auto;
      margin-top: 10px;
      .table-marker-item {
        padding: 0;
        font-size: 10px;
        div {
          padding: 2px 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
