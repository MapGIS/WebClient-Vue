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
          <mapgis-ui-button style="margin-left:8px" @click="resizeQueryparams"
            >重置</mapgis-ui-button
          >
        </mapgis-ui-form-item>
      </mapgis-ui-setting-form>
      <mapgis-ui-setting-form :layout="'inline'" size="default">
        <mapgis-ui-form-item label="图谱类型:">
          <mapgis-ui-space slot="extra" class="mapgis-relationship-icons">
            <mapgis-ui-tooltip v-for="(m, i) in relationshipTypeList" :key="i">
              <template slot="title">{{ m.title }}</template>
              <mapgis-ui-iconfont
                :class="{ active: m.active }"
                :type="m.icon"
                @click="handleSelectChange(m)"
              />
            </mapgis-ui-tooltip>
          </mapgis-ui-space>
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="" v-show="showRevert">
          <mapgis-ui-button @click="goBack">返回</mapgis-ui-button>
        </mapgis-ui-form-item>
      </mapgis-ui-setting-form>
      <div class="relationship-graph" id="relationship-graph">
        <div id="relationship" class="relationship-graph-left" />
        <div
          v-show="showTooltip"
          class="relationship-graph-right"
          :style="{
            width: tooltipWidth + 'px',
            maxHeight: tooltipHeight + 'px'
          }"
        >
          <mapgis-ui-iconfont
            class="right-close"
            type="mapgis-close"
            @click="() => (tooltipInfo = undefined)"
          />
          <div class="right-content" v-html="tooltipInfo" />
          <div class="right-accessory" v-show="showAccessory">
            <relation-accessory
              ref="detailInfo"
              :toType="toType"
              :dataStoreIp="info.dataStoreIp"
              :dataStorePort="info.dataStorePort"
              :dataStoreDataset="info.dataStoreDataset"
              @project-screen="projectScreen"
            />
          </div>
        </div>
      </div>
    </mapgis-ui-spin>
  </div>
</template>
<script>
import G6 from "@antv/g6/build/g6";
import Hierarchy from "@antv/hierarchy";
import axios from "axios";
import RelationAccessory from "./RelationAccessory.vue";

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from "echarts/core";
// 引入Graph图表
import { GraphChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  // TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 注册必须的组件
echarts.use([
  TitleComponent,
  // TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  GraphChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default {
  name: "mapgis-3d-relationship-graph",
  components: { RelationAccessory },
  provide() {
    return {
      getProjectorStatus: this.getProjectorStatus
    };
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    relationshipConfig: {
      type: Object,
      default: () => {}
    },
    getProjectorStatus: {
      type: Function,
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
      obligeeTooltipConfig: [
        "权利人名称",
        "权利人性质",
        "性别",
        "民族",
        "出生日期",
        "地址",
        "籍贯",
        "电话",
        "证件种类",
        "法人代表",
        "备注"
      ], // 权利人展示数据配置
      isLock: false, // 查询结果高亮
      // 图表配置信息
      edgeLabelCfgHighlight: {
        refY: 15,
        style: {
          lineWidth: 5,
          fill: "#099"
        }
      },
      edgeTreeLabelCfgHighlight: {
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
      edgeTreeLabelCfgNormal: {
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
      houseStyle: {
        fill: "#0077c8",
        stroke: "#ffc20e"
      },
      // 权利人节点样式
      obligeeStyle: {
        fill: "#7ac143",
        stroke: "#2a5934"
      },
      // layout配置信息
      layoutConfig: {
        direction: "LR", // H / V / LR / RL / TB / BT
        nodeSep: 50,
        rankSep: 150
      },
      layoutConfigFloor: {
        direction: "LR", // H / V / LR / RL / TB / BT
        nodeSep: 50,
        rankSep: 120
      },
      // 节点基本配置
      // 楼层颜色#ffc168
      nodeDefualtConfig: {
        size: 24,
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
      edgeTreeDefualtConfig: {
        shape: "cubic-horizontal",
        style: {
          stroke: "#A3B1BF"
        }
      },
      // 图表初始大小
      graphWidth: 980,
      graphHeight: 700,
      tooltipWidth: 235,
      tooltipHeight: 700,
      // 记录图表窗口是否最大化
      graphMax: false,
      tooltipInfo: undefined,
      showAccessory: false,
      // 当前展示信息的唯一标识
      currentShowId: undefined,
      relationshipTypeList: [
        {
          id: 1,
          title: "辐射树",
          icon: "mapgis-shoudaodegongxiang",
          type: undefined,
          active: true
        },
        {
          id: 2,
          title: "紧凑树",
          icon: "mapgis-fangtou",
          type: undefined,
          active: false
        },
        {
          id: 3,
          title: "力引导布局",
          icon: "mapgis-Xzhouxuanzhuan",
          type: "force",
          active: false
        },
        {
          id: 4,
          title: "环形布局",
          icon: "mapgis-bullseye",
          type: "circular",
          active: false
        }
      ],
      showRevert: false,
      currentType: 1,
      toType: 101,
      floorOptionList: [],
      // 紧凑树关闭的节点
      closedNode: []
    };
  },
  computed: {
    showTooltip() {
      return this.tooltipInfo;
    },
    currentFloor() {
      return this.floorOptionList[0] || undefined;
    },
    dataStore1TooltipField() {
      const tooltipField = this.relationshipConfig.dataStore1.detailField;
      const arr = tooltipField.split("，");
      return arr;
    },
    dataStore2TooltipField() {
      const tooltipField = this.relationshipConfig.dataStore2.detailField;
      const arr = tooltipField.split("，");
      return arr;
    },
    dataStore3TooltipField() {
      const tooltipField = this.relationshipConfig.dataStore3.detailField;
      const arr = tooltipField.split("，");
      return arr;
    },
    dataStore4TooltipField() {
      const tooltipField = this.relationshipConfig.dataStore4.detailField;
      const arr = tooltipField.split("，");
      return arr;
    }
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
      that.currentShowId = undefined;
      // 关闭tooltip提示框
      that.showAccessory = false;
      that.floorOptionList.push(that.info.floor);
      that.resizeQueryparams();
      that.getGraphData().then(res => {
        that.graphData = res.graphValues;
        switch (that.currentType) {
          case 1:
            that.initGraph(that.formatData(res.graphValues));
            break;
          case 2:
            that.initGraphTree(that.formatData(res.graphValues));
            break;
          case 3:
            that.initEchartsGraph(
              that.formatEchartsData(res),
              that.relationshipTypeList.find(
                item => item.id === that.currentType
              ).type || undefined
            );
            break;
          case 4:
            that.initEchartsGraph(
              that.formatEchartsData(res),
              that.relationshipTypeList.find(
                item => item.id === that.currentType
              ).type || undefined
            );
            break;
          default:
            break;
        }
      });
    },
    initGraph(data) {
      const that = this;
      // 重新渲染
      if (that.graph && that.graph._cfg) {
        that.graph.destroy();
        // that.removeTooltip();
      }
      if (that.graphChart) {
        that.graphChart.dispose();
      }
      that.graph = new G6.TreeGraph({
        container: "relationship",
        width: that.graphWidth,
        height: that.graphHeight,
        pixelRatio: 2,
        linkCenter: true,
        modes: {
          default: ["drag-canvas", "zoom-canvas"]
        },
        nodeStateStyles: that.nodeStateStyles,
        edgeStateStyles: that.edgeStateStyles,
        layout: function layout(data) {
          var result = that.info.isFloor
            ? Hierarchy.dendrogram(data, that.layoutConfigFloor)
            : Hierarchy.dendrogram(data, that.layoutConfig);
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
        edge.label = relation ? relation.relationshipName : "未知";
        edge.labelCfg = that.edgeLabelCfgNormal;
        return that.edgeDefualtConfig;
      });

      that.graph.on("node:mouseenter", function(e) {
        const model = e.item.get("model");
        if (that.currentShowId === model.id) return;
        this.currentShowId = model.id;
        that.tooltipInfo = that.formatText(e.item.get("model"));
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
        if (data.entityName === that.relationshipConfig.dataStore2.name) {
          // if (!that.info.isFloor) {
          //   that.highlightFloor(data.id);
          // }
          if (that.info.isFloor) return;
          that.showRevert = true;
          that.$emit("change-floor", { guid: data.id, isFloor: true });
        } else if (
          data.entityName === that.relationshipConfig.dataStore3.name
        ) {
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
      // that.graph.translate(-50, 0);
    },
    initGraphTree(data) {
      window.oncontextmenu = function(e) {
        //取消默认的浏览器自带右键 很重要！！
        e.preventDefault();
      };
      const that = this;
      // 重新渲染
      if (that.graph && that.graph._cfg) {
        that.graph.destroy();
      }
      if (that.graphChart) {
        that.graphChart.dispose();
      }
      that.graph = new G6.TreeGraph({
        container: "relationship",
        width: that.graphWidth,
        height: that.graphHeight,
        pixelRatio: 2,
        modes: {
          default: [
            // {
            //   type: "collapse-expand",
            //   onChange: function onChange(item, collapsed) {
            //     debugger;
            //     var data = item.get("model").data;
            //     data.collapsed = collapsed;
            //     return true;
            //   }
            // },
            "drag-canvas",
            "zoom-canvas"
          ]
        },
        defaultNode: that.nodeDefualtConfig,
        defaultEdge: {
          shape: "cubic-horizontal",
          style: {
            stroke: "#A3B1BF"
          }
        },
        nodeStateStyles: that.nodeStateStyles,
        edgeStateStyles: that.edgeStateStyles,
        layout: {
          type: "compactBox",
          direction: that.info.isFloor ? "LR" : "H",
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 5;
          },
          getHGap: function getHGap() {
            return 100;
          }
        }
      });

      that.graph.on("node:contextmenu", function(e) {
        if (that.isLock) return;
        const data = e.item.get("model");
        data.collapsed = !data.collapsed;
        that.graph.refreshLayout();
        that.closedNode.push(data.id);
      });
      that.graph.node(function(node) {
        return {
          size: that.getNodeSize(node),
          style: node.styleInfo || that.nodeDefualtConfig.normal,
          labelCfg: {
            ...that.nodeDefualtConfig.labelCfg
            // position:
            //   node.children && node.children.length > 0 ? "left" : "right"
          },
          label: node.name || node.entityName
        };
      });
      that.graph.edge(function(edge) {
        const arr = edge.id.split(":");
        const relation = that.relationshipList.find(
          item => item.src === arr[0] && item.dst === arr[1]
        );
        edge.label = relation ? relation.relationshipName : "未知";
        edge.labelCfg = that.edgeTreeLabelCfgNormal;
        return that.edgeTreeDefualtConfig;
      });

      that.graph.on("node:mouseenter", function(e) {
        const model = e.item.get("model");

        if (that.currentShowId === model.id) return;
        this.currentShowId = model.id;
        that.tooltipInfo = that.formatText(e.item.get("model"));
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
        if (data.entityName === that.relationshipConfig.dataStore2.name) {
          // if (!that.info.isFloor) {
          //   that.highlightFloor(data.id);
          // }
          if (that.info.isFloor) return;
          that.showRevert = true;
          that.$emit("change-floor", { guid: data.id, isFloor: true });
        } else if (
          data.entityName === that.relationshipConfig.dataStore3.name
        ) {
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
          labelCfg: that.edgeTreeLabelCfgHighlight
        });
      }

      function resizeFont(edge) {
        that.graph.updateItem(edge, {
          labelCfg: that.edgeTreeLabelCfgNormal
        });
      }

      that.graph.on("node:mouseleave", clearAllStats);

      that.loading = false;

      that.graph.data(data);
      that.graph.render();
      that.graph.fitView();
    },
    initEchartsGraph(webkitDep, type) {
      const that = this;
      if (that.graph && that.graph._cfg) {
        that.graph.destroy();
      }
      if (that.graphChart) {
        that.graphChart.dispose();
      }
      const dom = document.getElementById("relationship");
      that.graphChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false,
        width: that.graphWidth,
        height: that.graphHeight
      });
      let categories = [];
      webkitDep.categories.forEach(item => {
        const config = {
          name: item,
          textStyle: {
            fontWeight: "normal",
            color: "#fff"
          }
        };
        categories.push(config);
      });
      webkitDep.categories = webkitDep.categories.map(cat => {
        let color;
        if (cat === that.relationshipConfig.dataStore1.name) {
          color = that.householdStyle.fill;
        } else if (cat === that.relationshipConfig.dataStore2.name) {
          color = that.floorStyle.fill;
        } else if (cat === that.relationshipConfig.dataStore3.name) {
          color = that.houseStyle.fill;
        } else if (cat === that.relationshipConfig.dataStore4.name) {
          color = that.obligeeStyle.fill;
        }
        cat = {
          name: cat,
          itemStyle: {
            color
          }
        };
        return cat;
      });
      let option = {
        legend:
          type === "force"
            ? {
                data: categories
              }
            : {
                data: categories,
                orient: "vertical",
                x: "left", //可设定图例在左、右、居中
                y: "top" //可设定图例在上、下、居中
              },
        // animationDuration: 2500,
        // animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: type,
            roam: true,
            categories: webkitDep.categories,
            // links: webkitDep.links,
            label: {
              position: "right",
              formatter: "{b}"
            },
            emphasis: {
              focus: "adjacency"
            }
          }
        ]
      };
      option.series[0].links = webkitDep.links.map(function(link) {
        link.lineStyle = {
          opacity: 1
        };
        return link;
      });
      option.series[0].data = webkitDep.nodes.map(function(node, idx) {
        node.name = that.getEchartsNodeLabel(node);
        node.label = {
          show: type === "force" ? false : true,
          color: "#fff"
        };
        let color;
        if (node.entityName === that.relationshipConfig.dataStore1.name) {
          color = that.householdStyle.fill;
          node.symbolSize = 36;
        } else if (
          node.entityName === that.relationshipConfig.dataStore2.name
        ) {
          color = that.floorStyle.fill;
          node.symbolSize = 24;
        } else if (
          node.entityName === that.relationshipConfig.dataStore3.name
        ) {
          color = that.houseStyle.fill;
          node.symbolSize = 18;
        } else if (
          node.entityName === that.relationshipConfig.dataStore4.name
        ) {
          color = that.obligeeStyle.fill;
          node.symbolSize = 12;
        }
        node.itemStyle = { color, opacity: 1 };
        return node;
      });
      switch (type) {
        case "force":
          option.series[0].force = {
            repulsion: 100
          };
          break;
        case "circular":
          option.series[0].lineStyle = {
            color: "target",
            curveness: 0.3
          };
          option.series[0].circular = {
            rotateLabel: true
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
            if (node.id == that.Euid) {
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
        that.graphChart.setOption(option, {
          notMerge: true
        });
      } catch (e) {
        console.log("setOptionError", e);
      }
      // window.addEventListener("resize", that.graphChart.resize);
      that.graphChart.on("click", function(e) {
        const data = e.data;
        if (data.entityName === that.relationshipConfig.dataStore2.name) {
          // if (!that.info.isFloor) {
          //   that.highlightFloor(data.id);
          // }
          if (that.info.isFloor) return;
          that.showRevert = true;
          that.$emit("change-floor", { guid: data.id, isFloor: true });
        } else if (
          data.entityName === that.relationshipConfig.dataStore3.name
        ) {
          that.highlighthouse(data.properties);
        }
      });
      that.graphChart.on("mousemove", function(e) {
        const model = e.data;

        if (that.currentShowId === model.id) return;
        this.currentShowId = model.id;
        that.tooltipInfo = that.formatText(model);
      });

      that.loading = false;
    },
    getEchartsNodeLabel(node) {
      let label;
      const properties = node.properties;
      switch (node.entityName) {
        case this.relationshipConfig.dataStore1.name:
          label = properties[this.relationshipConfig.dataStore1.nodeName];
          break;
        case this.relationshipConfig.dataStore2.name:
          label = properties[this.relationshipConfig.dataStore2.nodeName];
          break;
        case this.relationshipConfig.dataStore3.name:
          label = properties[this.relationshipConfig.dataStore3.nodeName];
          break;
        case this.relationshipConfig.dataStore4.name:
          label = properties[this.relationshipConfig.dataStore4.nodeName];
          break;
      }
      return label;
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
              step: this.info.dataStoreStep || 2,
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
    formatEchartsData(json) {
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
      floor.name =
        floor.properties[this.relationshipConfig.dataStore2.nodeName];
      floor.styleInfo = this.floorStyle;
      // 存放节点关系
      this.relationshipList = dataList.filter(item => item.relationshipName);
      this.getFloorNext(floor, dataList);
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
      floor.name =
        floor.properties[this.relationshipConfig.dataStore1.nodeName];
      floor.styleInfo = this.householdStyle;

      // 存放节点关系
      this.relationshipList = dataList.filter(item => item.src);
      let children = [];
      // 获取根节点的下一级id数组
      let householdList = dataList.filter(
        item => item.entityName === this.relationshipConfig.dataStore2.name
      );

      householdList.forEach(item => {
        this.getFloorNext(item, dataList);
      });

      // 根据isFloor判断当前展示的是楼栋还是楼层
      householdList.forEach(item => {
        item.name =
          item.properties[this.relationshipConfig.dataStore2.nodeName];
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
        if (floor) {
          floor.properties[this.relationshipConfig.dataStore4.nodeName] &&
            (floor.styleInfo = this.obligeeStyle);

          floorList.push(floor);
        }
      });
      floorList.forEach(
        item =>
          (item.name =
            item.properties[this.relationshipConfig.dataStore3.nodeName] ||
            item.properties[this.relationshipConfig.dataStore4.nodeName])
      );
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
      // g6图表
      if (this.graph && this.graph._cfg) {
        if (JSON.stringify(this.formatQueryParams()) !== "{}") {
          this.isLock = true;
          this.highlightSerachData();
        } else {
          this.isLock = false;
          this.resizeGraphNodes();
          // this.initGraph(this.formatData(this.graphData));
        }
      } else {
        // echarts图表
        if (JSON.stringify(this.formatQueryParams()) !== "{}") {
          this.highlightEchaertsSerachData();
        } else {
          this.resizeEchartsNodes();
        }
      }
    },
    highlightEchaertsSerachData() {
      let highlightList = [];
      let params = this.formatQueryParams();
      const option = this.graphChart.getOption();
      const dataList = option.series[0];
      dataList.data.forEach(item => {
        if (item.entityName === this.relationshipConfig.dataStore3.name) {
          const isHighlight = this.getConditionResult(item, params);
          isHighlight
            ? highlightList.push(item.id)
            : (item.itemStyle.opacity = 0.3);
        } else {
          item.itemStyle.opacity = 0.3;
        }
      });
      if (highlightList.length > 0) {
        dataList.links.forEach(item => {
          if (!highlightList.includes(item.target)) {
            item.lineStyle.opacity = 0.2;
          } else {
            const sourceNode = dataList.data.find(
              node => node.id === item.source
            );
            sourceNode.itemStyle.opacity = 1;
          }
        });
      }
      // 取消hover高亮效果
      dataList.emphasis = null;
      this.graphChart.setOption(option, true);
    },
    resizeEchartsNodes() {
      const option = this.graphChart.getOption();
      const dataList = option.series[0];
      dataList.data.forEach(item => {
        item.itemStyle.opacity = 1;
      });
      dataList.links.forEach(item => {
        item.lineStyle.opacity = 1;
      });
      dataList.emphasis = {
        focus: "adjacency"
      };
      this.graphChart.setOption(option, true);
    },
    highlightSerachData() {
      // 图表类型为紧凑树时先把关闭的节点打开,否则会出问题
      if (this.currentType === 2 && this.closedNode.length > 0) {
        this.closedNode.forEach(item => {
          const node = this.graph.findById(item).get("model");
          node.collapsed = !node.collapsed;
        });
        this.graph.refreshLayout();
        this.closedNode = [];
      }

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
          item => item.entityName === this.relationshipConfig.dataStore3.name
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
        // layerIndex: data["层号"] - 1,
        layerIndex: this.getHouseIndex(data.euid),
        oid: data.oid
      });
    },
    // 获取户的layerIndex
    getHouseIndex(id) {
      const srcOption = this.graphData.find(item => item.dst === id);
      const index = this.getLayerIndex(srcOption.src);
      return index;
    },
    getNodeSize(node) {
      let size;
      switch (node.entityName) {
        case this.relationshipConfig.dataStore1.name:
          size = 38;
          break;
        case this.relationshipConfig.dataStore2.name:
          size = 30;
          break;
        case this.relationshipConfig.dataStore4.name:
          size = this.nodeDefualtConfig.size;
          break;
        default:
          size = this.nodeDefualtConfig.size;
          break;
      }
      return size;
    },
    // 图表自适应
    resizeGraph() {
      const dom = document.getElementById("relationship-graph");
      if (this.graph && this.graph._cfg) {
        if (!this.graphMax) {
          this.graph.changeSize(dom.offsetWidth, dom.offsetHeight);
        } else {
          this.graph.changeSize(this.graphWidth, this.graphHeight);
        }
        this.graph.render();
        this.graph.fitView();
      } else {
        if (!this.graphMax) {
          this.$nextTick(() => {
            this.graphChart.resize({
              width: dom.offsetWidth + "px",
              height: dom.offsetHeight + "px"
            });
          });
        } else {
          this.$nextTick(() => {
            this.graphChart.resize({
              width: this.graphWidth + "px",
              height: this.graphHeight + "px"
            });
          });
        }
      }
      this.graphMax = !this.graphMax;
    },
    // 清除tooltip框
    removeTooltip() {
      let tooltip = document.getElementsByClassName("g6-tooltip");
      if (tooltip && tooltip.length > 0) {
        for (let i = tooltip.length - 1; i >= 0; i--) {
          tooltip[i].remove();
        }
      }
    },
    // 组装tooltip框数据
    formatText(model) {
      let text = [];
      const data = model.properties;
      // js遍历对象是无序的，指定tooltip展示顺序
      if (model.entityName === this.relationshipConfig.dataStore1.name) {
        for (let i = 0; i < this.dataStore1TooltipField.length; i++) {
          text.push(
            `<strong>${this.dataStore1TooltipField[i]}</strong>: ${
              data[this.dataStore1TooltipField[i]]
            }`
          );
        }
        this.showAccessory = false;
      } else if (model.entityName === this.relationshipConfig.dataStore2.name) {
        for (let i = 0; i < this.dataStore2TooltipField.length; i++) {
          text.push(
            `<strong>${this.dataStore2TooltipField[i]}</strong>: ${
              data[this.dataStore2TooltipField[i]]
            }`
          );
        }
        this.showAccessory = false;
      } else if (model.entityName === this.relationshipConfig.dataStore3.name) {
        for (let i = 0; i < this.dataStore3TooltipField.length; i++) {
          text.push(
            `<strong>${this.dataStore3TooltipField[i]}</strong>: ${
              data[this.dataStore3TooltipField[i]]
            }`
          );
        }
        this.showAccessory = true;
        this.$nextTick(() => {
          this.$refs.detailInfo.getAccessoryInfo({
            fromID: model.properties.euid || undefined
          });
        });
      } else if (model.entityName === this.relationshipConfig.dataStore4.name) {
        for (let i = 0; i < this.dataStore4TooltipField.length; i++) {
          text.push(
            `<strong>${this.dataStore4TooltipField[i]}</strong>: ${
              data[this.dataStore4TooltipField[i]]
            }`
          );
        }
        this.showAccessory = false;
      }
      return `${text.join("<br />")}`;
    },
    goBack() {
      this.showRevert = false;
      this.tooltipInfo = undefined;
      this.$emit("change-floor", {
        guid: this.currentFloor,
        isFloor: false
      });
    },
    handleSelectChange(val) {
      this.currentType = val.id;
      this.tooltipInfo = undefined;
      this.relationshipTypeList.forEach(item => {
        item.active = val.id === item.id ? true : false;
      });
      this.init();
    },
    projectScreen(file) {
      this.$emit("project-screen", file);
    }
  },
  beforeDestroy() {
    if (this.graph && this.graph._cfg) {
      this.graph.destroy();
    }
    if (this.graphChart) {
      this.graphChart.dispose();
    }
    this.floorOptionList = [];
  }
};
</script>
<style lang="less">
.mapgis-3d-relationship-graph {
  padding: 6px 4px 0px 12px;
  min-width: 980px;
  min-height: 700px;
  .relationship-graph {
    position: relative;
    display: flex;
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

    .relationship-graph-right {
      position: absolute;
      right: 0;
      overflow: auto;
      background: rgba(20, 20, 20, 0.8);
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      //   color: #545454;
      padding: 0 8px 10px;
      //   box-shadow: rgb(174, 174, 174) 0px 0px 10px;
      border: 1px solid #545454;
      white-space: normal;
      word-break: break-all;
      overflow: hidden;
      .right-accessory {
        margin-top: 8px;
        padding-top: 4px;
        border-top: 1px solid #e2e2e2;
      }
      .right-close {
        margin-top: 2px;
        margin-bottom: 1px;
        display: flex;
        justify-content: end;
      }
    }
  }
  .mapgis-ui-input-auto-width,
  .mapgis-ui-select-selection {
    background-color: rgba(20, 20, 20, 0.3) !important;
  }
  .mapgis-relationship-icons {
    margin-top: 6px;
    .mapgis-ui-space-item {
      margin-right: 12px;
    }
    .mapgis-ui-space-item > .active {
      color: var(--primary-6);
    }
  }
  .mapgis-ui-setting-form.compact .mapgis-ui-form-item {
    margin-bottom: 4px;
  }
}
</style>
