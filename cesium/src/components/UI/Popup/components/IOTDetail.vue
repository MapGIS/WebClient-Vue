<template>
  <mapgis-ui-spin :spinning="loading">
    <div v-if="toType == 501" class="iot-detail-graph-tool-panel">
      <mapgis-ui-select-panel
        label="关系图类型"
        :selectOptions="{
          force: '力引导布局',
          circular: '环形布局'
        }"
        v-model="graphType"
      ></mapgis-ui-select-panel>
    </div>
    <div
      v-if="toType == 501"
      id="echarts-graph"
      class="iot-detail-graph-chart-panel"
    ></div>
    <div class="iot-detail-title" v-if="toType != 501">
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
      @project-screen="projectScreen"
      v-if="toType != 501"
    />
    <div class="iot-detail-pagination" v-if="toType != 501">
      <mapgis-ui-pagination
        size="small"
        v-model="current"
        show-size-changer
        :page-size.sync="pageSize"
        :total="total"
      />
    </div>
  </mapgis-ui-spin>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";

export default {
  name: "IotDetail",
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
      current: 1,
      pageSize: 10,
      total: 0,
      files: [],
      loading: false,
      graphType: "force"
    };
  },
  watch: {
    graphType(val) {
      this.genGraph(val);
    }
  },
  mounted() {
    if (this.toType == 501) {
      this.genGraph(this.graphType);
      return;
    }
    this.getData();
  },
  methods: {
    async getData() {
      let arr = [];
      this.loading = true;
      try {
        const res = await axios.get(
          `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/relations`,
          {
            params: {
              fromID: this.Euid,
              fromType: 1,
              toType: this.toType,
              pageNo: this.current,
              pageSize: this.pageSize
            }
          }
        );
        if (res.status === 200) {
          const {
            data: { total, rtn }
          } = res.data;
          this.total = total;
          if (rtn) {
            switch (this.toType) {
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
        }
      } catch (error) {
      } finally {
        this.files = arr;
        this.loading = false;
      }
    },
    formatter(json) {
      let result = { categories: [], nodes: [], links: [] };
      json.graphValues.forEach((item, idx) => {
        if (item.entityName) {
          if (result.categories.indexOf(item.entityName) == -1) {
            result.categories.push(item.entityName);
          }
          item.category = result.categories.indexOf(item.entityName);
          result.nodes.push(item);
        } else if (item.relationshipName) {
          result.links.push({
            source: item.src,
            target: item.dst
          });
        }
      });
      return result;
    },
    genGraph(type) {
      const vm = this;
      this.loading = true;
      var dom = document.getElementById("echarts-graph");
      let graphChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false,
        width: 480,
        height: 480
      });
      let option;
      graphChart.showLoading();
      axios
        .post(
          `http://${this.dataStoreIp}:${this.dataStorePort}/datastore/rest/services/dataset/nebula/${this.dataStoreDataset}/knowledgeGraph/graph/query?type=graphRelationType`,
          {
            id: this.Euid,
            pageSize: this.pageSize,
            pageOffset: 0,
            step: 3,
            relationshipTypes: ["*"],
            direction: "Both",
            usePaging: false
          }
        )
        .then(res => {
          // console.log("res", res);
          let webkitDep = vm.formatter(res.data);
          // console.log("webkitDep", webkitDep);

          graphChart.hideLoading();
          let categories = webkitDep.categories;
          webkitDep.categories = webkitDep.categories.map(cat => {
            cat = {
              name: cat
            };
            return cat;
          });
          option = {
            tooltip: {
              position: "right",
              formatter: function(params) {
                for (var key in params.data.properties) {
                  if (params.data.properties[key] == null) {
                    delete params.data.properties[key];
                  }
                }
                let label = JSON.stringify(params.data.properties);
                if (!label) return;
                label = label.replaceAll('":', "：");
                label = label.replaceAll(/{|}|"|'/g, "");
                let arr = label.split(",");
                let res = arr.join("<br>");
                return res;
              }
            },
            legend: {
              data: categories,
              textStyle: {
                color: "#fff"
              }
            },
            animationDuration: 1500,
            animationEasingUpdate: "quinticInOut",
            series: [
              {
                type: "graph",
                layout: type,
                roam: true,
                categories: webkitDep.categories,
                links: webkitDep.links,
                label: {
                  position: "right",
                  formatter: "{b}"
                },
                emphasis: {
                  focus: "adjacency",
                  lineStyle: {
                    width: 10
                  }
                }
              }
            ]
          };
          switch (type) {
            case "force":
              option.series[0].force = {
                repulsion: 100
              };
              // option.series[0].draggable = true;
              option.series[0].data = webkitDep.nodes.map(function(node, idx) {
                if (node.id == vm.Euid) {
                  node.symbolSize = 15;
                } else {
                  node.symbolSize = 7;
                }
                return node;
              });
              break;
            case "circular":
              option.series[0].data = webkitDep.nodes.map(function(node, idx) {
                if (node.id == vm.Euid) {
                  node.symbolSize = 15;
                } else {
                  node.symbolSize = 7;
                }
                return node;
              });
              option.series[0].lineStyle = {
                color: "target",
                curveness: 0.3
              };
              break;
            case "none":
              option.series[0].label.show = true;
              option.series[0].labelLayout = {
                hideOverlap: true
              };
              option.series[0].lineStyle = {
                color: "target",
                curveness: 0.3
              };
              option.series[0].data = webkitDep.nodes.map(function(node, idx) {
                if (node.id == vm.Euid) {
                  node.symbolSize = 12;
                  node.x = 0;
                  node.y = 0;
                } else {
                  node.symbolSize = 5;
                  switch (node.category) {
                    case 0:
                      node.x = Math.random() * 10 + 1;
                      node.y = Math.random() * 10 + 1;
                      break;
                    case 1:
                      node.x = -Math.random() * 10 + 1;
                      node.y = Math.random() * 10 + 1;
                      break;
                    case 2:
                      node.x = Math.random() * 10 + 1;
                      node.y = -Math.random() * 10 + 1;
                      break;
                    case 3:
                      node.x = -Math.random() * 10 + 1;
                      node.y = -Math.random() * 10 + 1;
                      break;
                  }
                }
                return node;
              });
              break;
          }
          try {
            graphChart.setOption(option, {
              notMerge: true
            });
          } catch (e) {
            console.log("setOptionError", e);
          }
          window.addEventListener("resize", graphChart.resize);
          vm.loading = false;
        });
    },

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
    }
  }
};
</script>

<style lang="css" scoped>
.iot-detail-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.iot-detail-pagination {
  text-align: right;
  margin-top: 10px;
}
.iot-detail-graph-tool-panel {
  padding: 10px 50px;
}
.iot-detail-graph-chart-panel {
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
