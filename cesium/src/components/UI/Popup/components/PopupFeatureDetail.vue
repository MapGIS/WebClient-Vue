<template>
  <mapgis-ui-window-wrapper :visible="showDetail">
    <mapgis-ui-window
      class="popup-detail-wrapper"
      ref="popupDetailWindow"
      @window-size="onResize"
      @update:visible="closePopup"
      :visible.sync="showDetail"
      :min-width="320"
      :min-height="90"
      :max-height="getMaxHeight"
      anchor="top-right"
      :verticalOffset="100"
      :horizontalOffset="50"
      :fullScreenAction="false"
      :dragRange="false"
      title="详细信息"
    >
      <mapgis-3d-popup-iot
        :properties="properties"
        :dataStoreIp="dataStoreIp"
        :dataStorePort="dataStorePort"
        :dataStoreDataset="dataStoreDataset"
        :getProjectorStatus="getProjectorStatus"
        :showAccessory="false"
      />
      <div class="popup-accessory-content" v-if="Euid && showAccessoryInfo">
        <div class="accessory-title">附件</div>
        <div
          class="accessory-content"
          v-for="(accessory, index) in fileData"
          :key="index"
        >
          <div
            class="accessory-title second-title"
            v-if="accessory.list.length > 0"
          >
            {{ accessory.title }}
          </div>
          <mapgis-ui-file-preview
            v-if="accessory.list.length > 0"
            class="accessory-preview-list"
            :isList="true"
            :files="accessory.list"
            :isPopupFeatureDetail="true"
            :bordered="false"
            @project-screen="projectScreen"
          />
        </div>
      </div>
    </mapgis-ui-window>
  </mapgis-ui-window-wrapper>
</template>

<script>
import axios from "axios";
const fileType = {
  video: ["mp4", "avi", "pcx", "ogg", "m3u8", "webm", "hls"],
  image: ["jpg", "png"],
  text: [
    // 'doc', 'docx', 'xls', 'xlsx',
    "pdf"
  ]
};

export default {
  name: "mapgis-3d-popup-feature-detail",
  inject: ["getProjectorStatus"],
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
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1"
    },
    toTypes: {
      type: Array,
      default: () => [101, 301]
    }
  },
  data() {
    return {
      fileData: [],
      showAccessoryInfo: false,
      showDetail: true
    };
  },
  // mounted() {
  //   this.getAccessoryData();
  // },
  computed: {
    Euid() {
      return this.properties.Euid;
    },
    getMaxHeight() {
      return window.innerHeight - 300;
    }
  },
  watch: {
    Euid: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.getAccessoryData();
        }
      }
    }
  },
  methods: {
    handleBackMain() {},
    onResize() {},
    closePopup() {
      this.$emit("close-popup-window");
    },
    getAccessoryData() {
      this.showAccessoryInfo = false;
      const promises = [];
      this.toTypes.forEach(item => {
        const promise = new Promise((resolve, reject) => {
          axios
            .get(
              `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/relations`,
              {
                params: {
                  fromID: this.Euid,
                  fromType: 1,
                  toType: item,
                  pageNo: 1,
                  pageSize: 99
                }
              }
            )
            .then(res => {
              if (res.status === 200) {
                let arr = [];
                const {
                  data: { total, rtn }
                } = res.data;
                if (rtn) {
                  switch (item) {
                    case 101:
                      arr = this.fileDataStore(rtn);
                      break;
                    case 301:
                      arr = this.iotDevice(rtn);
                      break;
                    default:
                      break;
                  }
                }
                resolve(arr);
              } else {
                reject();
              }
            })
            .catch(e => reject(e));
        });
        promises.push(promise);
      });
      Promise.all(promises).then(result => {
        const fileList = result[0].concat(result[1]);
        if (fileList.length > 0) {
          this.showAccessoryInfo = true;
        }
        this.fileData = this.getFileGroup(fileList);
      });
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
          ownner: "supply",
          url
        });
      });
      return arr;
    },
    projectScreen(file) {
      this.$emit("project-screen", file);
    },
    getFileGroup(fileList) {
      const rules = {
        image: "图片类型",
        video: "多媒体类型",
        text: "文本类型",
        supply: "可投放类型"
      };
      const candidateRule = {
        other: "其他类型"
      };
      const files = this.getFileGroupByType(fileList, rules, candidateRule);
      return files;
    },
    getFileGroupByType(fileList, rules, candidateRule) {
      let files = [];
      rules = { ...rules, ...candidateRule };
      Object.keys(rules).forEach(key => {
        const list = {
          title: rules[key],
          list: []
        };
        files.push(list);
      });
      if (fileList.length > 0) {
        fileList.forEach(item => {
          let suffix;
          if (!item.type) {
            const type = this.getFileTypeByName(item.name);
            Object.keys(fileType).forEach(key => {
              if (fileType[key].includes(type)) {
                suffix = key;
                return;
              }
            });
            if (!suffix) {
              Object.keys(candidateRule).forEach(candidate => {
                suffix = candidate;
              });
            }
          } else {
            suffix = item.ownner;
          }

          const typeList = files.find(
            itemType => itemType.title === rules[suffix]
          );
          typeList.list.push(item);
        });
      }
      return files;
    },
    getFileTypeByName(name) {
      const typeArr = name.split(".");
      if (typeArr && typeArr.length > 1) {
        return typeArr[1];
      }
      return "";
    }
  }
};
</script>

<style lang="less" scoped>
.popup-detail-wrapper {
  width: 320px;
  .accessory-title {
    font-size: 15px;
    color: var(--text-color);
    font-weight: bold;
    margin-top: 8px;
  }
  .second-title {
    padding-left: 10px;
    font-size: 14px;
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .item-content {
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mapgis-ui-list-items > li:last-child {
    border-bottom: 1px solid var(--border-color-split);
  }
  .accessory-preview-list {
    /deep/.mapgis-ui-table-body {
      max-height: none !important;
      overflow: unset !important;
    }
  }
}
</style>
