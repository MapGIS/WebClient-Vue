<template>
  <mapgis-ui-spin :spinning="loading">
    <div class="accessory-detail-title">
      <h3>附件</h3>
      <mapgis-ui-radio-group v-model="isList" button-style="solid" size="small">
        <mapgis-ui-radio-button :value="true">
          <mapgis-ui-iconfont type="mapgis-unorderedlist" />
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button :value="false">
          <mapgis-ui-iconfont type="mapgis-table" />
        </mapgis-ui-radio-button>
      </mapgis-ui-radio-group>
    </div>
    <mapgis-ui-file-preview
      :isList="isList"
      :files="files"
      :isrelationShip="isrelationShip"
      @project-screen="projectScreen"
    />
  </mapgis-ui-spin>
</template>

<script>
import axios from "axios";

export default {
  name: "RelationAccessory",
  props: {
    Euid: {
      type: String,
      default: ""
    },
    toType: {
      type: Number,
      default: 1
    },
    dataStoreIp: {
      type: String,
      default: ""
    },
    dataStorePort: {
      type: String,
      default: ""
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1"
    }
  },
  data() {
    return {
      isList: true,
      files: [],
      loading: false,
      isrelationShip: true
    };
  },
  methods: {
    /**
     * 视频投放回调函数
     */
    projectScreen(file) {
      this.$emit("project-screen", file);
    },
    fileDataStore(rtn) {
      const arr = [];
      rtn.forEach(({ toDataUrl, toExtInfo }) => {
        const names = toDataUrl.split("/");
        if (names.length > 0) {
          const name = names[names.length - 1];
          const { ip, port, provider } = JSON.parse(toExtInfo);
          const url = `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/file/${provider}${toDataUrl}/download?isPreview=true`;
          arr.push({
            name,
            url
          });
        }
      });
      return arr;
    },
    iotDevice(rtn) {
      const arr = [];
      rtn.forEach(({ toDataUrl, toExtInfo, toID }) => {
        const { ip, port, provider } = JSON.parse(toExtInfo);
        const url = `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/${provider}${toDataUrl}/iots/devices/videos`;
        arr.push({
          name: toID,
          type: "hls",
          url
        });
      });
      return arr;
    },
    getAccessoryInfo(datas) {
      this.getAccessory(datas).then(res => {
        console.log(res);
        this.files = res;
        this.loading = false;
      });
    },
    getAccessory(datas) {
      return new Promise((resolve, reject) => {
        let arr = [];
        this.loading = true;
        axios
          .get(
            `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/relations`,
            {
              params: {
                ...datas,
                fromType: 1,
                toType: this.toType,
                pageNo: 1,
                pageSize: 99
              }
            }
          )
          .then(res => {
            if (res.status === 200) {
              const {
                data: { total, rtn }
              } = res.data;
              this.total = total;
              arr = this.fileDataStore(rtn);
              resolve(arr);
            }
          })
          .catch(Error => {
            reject(Error);
          });
      });
    }
  }
};
</script>

<style lang="css" scoped>
.accessory-detail-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
