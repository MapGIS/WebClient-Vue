<template>
  <div class="mapgis-3d-relationship-graph">
    <mapgis-ui-spin :spinning="loading">
      <mapgis-ui-setting-form :layout="'inline'" size="default">
        <mapgis-ui-form-item label="建筑面积:">
          <mapgis-ui-input-number-addon
            v-model="queryParams.jzmj"
            :min="0"
            :step="10"
            addon-after="㎡(及以上)"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="套内建筑面积:">
          <mapgis-ui-input-number-addon
            v-model="queryParams.tnjzmj"
            :min="0"
            :step="10"
            addon-after="㎡(及以上)"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="分摊系数:">
          <mapgis-ui-input-number-addon
            v-model="queryParams.ftxs"
            :min="0"
            :max="1"
            :step="0.1"
            addon-after="(及以上)"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="分摊建筑面积:">
          <mapgis-ui-input-number-addon
            v-model="queryParams.ftjzmj"
            :min="0"
            :step="10"
            addon-after="㎡(及以上)"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item>
          <mapgis-ui-button @click="filterGraphData">查询</mapgis-ui-button>
        </mapgis-ui-form-item>
        <mapgis-ui-form-item>
          <mapgis-ui-button @click="resizeQueryparams">重置</mapgis-ui-button>
        </mapgis-ui-form-item>
      </mapgis-ui-setting-form>
      <div id="relationship" class="relationship-graph" />
    </mapgis-ui-spin>
  </div>
</template>
<script>
import G6 from "@antv/g6/build/g6";
import Hierarchy from "@antv/hierarchy";
import axios from "axios";

export default {
  name: "mapgis-3d-relationship-graph",
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      queryParams: {
        jzmj: undefined,
        tnjzmj: undefined,
        ftxs: undefined,
        ftjzmj: undefined
      },
      relationshipList: [], // 存放节点之间关系
      graphData: [], // 存放接口获取数据graphValues
      householdTooltipConfig: [
        "不动产单元号",
        "分摊建筑面积",
        "分摊系数",
        "备注",
        "套内建筑面积",
        "室号部位",
        "层号",
        "建筑面积",
        "户号",
        "房屋坐落"
      ], // 房屋展示数据配置
      floorTooltipConfig: [
        "分摊建筑面积",
        "地上层数",
        "地下层数",
        "坐落",
        "备注",
        "套内建筑面积",
        "小区名称",
        "幢ID",
        "建筑面积",
        "总层数",
        "栋号",
        "竣工日期",
        "项目名称"
      ], // 楼幢展示数据配置
      isLock: false, // 查询结果高亮
      // 图表配置信息
      edgeLabelCfgHighlight: {
        refY: 15,
        style: {
          lineWidth: 5,
          fill: "#099"
        }
      },
      edgeLabelCfgNormal: {
        refY: 15,
        style: {
          lineWidth: 5,
          fill: "#ccc"
        }
      },
      nodeStateStyles: {
        highlight: {
          opacity: 1
        },
        dark: {
          opacity: 0.2
        }
      },
      edgeStateStyles: {
        highlight: {
          stroke: "#099"
        }
      },
      // 楼栋节点样式
      householdStyle: {
        fill: "#128b4e",
        stroke: "#128b4e"
      },
      // l楼层节点样式
      floorStyle: {
        fill: "#ff9900",
        stroke: "#ffc20e"
      },
      // layout配置信息
      layoutConfig: {
        direction: "LR", // H / V / LR / RL / TB / BT
        nodeSep: 50,
        rankSep: 150
      },
      // 节点基本配置
      // 楼层颜色#ffc168
      nodeDefualtConfig: {
        size: 26,
        normal: {
          fill: "#40a9ff",
          stroke: "#096dd9"
        },
        labelCfg: {
          style: {
            fill: "#fff",
            fontSize: this.info.isFloor ? 13 : 10
          }
        }
      },
      // 边基本配置信息
      edgeDefualtConfig: {
        shape: "quadratic",
        style: {
          stroke: "#A3B1BF",
          endArrow: {
            path: "M 4,0 L -4,-4 L -4,4 Z",
            d: 20
          }
        }
      },
      // 图表初始大小
      graphWidth: 980,
      graphHeight: 700,
      // 记录图表窗口是否最大化
      graphMax: false
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const that = this;
      // 取消搜索后的锁定
      that.isLock = false;
      that.resizeQueryparams();
      this.getGraphData().then(res => {
        const data = that.formatData(res.graphValues);
        that.graphData = res.graphValues;
        that.initGraph(data);
      });
    },
    initGraph(data) {
      const that = this;
      // 重新渲染
      if (that.graph) {
        that.graph.destroy();
        that.removeTooltip();
      }
      that.graph = new G6.TreeGraph({
        container: "relationship",
        width: that.graphWidth,
        height: that.graphHeight,
        pixelRatio: 2,
        linkCenter: true,
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            // 点提示框交互工具的配置
            {
              type: "tooltip",
              formatText(model) {
                let text = [];
                const data = model.properties;
                // js遍历对象是无序的，指定tooltip展示顺序
                if (model.entityName === "房屋") {
                  for (let i = 0; i < that.householdTooltipConfig.length; i++) {
                    text.push(
                      `<strong>${that.householdTooltipConfig[i]}</strong>: ${
                        data[that.householdTooltipConfig[i]]
                      }`
                    );
                  }
                } else if (model.entityName === "楼幢") {
                  for (let i = 0; i < that.floorTooltipConfig.length; i++) {
                    text.push(
                      `<strong>${that.floorTooltipConfig[i]}</strong>: ${
                        data[that.floorTooltipConfig[i]]
                      }`
                    );
                  }
                } else {
                  // 对象中只有一个key时直接遍历
                  for (let key in data) {
                    const element = data[key];
                    text.push(`<strong>${key}</strong>: ${element}`);
                  }
                }
                // .g6-node-tooltip中的字体颜色已被设置为最高优先级无法再次设置，再加一层div
                return `<div class='tooltip-content' style='color:#fff !important'>${text.join(
                  "<br />"
                )}</div>`;
              },
              shouldUpdate: e => {
                return true;
              }
            }
            // 边提示框交互工具的配置
            // {
            //   type: "edge-tooltip",
            //   formatText(model) {
            //     const text =
            //       "source: " +
            //       model.source +
            //       "<br/> target: " +
            //       model.target +
            //       "<br/> weight: " +
            //       model.weight;
            //     return text;
            //   },
            //   shouldUpdate: e => {
            //     return true;
            //   }
            // }
          ]
        },
        nodeStateStyles: that.nodeStateStyles,
        edgeStateStyles: that.edgeStateStyles,
        layout: function layout(data) {
          var result = Hierarchy.dendrogram(data, that.layoutConfig);
          G6.Util.radialLayout(result);
          return result;
        }
      });

      that.graph.node(function(node) {
        return {
          size: that.getNodeSize(node),
          style: node.styleInfo || that.nodeDefualtConfig.normal,
          labelCfg: that.nodeDefualtConfig.labelCfg,
          label: node.name || node.entityName
        };
      });

      that.graph.edge(function(edge) {
        const arr = edge.id.split(":");
        const relation = that.relationshipList.find(
          item => item.src === arr[0] && item.dst === arr[1]
        );
        edge.label = relation ? relation.relationshipName : "包含";
        edge.labelCfg = that.edgeLabelCfgNormal;
        return that.edgeDefualtConfig;
      });

      that.graph.on("node:mouseenter", function(e) {
        if (that.isLock) return;
        const item = e.item;

        that.graph.setAutoPaint(false);
        that.graph.getNodes().forEach(function(node) {
          that.graph.clearItemStates(node);
          that.graph.setItemState(node, "dark", true);
        });
        that.graph.setItemState(item, "dark", false);
        that.graph.setItemState(item, "highlight", true);
        that.graph.getEdges().forEach(function(edge) {
          if (edge.getSource() === item) {
            that.graph.setItemState(edge.getTarget(), "dark", false);
            that.graph.setItemState(edge.getTarget(), "highlight", true);
            that.graph.setItemState(edge, "highlight", true);
            highlightFont(edge);
          } else if (edge.getTarget() === item) {
            that.graph.setItemState(edge.getSource(), "dark", false);
            that.graph.setItemState(edge.getSource(), "highlight", true);
            that.graph.setItemState(edge, "highlight", true);
            highlightFont(edge);
          } else {
            that.graph.setItemState(edge, "highlight", false);
          }
        });
        that.graph.paint();
        that.graph.setAutoPaint(true);
      });

      that.graph.on("node:click", function(e) {
        const data = e.item.getModel();
        if (data.entityName === "楼层") {
          if (!that.info.isFloor) {
            that.highlightFloor(data.id);
          }
        } else if (data.entityName === "房屋") {
          that.highlighthouse(data.properties);
        }
      });

      function clearAllStats() {
        if (that.isLock) return;
        that.graph.setAutoPaint(false);
        that.graph.getNodes().forEach(function(node) {
          that.graph.clearItemStates(node);
        });
        that.graph.getEdges().forEach(function(edge) {
          that.graph.clearItemStates(edge);
          resizeFont(edge);
        });
        that.graph.paint();
        that.graph.setAutoPaint(true);
      }

      function highlightFont(edge) {
        that.graph.updateItem(edge, {
          labelCfg: that.edgeLabelCfgHighlight
        });
      }

      function resizeFont(edge) {
        that.graph.updateItem(edge, {
          labelCfg: that.edgeLabelCfgNormal
        });
      }
      that.graph.on("node:mouseleave", clearAllStats);
      that.loading = false;

      that.graph.data(data);
      that.graph.render();
      that.graph.fitView();
      that.graph.translate(-50, 0);
    },
    getGraphData() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        axios
          .post(
            `http://${this.info.dataStoreIp}:${this.info.dataStorePort}/datastore/rest/services/dataset/nebula/${this.info.dataStoreDataset}/knowledgeGraph/graph/query?type=graphRelationType`,
            {
              id: this.info.floor,
              pageOffset: 0,
              step: 3,
              relationshipTypes: ["*"],
              direction: "Both",
              usePaging: false
            }
          )
          .then(res => {
            res.status === 200 ? resolve(res.data) : reject();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    formatData(dataList) {
      const floor = this.info.isFloor
        ? this.formatFloor(dataList)
        : this.formatHosehold(dataList);
      return floor;
    },
    // 过滤逻辑
    /* formatFloor(dataList, queryParams) {
      const floor = dataList.find(item => item.id === this.info.floor);
      // 存放节点关系
      this.relationshipList = dataList.filter(item => item.relationshipName);
      const children = [];
      // 获取根节点的下一级id数组
      const householdList = [];
      this.relationshipList.forEach(item => {
        if (item.src && item.src === this.info.floor) {
          if (JSON.stringify(queryParams) !== "{}") {
            const floor = dataList.find(home => home.id === item.dst);
            const flag = this.getConditionResult(floor, queryParams);
            flag && householdList.push(item.dst);
          } else {
            householdList.push(item.dst);
          }
        }
      });

      dataList.forEach(item => {
        if (householdList.includes(item.id)) {
          item.name = item.properties["室号部位"];
          children.push(item);
        }
      });
      floor.children = children;
      return floor;
    }, */

    // 高亮逻辑
    formatFloor(dataList) {
      const floor = dataList.find(item => item.id === this.info.floor);
      floor.name = floor.properties["楼层号"];
      floor.styleInfo = this.floorStyle;
      // 存放节点关系
      this.relationshipList = dataList.filter(item => item.relationshipName);
      const children = [];
      // 获取根节点的下一级id数组
      const householdList = [];
      this.relationshipList.forEach(item => {
        if (item.src === floor.id) {
          householdList.push(item.dst);
        }
      });

      dataList.forEach(item => {
        if (householdList.includes(item.id)) {
          item.name = item.properties["室号部位"];
          children.push(item);
        }
      });
      floor.children = children;
      return floor;
    },
    // 过滤逻辑
    /* formatHosehold(dataList) {
      const floor = dataList.find(item => item.id === this.info.floor);
      floor.name = floor.properties["栋号"];
      floor.styleInfo = {
        fill: "#128b4e",
        stroke: "#128b4e"
      };

      // 存放节点关系
      this.relationshipList = dataList.filter(item => item.src);
      let children = [];
      // 获取根节点的下一级id数组
      let householdList = dataList.filter(item => item.entityName === "楼层");

      householdList.forEach(item => {
        this.getFloorNext(item, dataList, this.formatQueryParams());
      });

      // 根据isFloor判断当前展示的是楼栋还是楼层
      householdList.forEach(item => {
        item.name = item.properties["楼层号"];
        (item.styleInfo = {
          fill: "#40a9ff",
          stroke: "#096dd9"
        }),
          children.push(item);
      });
      floor.children = children;
      return floor;
    }, */

    // 高亮逻辑
    formatHosehold(dataList) {
      const floor = dataList.find(item => item.id === this.info.floor);
      floor.name = floor.properties["栋号"];
      floor.styleInfo = this.householdStyle;

      // 存放节点关系
      this.relationshipList = dataList.filter(item => item.src);
      let children = [];
      // 获取根节点的下一级id数组
      let householdList = dataList.filter(item => item.entityName === "楼层");

      householdList.forEach(item => {
        this.getFloorNext(item, dataList);
      });

      // 根据isFloor判断当前展示的是楼栋还是楼层
      householdList.forEach(item => {
        item.name = item.properties["楼层号"];
        item.styleInfo = this.floorStyle;
        children.push(item);
      });
      floor.children = children;
      return floor;
    },
    // 获取楼层下级
    getFloorNext(data, dataList) {
      if (!dataList.find(item => item.src === data.id)) return;
      const list = dataList.filter(item => item.src === data.id);
      let floorList = [];
      list.forEach(item => {
        const floor = dataList.find(home => home.id === item.dst);
        floorList.push(floor);

        // 过滤逻辑
        // if (JSON.stringify(queryParams) !== "{}") {
        //   const flag = this.getConditionResult(floor, queryParams);
        //   flag && floorList.push(floor);
        // } else {
        //   floorList.push(floor);
        // }
      });
      floorList.forEach(item => (item.name = item.properties["室号部位"]));
      data.children = floorList;
      floorList.forEach(item => this.getFloorNext(item, dataList));
    },
    // 获取有效查询条件
    formatQueryParams() {
      let obj = {};
      for (let key in this.queryParams) {
        this.queryParams[key] && (obj[key] = this.queryParams[key]);
      }
      return obj;
    },
    getConditionResult(floor, queryParams) {
      let flag = true;
      if (queryParams.jzmj) {
        flag = flag && floor.properties["建筑面积"] >= queryParams.jzmj;
      }

      if (queryParams.tnjzmj) {
        flag = flag && floor.properties["套内建筑面积"] >= queryParams.tnjzmj;
      }

      if (queryParams.ftxs) {
        flag = flag && floor.properties["分摊系数"] >= queryParams.ftxs;
      }

      if (queryParams.ftjzmj) {
        flag = flag && floor.properties["分摊建筑面积"] >= queryParams.ftjzmj;
      }
      return flag;
    },
    filterGraphData() {
      if (JSON.stringify(this.formatQueryParams()) !== "{}") {
        this.isLock = true;
        this.highlightSerachData();
      } else {
        this.isLock = false;
        this.resizeGraphNodes();
        // this.initGraph(this.formatData(this.graphData));
      }
    },
    highlightSerachData() {
      let floorList = [];
      let params = this.formatQueryParams();
      // 判断根节点是楼层还是楼栋
      if (this.info.isFloor) {
        // 获取楼层对应的房屋关系列表
        const householdList = this.graphData.filter(
          item => item.src && item.src === this.info.floor
        );
        householdList.forEach(item => {
          const household = this.graphData.find(house => house.id === item.dst);
          const flag = this.getConditionResult(household, params);
          flag && floorList.push(household);
        });
      } else {
        const floors = this.graphData.filter(
          item => item.entityName === "房屋"
        );
        floorList = floors.filter(item => {
          return this.getConditionResult(item, params);
        });
      }

      if (floorList.length > 0) {
        this.setHighlightStyle(floorList);
      } else {
        // 获取的节点为空时全部置灰
        this.setDarkStyle();
      }
    },
    // 置灰
    setDarkStyle() {
      const that = this;
      that.graph.setAutoPaint(false);
      that.graph.getNodes().forEach(function(node) {
        that.graph.clearItemStates(node);
        that.graph.setItemState(node, "dark", true);
        // 获取边
        const edges = node.getEdges();
        edges.forEach(edge => {
          // 设置边
          that.graph.setItemState(edge, "highlight", false);
          // 设置字体
          that.graph.updateItem(edge, {
            labelCfg: that.edgeLabelCfgNormal
          });
        });
      });
      that.graph.paint();
      that.graph.setAutoPaint(true);
    },
    // 重置状态
    resizeGraphNodes() {
      const that = this;
      that.graph.setAutoPaint(false);
      that.graph.getNodes().forEach(function(node) {
        that.graph.clearItemStates(node);
        // 获取边
        const edges = node.getEdges();
        edges.forEach(edge => {
          // 设置边
          that.graph.setItemState(edge, "highlight", false);
          // 设置字体
          that.graph.updateItem(edge, {
            labelCfg: that.edgeLabelCfgNormal
          });
        });
      });
      that.graph.paint();
      that.graph.setAutoPaint(true);
    },
    // 高亮节点和边
    setHighlightStyle(highlightList) {
      const that = this;
      // 先置灰全部
      that.setDarkStyle();
      that.graph.setAutoPaint(false);
      highlightList.forEach(item => {
        // 高亮节点
        const node = that.graph.findById(item.id);
        that.graph.setItemState(node, "highlight", true);
        // 获取父节点
        const parentNode = node.get("parent");
        that.graph.setItemState(parentNode, "highlight", true);
        // 获取边
        const edges = node.getEdges();
        edges.forEach(edge => {
          // 设置边
          that.graph.setItemState(edge, "highlight", true);
          // 设置字体
          that.graph.updateItem(edge, {
            labelCfg: that.edgeLabelCfgHighlight
          });
        });
      });
      that.graph.paint();
      that.graph.setAutoPaint(true);
    },
    resizeQueryparams() {
      this.queryParams = {
        jzmj: undefined,
        tnjzmj: undefined,
        ftxs: undefined,
        ftjzmj: undefined
      };
    },
    highlightFloor(id) {
      this.$emit("floor-highlight", {
        guid: id,
        layerIndex: this.getLayerIndex(id)
      });
    },
    getLayerIndex(id) {
      const data = this.info.layerTree.find(item => item.guid === id);
      return data.layerIndex;
    },
    highlighthouse(data) {
      this.$emit("house-highlight", {
        layerIndex: data["层号"] - 1,
        oid: data.oid
      });
    },
    getNodeSize(node) {
      let size;
      switch (node.entityName) {
        case "楼幢":
          size = 38;
          break;
        case "楼层":
          size = 30;
          break;
        default:
          size = this.nodeDefualtConfig.size;
          break;
      }
      return size;
    },
    // 图表自适应
    resizeGraph() {
      if (!this.graphMax) {
        const dom = document.getElementById("relationship");
        this.graph.changeSize(dom.offsetWidth, dom.offsetHeight);
      } else {
        this.graph.changeSize(this.graphWidth, this.graphHeight);
      }
      this.graphMax = !this.graphMax;
      this.graph.render();
      this.graph.fitView();
      this.graph.translate(-50, 0);
    },
    // 清除tooltip框
    removeTooltip() {
      let tooltip = document.getElementsByClassName("g6-tooltip");
      if (tooltip && tooltip.length > 0) {
        for (let i = tooltip.length - 1; i >= 0; i--) {
          tooltip[i].remove();
        }
      }
    }
  }
};
</script>
<style lang="less">
.mapgis-3d-relationship-graph {
  min-width: 980px;
  min-height: 700px;
  .relationship-graph {
    .g6-tooltip {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      //   color: #545454;
      padding: 10px 8px;
      //   box-shadow: rgb(174, 174, 174) 0px 0px 10px;
      border: 1px solid #545454;
      white-space: normal;
      word-break: break-all;
      overflow: hidden;
    }
    .g6-node-tooltip {
      position: absolute;
      top: 0 !important;
      right: 8px !important;
      left: 80% !important;
      //   visibility: inherit !important;
    }
  }
  .mapgis-ui-input-auto-width {
    background-color: rgba(20, 20, 20, 0.3) !important;
  }
}
</style>
