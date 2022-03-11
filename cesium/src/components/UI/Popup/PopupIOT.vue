<template>
  <div class="attribute-popup-content-wrapper">
    <mapgis-ui-carousel v-if="images && images.length > 0" autoplay>
      <div
        v-for="(image, index) in images"
        :key="index"
        class="carousel-image-container"
      >
        <img
          :src="image"
          width="100%"
          height="100%"
          style="object-fit: contain"
        />
      </div>
    </mapgis-ui-carousel>
    <mapgis-ui-list
      item-layout="horizontal"
      :data-source="propertyKeys"
      size="small"
      class="table-marker"
      bordered
    >
      <mapgis-ui-list-item
        slot="renderItem"
        slot-scope="item"
        class="table-marker-item"
        v-if="item !== 'images'"
      >
        <div :title="item">
          {{ item }}
        </div>
        <div :title="properties[item]">
          {{ properties[item] }}
        </div>
      </mapgis-ui-list-item>
    </mapgis-ui-list>
    <!-- 如果存在实体编码Euid字段，则暂时附件按钮 -->
    <template v-if="Euid">
      <div class="iot-enclosure-title">附件</div>
      <ul class="iot-enclosure-container">
        <li title="非结构化文件">
          <mapgis-ui-iconfont
            @click="clickIot(101)"
            type="mapgis-feijiegouhuawenjian"
          ></mapgis-ui-iconfont>
        </li>
        <li title="传感器">
          <mapgis-ui-iconfont
            @click="clickIot(301)"
            type="mapgis-a-iotDevicechuanganqi"
          ></mapgis-ui-iconfont>
        </li>
      </ul>
    </template>

    <mapgis-ui-modal
      v-model="showModal"
      :footer="null"
      :width="600"
      :centered="true"
      class="attribute-model"
      :bodyStyle="{ padding: '30px 10px 10px' }"
      :destroyOnClose="true"
    >
      <iot-detail
        v-if="Euid"
        :toType="toType"
        :Euid="Euid"
        :dataStoreIp="dataStoreIp"
        :dataStorePort="dataStorePort"
        @project-screen="projectScreen"
      />
    </mapgis-ui-modal>
  </div>
</template>

<script>
import IotDetail from "./components/IOTDetail.vue";

export default {
  components: { IotDetail },
  name: "mapgis-3d-popup-iot",
  provide() {
    return {
      getProjectorStatus: this.getProjectorStatus
    };
  },
  props: {
    properties: {
      type: Object,
      default: () => ({})
    },
    dataStoreIp: {
      type: String,
      default: "192.168.96.101"
    },
    dataStorePort: {
      type: String,
      default: "9014"
    },
    getProjectorStatus: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      showModal: false,
      // 目地实体ID列表
      toType: ""
    };
  },
  computed: {
    // 根据filedConfigs做一个过滤，去除不可见的
    propertyKeys() {
      const keys = [];
      for (const key in this.properties) {
        // 不展示关联的实体编码
        if (key !== "Euid" && key !== "images") {
          keys.push(key);
        }
      }
      return keys;
    },
    /**
     * 获取实体编码，实体编码存在的时候，展示预览界面
     */
    Euid() {
      return this.properties.Euid;
    },
    /**
     * 获取轮播图图片
     */
    images() {
      if (this.properties.images) {
        const arr = this.properties.images.split(";");
        return arr || [];
      }
      return [];
    }
  },
  methods: {
    clickIot(toType) {
      this.showModal = true;
      this.toType = toType;
    },
    /**
     * 视频投放回调函数
     */
    projectScreen(file) {
      this.$emit("project-screen", file);
    }
  }
};
</script>

<style scoped>
.attribute-model > .mapgis-ui-modal-close-x {
  width: 30px;
  height: 30px;
  line-height: 30px;
}

.attribute-popup-content-wrapper > .ant-carousel > .slick-slide {
  background-color: var(--background);
  color: white;
}

.carousel-image-container {
  height: 180px;
}

.table-marker {
  max-height: 130px;
  overflow: auto;
  margin-top: 10px;
  border-radius: 0;
  border-color: var(--primary-5);
}

.table-marker-item {
  display: flex;
  padding: 0;
}

.table-marker-item:nth-child(2n) {
  background-color: var(--primary-1);
}

.table-marker-item > div {
  padding: 2px 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px 6px;
}

.table-marker-item > div:first-child {
  width: 120px;
  border-right: 1px solid var(--primary-5);
}

.table-marker-item > div:last-child {
  flex: 1 0 0%;
}

.iot-enclosure-title {
  font-size: 15px;
  color: var(--text-color);
  font-weight: bold;
  margin-top: 10px;
}

.iot-enclosure-container {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
}

.iot-enclosure-container > li {
  margin: 0 5px 0 0;
  padding: 0 5px;
}

.iot-enclosure-container > li:hover {
  background-color: var(--shadow-color);
  cursor: pointer;
}
</style>
