<template>
  <mapgis-marker
    :coordinates="marker.coordinates"
    anchor="bottom"
    @mouseenter="$emit('mouseenter', $event, marker.markerId)"
    @mouseleave="$emit('mouseleave', $event, marker.markerId)"
  >
    <img
      slot="marker"
      :src="marker.img"
      :ref="marker.markerId"
      @load="onMarkerImageLoad"
    />
    <mapgis-popup
      :coordinates="marker.coordinates"
      :showed="true"
      :offset="popupOffset(marker.markerId)"
      v-if="markerImageLoadStatus"
    >
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
          class="mapgis-table-marker"
        >
          <mapgis-ui-list-item
            slot="renderItem"
            slot-scope="item"
            class="mapgis-table-marker-item"
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
    </mapgis-popup>
  </mapgis-marker>
</template>

<script>
export default {
  name: "mapgis-marker-pro",
  props: {
    marker: {
      type: Object,
      required: true
    },
    anchor: {
      type: String,
      default: "bottom"
    },
    fieldConfigs: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      markerImageLoadStatus: false
    };
  },
  computed: {
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
    },
    popupOffset() {
      const self = this;
      return function(ref) {
        if (self.$refs[ref]) {
          return [0, -self.$refs[ref].clientHeight];
        }
        return [0, 0];
      };
    }
  },
  methods: {
    onMarkerImageLoad() {
      this.markerImageLoadStatus = true;
    }
  }
};
</script>
<style scoped>
.mapgis-table-marker {
  max-height: 200px;
  overflow: auto;
  margin-top: 10px;
}

.mapgis-table-marker > .mapgis-table-marker-item {
  padding: 0;
  font-size: 10px;
}

.mapgis-table-marker-item div {
  padding: 2px 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
