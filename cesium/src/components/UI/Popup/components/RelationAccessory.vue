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
      :videoToType="videoToType"
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
      isrelationShip: true,
      videoToType: 301
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
      rtn.forEach(({ toDataUrl, toExtInfo, toType }) => {
        const names = toDataUrl.split("/");
        if (names.length > 0) {
          const name = names[names.length - 1];
          const { ip, port, provider } = JSON.parse(toExtInfo);
          const url = `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/file/${provider}${toDataUrl}/download?isPreview=true`;
          arr.push({
            name,
            url,
            toType
          });
        }
      });
      return arr;
    },
    iotDevice(rtn) {
      const arr = [];
      rtn.forEach(({ toDataUrl, toExtInfo, toID, toType }) => {
        const { ip, port, provider } = JSON.parse(toExtInfo);
        const url = `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/${provider}${toDataUrl}/iots/devices/videos`;
        arr.push({
          name: toID,
          type: "hls",
          url,
          toType
        });
      });
      return arr;
    },
    getAccessoryInfo(datas) {
      Promise.all(this.getAccessory(datas)).then(res => {
        this.files = [...res[0], ...res[1]];
        this.loading = false;
      });
    },
    getAccessory(datas) {
      this.loading = true;
      const promiseAll = [];

      const fileList = new Promise((resolve, reject) => {
        let arr = [];
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

      const videoList = new Promise((resolve, reject) => {
        let arr = [];
        axios
          .get(
            `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/relations`,
            {
              params: {
                ...datas,
                fromType: 1,
                toType: this.videoToType,
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
              arr = this.iotDevice(rtn);
              resolve(arr);
            }
          })
          .catch(Error => {
            reject(Error);
          });
      });

      promiseAll.push(fileList);
      promiseAll.push(videoList);
      return promiseAll;
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
