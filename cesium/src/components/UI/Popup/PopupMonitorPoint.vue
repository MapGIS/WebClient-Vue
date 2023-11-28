<template>
  <div class="monitor-point-popup-wrapper">
    <div class="data-point-content">
      <div class="monitor-left">
        <span class="monitor-title" v-show="listPanelVisible"
          >监测点信息- {{ monitorTitle }}</span
        >
        <div class="monitor-table">
          <mapgis-ui-list
            item-layout="horizontal"
            :locale="emptyText"
            :data-source="dataList"
            size="small"
            class="table-marker"
            bordered
            :style="{ width: listPanelVisible ? '350px' : 0 }"
          >
            <mapgis-ui-list-item
              slot="renderItem"
              slot-scope="item"
              class="table-marker-item"
            >
              <div :title="item">
                {{ item }}
              </div>
              <div :title="infoData[item]">
                {{ infoData[item] }}
              </div>
            </mapgis-ui-list-item>
          </mapgis-ui-list>
          <div class="monitor-handle" @click="onTogglelistPanel">
            <mapgis-ui-iconfont
              :type="listPanelVisible ? 'mapgis-left' : 'mapgis-right'"
            ></mapgis-ui-iconfont>
          </div>
        </div>
      </div>
      <div class="monitor-right" v-if="type === 'data'">
        <span class="monitor-title">监测曲线- {{ monitorTitle }}</span>
        <div class="monitor-search-time">
          <mapgis-ui-range-picker
            :locale="locale"
            :show-time="{ format: 'HH:mm:ss' }"
            :placeholder="['开始时间', '结束时间']"
            v-model="timePick"
            format="YYYY-MM-DD HH:mm:ss"
            @change="onChange"
            @openChange="openChange"
          />
          <mapgis-ui-select
            default-value="最近一周"
            style="width: 100px;margin-left: 5px"
            @change="handleChange"
          >
            <mapgis-ui-select-option
              v-for="(item, index) in selectTimeRange"
              :value="item.label"
              :key="index"
            >
              {{ item.label }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </div>

        <div :ref="id" class="monitor-echart" v-show="showEcharts" />
        <span class="monitor-tips" v-show="!showEcharts">暂无数据</span>
      </div>
      <div class="monitor-point-content" v-if="type === 'video'">
        <div class="monitor-title">视频- {{ monitorTitle }}</div>
        <div class="monitor-video">
          <div class="monitor-search-time">
            <mapgis-ui-range-picker
              :locale="locale"
              :show-time="{ format: 'HH:mm:ss' }"
              :placeholder="['开始时间', '结束时间']"
              v-model="timePick"
              format="YYYY-MM-DD HH:mm:ss"
              @change="onChange"
              @openChange="openChange"
            />
            <mapgis-ui-select
              default-value="最近一周"
              style="width: 100px;margin-left: 5px"
              @change="handleChange"
            >
              <mapgis-ui-select-option
                v-for="(item, index) in selectTimeRange"
                :value="item.label"
                :key="index"
              >
                {{ item.label }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </div>
          <div class="monitor-video-content">
            <div
              id="projectorVideoContainer"
              :width="300"
              :height="200"
              v-if="videoUrl"
            ></div>
            <mapgis-ui-empty v-else class="empty"></mapgis-ui-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
import moment from "moment";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import "moment/dist/locale/zh-cn";
import { Empty } from "ant-design-vue";
import videojs from "video.js";
import "videojs-contrib-hls";
import "video.js/dist/video-js.css";

window.monitorPointDomMap = {};

export default {
  name: "mapgis-3d-monitor-point-popup",
  props: {
    properties: {
      type: Object,
      default: () => {}
    },
    // 气泡框配置
    componentWidth: {
      type: [Number, String],
      default: 980
    },
    type: {
      type: String,
      default: "data"
    },
    // token
    access_token: {
      type: String,
      default: "U95_PewQPaUqOvqcCC6DtWGAn1sHZnc6rhTCrj7tzuU"
    },
    // 请求路径
    dataUrl: {
      type: String,
      default: "https://szaqxsbg.szsti.org:8060"
    },
    // 监测点查询字段monPntID
    monPntID: {
      type: String,
      default: "monPntID"
    },
    // 接口返回数据对应关系
    propertyRelation: {
      type: Object,
      default: () => {
        return {
          cd: "监测点编号",
          jcdw: "监测单位",
          jcdx: "监测对象",
          ssyq: "所属测区",
          lx: "监测类型",
          jcxm: "监测项目",
          fs: "监测方式",
          mon_project_unit: "监测指标单位"
        };
      }
    },
    // 视频流类型
    videoType: {
      type: String,
      default: ""
    },
    // x轴显示字段
    xAxis: {
      type: String,
      default: "mon_time_ts"
    },
    // y轴显示字段
    yAxis: {
      type: String,
      default: "mon_acc_value"
    },
    // 设备名称显示字段
    title: {
      type: String,
      default: "测点"
    },
    exhibition: {
      type: Object
    }
  },
  data() {
    return {
      id: Math.floor(Math.random() * 100000),
      infoData: {},
      showEcharts: true,
      timePick: [moment().subtract(1, "weeks"), moment()],
      timeRange: {
        今天: [moment().startOf("day"), moment()],
        昨天: [
          moment()
            .startOf("day")
            .subtract(1, "days"),
          moment()
            .endOf("day")
            .subtract(1, "days")
        ],
        最近一周: [moment().subtract(1, "weeks"), moment()],
        最近一月: [moment().subtract(1, "months"), moment()],
        最近一季: [moment().subtract(3, "months"), moment()],
        最近一年: [moment().subtract(1, "years"), moment()],
        全部: ["", moment()]
      },
      locale,
      selectTimeRange: [
        {
          label: "今天"
        },
        {
          label: "昨天"
        },
        {
          label: "最近一周"
        },
        {
          label: "最近一月"
        },
        {
          label: "最近一季"
        },
        {
          label: "最近一年"
        },
        {
          label: "全部"
        }
      ],
      hasChange: false,
      listPanelVisible: false,
      videoUrl: ""
    };
  },
  computed: {
    dataList() {
      return Object.keys(this.infoData);
    },
    monitorPointId() {
      return this.properties[this.monPntID];
    },
    monitorTitle() {
      return this.properties[this.title];
    },
    emptyText() {
      const customEmptyText = "未查询到监测点信息";
      return {
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={customEmptyText}
          />
        )
      };
    }
  },
  watch: {
    listPanelVisible: {
      handler() {
        if (this.type === "video") {
          const dom = document.querySelectorAll(
            ".mapgis-feature-popup-container"
          );

          dom &&
            dom.forEach(item => {
              if (this.listPanelVisible) {
                item.style.width = `${this.componentWidth}px`;
              } else {
                item.style.width = "550px";
              }
            });
        }
      }
    },
    monitorPointId: {
      immediate: true,
      async handler() {
        if (this.type === "video") {
          if (
            window.monitorPointDomMap &&
            window.monitorPointDomMap[this.monitorPointId]
          ) {
            this._getVideoDom();
          } else {
            const layerName = this.exhibition.options
              ? this.exhibition.options[this.exhibition.activeOptionId].name
              : this.exhibition.option.name;
            const videoName = this.properties[this.monPntID];
            const path = await this.getPath(videoName, layerName);
            if (path.indexOf("undefined") > -1) {
              this.videoUrl = "";
              return this.$message.info("获取视频流失败");
            }
            const baseUrl = this.dataUrl.replace(
              "/catalog/hdfs/services",
              "/services/file/hdfs"
            );
            this.videoUrl = `${baseUrl}/${path}/download?isPreview=true`;
            this._getVideoDom();
          }
        }
      }
    }
  },

  async mounted() {
    if (this.type === "data") {
      await this.getMonitorData();
      setTimeout(() => {
        this.initEcharts();
      }, 500);
    } else {
      this.getMonitorData();
    }
  },

  methods: {
    async getPath(videoName, layerName) {
      const res = await axios.get(this.dataUrl);

      if (res.status === 200) {
        const {
          t: { rtn }
        } = res.data;
        const result = await this.getUrl(
          videoName,
          rtn,
          this.dataUrl,
          layerName
        );
        console.log(result, "res");
        return result;
      }
    },
    async getUrl(videoName, rtn, baseUrl, layerName) {
      const obj =
        rtn.find(item => item.name === layerName) ||
        rtn.find(item => item.name === videoName);

      if (obj) {
        const url = `${baseUrl}/${obj.name}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          const { rtn } = res.data.t;
          const resName = await this.getUrl(videoName, rtn, url);
          return `${obj.name}/${resName}`;
        }
      } else {
        const item = rtn.find(
          item => item.name === `${videoName}.${this.videoType}`
        );
        if (item) {
          return item.name;
        }
      }
    },
    _getVideoDom() {
      let tempVideoDom;
      if (
        window.monitorPointDomMap &&
        window.monitorPointDomMap[this.monitorPointId]
      ) {
        const { videoDom, hlsPlayer } = window.monitorPointDomMap[
          this.monitorPointId
        ];
        tempVideoDom = videoDom;
      } else {
        if (!this.videoUrl) {
          return null;
        }
        // 创建video元素
        tempVideoDom = this.createVideoElement(
          this.videoType,
          this.videoUrl,
          this.monitorPointId
        );
      }
      this.videoDom = tempVideoDom;

      this.$nextTick(function() {
        const projectorVideoContainer = document.getElementById(
          "projectorVideoContainer"
        );
        projectorVideoContainer.innerHTML = "";
        tempVideoDom.width = 300;
        tempVideoDom.height = 200;
        tempVideoDom.controls = true;
        projectorVideoContainer.appendChild(tempVideoDom);
      });
    },
    createVideoElement(protocol, videoUrl, id) {
      if (window.monitorPointDomMap[id]) {
        const { videoDom, hlsPlayer } = window.monitorPointDomMap[id];
        return videoDom;
      }
      const playerType = this.getVideoPlayerType(protocol);
      const videoContainer = document.createElement("div");
      const width = 300;
      const height = 200;
      videoContainer.innerHTML = `<video id="projector-video-${id}" class="video-js vjs-default-skin" controls preload="auto" width="${width}" height="${height}" crossOrigin="anonymous">
      <source src="${videoUrl}" type="${playerType}" /></video>`;
      const videoDom = videoContainer.getElementsByTagName("video")[0];
      const options = {
        // 播放速度  playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      };
      const hlsPlayer = window.videojs(videoDom, options);
      hlsPlayer.src({
        type: playerType,
        src: videoUrl
      });
      hlsPlayer.load(videoUrl);
      hlsPlayer.play();
      hlsPlayer.loop();
      window.monitorPointDomMap[id] = {
        videoDom,
        hlsPlayer
      };
      return videoDom;
    },
    getVideoPlayerType(protocol) {
      let type = "video/mp4";
      if (protocol === "mp4") {
        type = "video/mp4";
      } else if (protocol === "m3u8") {
        type = "application/x-mpegURL";
      } else if (protocol === "webm") {
        type = "video/webm";
      } else if (protocol === "ogg") {
        type = "video/ogg";
      }
      return type;
    },
    onTogglelistPanel() {
      this.listPanelVisible = !this.listPanelVisible;
      if (this.type === "data") {
        this.initEcharts();
      }
    },
    async initEcharts() {
      const beginDate = this.timePick[0]
        ? moment(this.timePick[0]).format("YYYY-MM-DD+HH:mm:ss")
        : undefined;
      const endDate = this.timePick[1]
        ? moment(this.timePick[1]).format("YYYY-MM-DD+HH:mm:ss")
        : undefined;
      await this.getMonitorEchartsData(endDate, beginDate);
    },
    getMonitorData() {
      if (this.dataUrl.indexOf("datastore") > -1) {
        this.infoData = this.properties;
        this.listPanelVisible = true;
      } else {
        axios
          .get(
            `${this.dataUrl}/hotel/api/QueryJcjkHqjcXm?access_token=${this.access_token}&mon_point_id=${this.monitorPointId}`
          )
          .then(res => {
            if (res.status === 200) {
              const data = res.data;
              if (data.records && data.records.length === 0) {
                this.$message.info(`监测点${this.monitorTitle}未查询到信息!`);
                return;
              }
              const record = data.records[0];
              const info = {};
              Object.keys(this.propertyRelation).forEach(item => {
                const key = this.propertyRelation[item];
                info[key] = record[item];
              });
              this.infoData = info;
              this.listPanelVisible = true;
            }
          })
          .catch(e => {
            this.$message.error(`监测点${this.monitorPointId}信息查询异常!`);
          });
      }
    },
    getMonitorEchartsData(endDate, beginDate) {
      let url = `${this.dataUrl}/hotel/api/QueryJcjkHqjcSj?access_token=${this.access_token}&mon_point_id=${this.monitorPointId}`;
      if (endDate) {
        url = url + `&endDate=${endDate}`;
      }
      if (beginDate) {
        url = url + `&beginDate=${beginDate}`;
      }
      axios
        .get(url)
        .then(res => {
          if (res.status === 200) {
            const data = res.data;
            if (data.records && data.records.length === 0) {
              // this.$message.info(
              //   `监测点${this.properties.monPntID}未查询到监测数据信息!`
              // );
              this.showEcharts = false;
              return;
            }
            const timeerDate = res.data.records.reduce((arr, item) => {
              const res = [item[this.xAxis], item[this.yAxis]];
              arr.push(res);
              return arr;
            }, []);
            this.showEcharts = true;
            if (this.myCharts) {
              this.$nextTick(() => {
                this.resizeEcharts(timeerDate);
              });
            } else {
              this.$nextTick(() => {
                this.drawEcharts(timeerDate);
              });
            }
          } else {
            this.showEcharts = false;
          }
        })
        .catch(e => {
          this.showEcharts = false;
          // this.$message.error(e);
        });
    },
    drawEcharts(data) {
      const echartsDom = this.$refs[this.id];
      if (!echartsDom) return;
      this.myCharts = echarts.init(echartsDom, null, {
        renderer: "canvas",
        useDirtyRect: false
        // width: echartsDom.clientWidth,
        // height: echartsDom.clientHeight
      });
      const option = {
        tooltip: {
          trigger: "axis"
          // position: function(pt) {
          //   return [pt[0], "10%"];
          // }
        },
        legend: {
          data: ["第三方监测数据"],
          right: 30,
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          top: 30,
          left: "8%",
          right: 34
        },
        toolbox: {
          iconStyle: {
            color: "#111",
            borderColor: "#fff"
          },
          top: -4,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          interval: 24 * 1 * 60 * 60 * 1000,
          axisLine: {
            show: true
          },
          textStyle: {
            color: "#fff"
          },
          axisLabel: {
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          axisLine: {
            show: true
          },
          textStyle: {
            color: "#fff",
            lineStyle: {
              color: "#ccc"
            }
          },
          axisLabel: {
            color: "#fff"
          },
          splitLine: {
            lineStyle: {
              color: "#6a6969",
              type: "dashed"
            }
          }
        },
        dataZoom: [
          //1.横向使用滚动条
          {
            type: "slider", //有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
            show: true, //是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
            start: 80, //数据窗口范围的起始百分比0-100
            end: 100, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0], // 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
            bottom: 10 //距离底部的距离
          },
          //2.在内部可以横向拖动
          // {
          //   type: "inside", // 内置于坐标系中
          //   start: 0,
          //   end: 30,
          //   xAxisIndex: [0]
          // },
          //3.纵向使用滚动条
          {
            type: "slider",
            show: true,
            yAxisIndex: [0], //设置组件控制的y轴
            left: "95%", //距离左侧的距离 可以使百分比，也可以是像素 left: '30'（30像素）
            start: 0,
            end: 100
          }
          //4.在内部可以纵向拖动
          // {
          //   type: "inside",
          //   yAxisIndex: [0],
          //   start: 29,
          //   end: 36
          // }
        ],
        series: [
          {
            name: "第三方监测数据",
            type: "line",
            smooth: true,
            symbol: "none",
            // areaStyle: {},
            data: data
          }
        ]
      };
      this.myCharts.setOption(option);
    },
    resizeEcharts(data) {
      const options = this.myCharts.getOption();
      if (!options) {
        this.drawEcharts(data);
      } else {
        options.series[0].data = data;
        this.myCharts.setOption(options);
        this.myCharts.resize();
      }
    },
    onChange(val) {
      this.hasChange = true;
    },
    openChange(status) {
      if (!status && this.hasChange) {
        this.hasChange = !this.hasChange;
        this.initEcharts();
      }
    },
    handleChange(val) {
      const date = JSON.parse(JSON.stringify(this.timeRange[val]));
      this.timePick = date;
      this.initEcharts();
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor-point-popup-wrapper {
  padding: 5px 0;
  .data-point-content {
    display: flex;
    .monitor-title {
      color: var(--text-color);
    }
    .monitor-left {
      .mapgis-ui-divider-horizontal {
        margin: 12px 0;
      }
      .table-marker {
        max-width: 350px !important;
        width: 350px;
        max-height: 300px !important;
        line-height: 2;
        margin-bottom: 10px;
        .table-marker-item {
          display: flex;
          padding: 0;
        }
        .table-marker-item:nth-child(2n) {
          background-color: var(--background-light);
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
          border-right: 1px solid var(--border-color-base);
        }

        .table-marker-item > div:last-child {
          flex: 1 0 0%;
        }
      }
      .monitor-table {
        position: relative;
        .monitor-handle {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid var(--border-color-base);
          border-left: none;
          color: var(--text-color);
          border-radius: 0 4px 4px 0;
          width: 16px;
          height: 64px;
          position: absolute;
          top: 100px;
          right: -15px;
          cursor: pointer;
          &:hover {
            color: white;
            background: var(--primary-color);
          }
        }
      }
    }
    .monitor-right {
      flex: 1;
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      .monitor-echart {
        flex: 1;
      }
      .monitor-tips {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text-color);
      }
    }
    .monitor-point-content {
      flex: 1;
      margin-left: 30px;
      .monitor-video {
        height: 250px;
        max-height: 250px;
        text-align: center;
        margin-top: 20px;
        .monitor-video-content {
          height: 100%;
          .empty {
            line-height: 200px;
          }
          .video {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
