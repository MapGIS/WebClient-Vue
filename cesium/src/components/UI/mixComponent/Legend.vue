<template>
  <div>
    <div v-show="viewInfo === true" class="chart-legend-wrapper">
      <div class="header">
        <div class="buttons">图例信息</div>
        <a-icon class="header-close" type="close" @click="handleClose"/>
      </div>
      <div class="area-count">
        面积:{{ allAreaString }} ㎡
      </div>
      <!-- <div :id="echartid" :style="{ width: '320px', height: '180px' }" /> -->
      <div v-if="showtab" class="legend-tabs-wrapper" >
        <span class="legend-tabs-scoll" @mousedown="scrollTab('left')">{{
            lefttab
          }}</span>
        <div ref="scrolltab" class="legend-tabs-content">
          <div
              v-for="(serie, i) in [{ name: '全部' }].concat(echartdata.series)"
              :key="serie.name"
              class="area-tab"
          >
            <!-- <div class="area-tab-value">{{ serie.value.toFixed(2) }} m²</div> -->
            <div
                v-bind:class="{ 'area-tab-name': true, active: i - 1 === curindex }"
                @click="curindex = i - 1"
            >
              {{ serie.name }}
            </div>
          </div>
        </div>
        <span class="legend-tabs-scoll" @mousedown="scrollTab('right')">{{
            righttab
          }}</span>
      </div>
      <div class="legend-check-groups">
        <div class="legend-check-group-header">
          <input
              :checked="curcheck.length === curlegend.length"
              class="legend-item-checkbox"
              type="checkbox"
              @change="onAllChange"
          />
          <div class="legend-item-text">全选</div>
          <div class="legend-item-count">面积(m²)</div>
          <div class="legend-item-percent">占比</div>
        </div>
        <div v-for="l in curlegend" :key="l.name" class="legend-check-group">
          <input
              :checked="curcheck.indexOf(l.name) >= 0"
              :value="l.name"
              class="legend-item-checkbox"
              name="group"
              type="checkbox"
              @change="onSingleChange"
          />
          <div :style="{ background: l.color }" class="legend-item-color"/>
          <div class="legend-item-text" @click="onLengendItemClick">
            {{ l.name }}
          </div>
          <div class="legend-item-count-text">
            {{ areaString(l.count.toFixed(2)) }}
          </div>
          <div class="legend-item-percent-text">
            {{ (l.percent * 100).toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
<!--    <div class="double-screen-wrapper">-->

<!--      <div class="area-count">-->
<!--&lt;!&ndash;        {{ $store.state.layer.action }}&ndash;&gt;-->
<!--      </div>-->
<!--      <div v-for="l in curlegend" :key="l.name" class="legend-check-group">-->
<!--        <div class="legend-item-text">-->
<!--          {{ l.name }}-->
<!--        </div>-->
<!--        <div :style="{ color: l.color }" class="legend-item-count-text">-->
<!--          比例: {{ (l.percent * 100).toFixed(2) }} %-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import * as turf from '@turf/turf';
import ServiceLayer from "../Controls/ServiceLayer";
export default {
  name: "mapgis-3d-component-legend",
  props: {
    ruleJson: {type: Object},
    geoJson: {type: Object},
    vueKey: {type: String, default: "default"},
    vueIndex: {
      type: String | Number,
      default: (Math.random() * 10000).toFixed(0)
    },
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  mixins: [ServiceLayer],
  data() {
    return {
      waitManagerName: "GeojsonManager",
      //当前选中图例
      curcheck: [],
      //当前图例列表
      curlegend: [],
      echartdata:"",
      curData:[],
      showtab: true,
      lefttab: "〈",
      righttab: "〉",
      allArea: 0,
      curindex: -1,
      viewInfo: true,
      rules:"",
      innerActive:[],
      activeMode:""
    }
  },
  computed: {
    // 格式化
    allAreaString() {
      let allArea = String(this.allArea.toFixed(0));
      let reg =
          allArea.indexOf(".") > -1
              ? /(\d)(?=(\d{3})+\.)/g
              : /(\d)(?=(?:\d{3})+$)/g;
      return allArea.replace(reg, "$1,");
    },
  },
  watch:{
    curcheck: function (news) {
      if (this.activeMode !== "tabChange"){
        this.checkChange(news);
      }
    },
    curindex: function (news) {
      this.activeMode = "tabChange";
      this.parseCheck(news);

      if (news === -1) {
        this.changeLegendColors(false, -1);
      } else {
        this.changeLegendColors(true, news);
      }
    },
  },
  mounted() {
    let vm = this;
    vm.getManager();
  },
  methods: {
    // 格式化
    getManager(){
      let vm = this;
      this.$_init(vm.initData);
    },
    areaString(area) {
      let allArea = String(area);
      let reg =
          allArea.indexOf(".") > -1
              ? /(\d)(?=(\d{3})+\.)/g
              : /(\d)(?=(?:\d{3})+$)/g;
      return allArea.replace(reg, "$1,");
    },
    initData() {
      let vm = this;
      // 获取图例数据和rule数据
      // let jsonSource = vm.$_getObject(this.waitManagerName);

      let {geoJson,ruleJson} = this;
      // vm.rules = jsonSource.options.rule;

      vm.rules = ruleJson;

      this.curcheck = vm.rules.rule.map((sub) => sub.title) || [];

      let dataseries = [];

      // rule中二级分类的title
      let firstTitles = vm.rules.rule.map((r) => r.title);

      //遍历求出每一地类名称的的面积
      for (let i = 0; i < geoJson.features.length; i++) {
        let polygon = turf.polygon(geoJson.features[i].geometry.coordinates);
        let area = turf.area(polygon);
        let name = geoJson.features[i].properties.地类名称;
        let find = dataseries.find((d) => {
          return d && d.name === name;
        });
        if (find) {
          find.value += area;
        } else {
          dataseries.push({value: area, name: name});
        }
      }

      //二级分类的地类名称的series(name和value)
      let a;
      vm.rules.rule.forEach((sub) => {
        a = [];
        dataseries.forEach(function (d) {
          for (let i = 0; i < sub.rule.length; i++) {
            if (d.name === sub.rule[i].name) {
              a.push(d);
              break;
            }
          }
        })
        sub.series = a;
      })

      //统计一级分类的建筑用地和非建筑用地的总面积
      vm.rules.series = vm.rules.rule.map((subrule) => {
        let all = 0;
        subrule.series.forEach((s) => (all += Number(s.value)));
        return {name: subrule.title, value: Number(all.toFixed(2)),color: subrule.color};
      });

      //数据转换，allArea求总面积
      vm.echartdata = vm.rules;
      vm.showtab = this.echartdata.hasSecond ? true : false;
      vm.allArea = 0;
      vm.echartdata.series.forEach((s) => {
        if (s && s.value) {
          vm.allArea += s.value;
        }
      });
      vm.curdata = vm.rules.series;

      //初始化 curlegend:即图例大类的图例信息
      vm.curlegend = vm.rules.series.map((l) => {
        let find = vm.curdata.find((i) => {
          return i.name === l.name;
        });
        if (find) {
          l.count = find.value;
          l.percent = find.value / vm.allArea;
          l.color = find.color;
        } else {
          l.count = 0;
          l.percent = 0;
        }
        return l;
      });
      vm.curlegend = vm.curlegend.filter((l) => l.count > 0);

      this.onInitIndex()

    },
    onInitIndex() {
      this.curindex = -1;
    },
    scrollTab(direction) {
      switch (direction) {
        case "left":
          this.$refs.scrolltab.scrollLeft -= 150;
          break;
        case "right":
          this.$refs.scrolltab.scrollLeft += 150;
          break;
      }
    },
    handleClose() {
      vm.viewInfo = false;
    },
    onAllChange(node) {
      let vm = this;
      vm.activeMode = "checkboxChange"
      let checked = node.target.checked;
      if (checked) {
        vm.curcheck = vm.curlegend.map((l) => l.name);
      } else {
        vm.curcheck = [];
      }
    },
    onSingleChange(node) {
      let vm = this;
      vm.activeMode = "checkboxChange"
      let key = node.target.value;
      let checked = node.target.checked;
      if (checked) {
        if (vm.curcheck.indexOf(key) < 0) {
          vm.curcheck = vm.curcheck.concat([key]);
        }
      } else {
        vm.curcheck = vm.curcheck.filter((k) => k !== key);
      }
    },
    parseCheck(index) {
      const {echartdata} = this;
      const vm = this;
      vm.showtab = echartdata.hasSecond ? true : false;
      // index为-1时，一级分类
      if (index === -1) {
        vm.allArea = 0;
        echartdata.series.forEach((s) => {
          if (s && s.value) {
            vm.allArea += s.value;
          }
        });
        vm.curdata = echartdata.series;
        vm.curlegend = echartdata.series.map((l) => {
          let find = vm.curdata.find((i) => {
            return i.name === l.name;
          });
          if (find) {
            l.count = find.value;
            l.percent = find.value / vm.allArea;
            l.color = find.color;
          } else {
            l.count = 0;
            l.percent = 0;
          }
          return l;
        });
        vm.curlegend = vm.curlegend.filter((l) => l.count > 0);
        vm.curcheck = echartdata.rule.map((sub) => sub.title);
      } else {
        const title = echartdata.rule[index].title;
        echartdata.rule.forEach((subrule) => {
          if (title === subrule.title) {
            vm.allArea = 0;
            subrule.series.forEach((s) => {
              if (s && s.value) {
                vm.allArea += s.value;
              }
            });
            vm.curdata = subrule.series;
            vm.curlegend = subrule.series.map((l) => {
              let find = vm.curdata.find((i) => {
                return i.name === l.name;
              });
              if (find) {
                l.count = find.value;
                l.percent = find.value / vm.allArea;
                l.color = find.color;
              } else {
                l.count = 0;
                l.percent = 0;
              }
              let findColor = subrule.rule.find((r) => {
                return r.name === l.name;
              })
              if(findColor){
                l.color = findColor.color;
              }
              return l;
            });
            vm.curlegend = vm.curlegend.filter((l) => l.count > 0);

            vm.curcheck = subrule.series.map((l) => l.name);
          }
        });
      }
    },

    checkChange(curcheck) {
      const { echartdata } = this;
      let tempSeries = JSON.parse(JSON.stringify(echartdata));
      let trueChecks = [];
      let map = [];
      if (curcheck && curcheck.length >= 0) {
        tempSeries.rule.forEach((subrule) => {
          if (curcheck.indexOf(subrule.title) >= 0) {
            //当前为一级分类
            subrule.rule.forEach((rule) => rule.color = subrule.color)
            trueChecks = trueChecks.concat(subrule.rule);
          }
          if (curcheck.indexOf(subrule.title) < 0){
            for (let i=0;i<curcheck.length;i++){
              map = this.curlegend.filter((c) => c.name == curcheck[i]);
              trueChecks = trueChecks.concat(map);
            }
          }
        });
      }
      this.innerActive = trueChecks;
      this.$emit("colorChange",this.innerActive);
    },

    changeLegendColors(ischild, childindex) {
      let vm = this;
      const {echartdata} = this;
      let colors = [];
      if (!ischild) {
        //一级分类 只有大分类的颜色渲染
        echartdata.rule.forEach((subrule, i) => {
          colors = colors.concat(
              subrule.rule.map((l) => {
                let n = {...l};
                n.color = echartdata.rule[i].color;
                return n;
              })
          );
        });
      } else {
        colors = vm.curlegend;
      }
      this.innerActive = colors;
      this.$emit("colorChange",this.innerActive);
    },
    onLengendItemClick(event) {
      debugger
      let { echartdata } = this;
      const vm = this;
      let inFirst = false;
      vm.showtab = echartdata.hasSecond ? true : false;
      echartdata.rule.forEach((subrule, i) => {
        if (event.currentTarget.innerText === subrule.title) {
          inFirst = true;
          if (subrule.rule && subrule.rule.length > 0) {
            vm.allArea = 0;
            subrule.series.forEach((s) => {
              if (s && s.value) {
                vm.allArea +=
                    typeof s.value === "string" ? parseFloat(s.value) : s.value;
              }
            });
            vm.curdata = subrule.series;
            vm.curlegend = subrule.series.map((l) => {
              let find = vm.curdata.find((i) => {
                return i.name === l.name;
              });
              if (find) {
                l.count = find.value;
                l.percent = find.value / vm.allArea;
              } else {
                l.count = 0;
                l.percent = 0;
              }
              return l;
            });

            vm.curlegend = vm.curlegend.filter((l) => l.count > 0);

            vm.curindex = i;
            vm.changeLegendColors(true, i);
          } else if (subrule.rule && subrule.rule.length === 0) {
            this.$store.commit("SET_LEGEND_HIGHTLIGHTS", {
              index: this.index,
              highlights: [subrule.title],
            });
          }
        }
      });
      if (!inFirst) {
        this.$emit("highlight",[event.currentTarget.innerText]);
        // this.$store.commit("SET_LEGEND_HIGHTLIGHTS", {
        //   index: this.index,
        //   highlights: [event.currentTarget.innerText],
        // });
      }
    },

  }
}

</script>

<style scoped>
.chart-legend-wrapper {
  color: #ffffff;
  background: rgba(12, 28, 33, 0.1);
  border: 1px solid #5d8ed9;
}
  .header {
    font-size: 16px;
    padding: 0 12px;
    color: #ffffff;
    background-image: linear-gradient(
            90deg,
            rgb(38, 53, 79) 0%,
            rgb(56, 76, 109) 100%
    );
    text-align: center;
  }

  .header-close {
    font-size: 12px;
    position: absolute;
    top: 6px;
    right: 10px;
  }

  .legend-tabs-wrapper {
    width: 100%;
    display: inline-flex;
  }

  .legend-tabs-scoll {
    font-size: 18px;
    height: 18px;
    width: 18px;
    line-height: 18px;
    margin: 3px 0px;
  }

  .legend-tabs-content {
    height: 24px;
    width: 310px;
    display: inline-flex;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .area-count {
    font-size: 16px;
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 12px;
    text-align: center;
    width: 100%;
  }

  .area-tab {
    width: 120px;
    margin: 0px 0px;
    text-align: center;
    height: 24px;
  }

  .area-tab-value {
    width: 120px;
    height: 24px;
    text-align: center;
  }

  .area-tab-name {
    width: 100px;
    padding: 0 3px;
    overflow: hidden;
    color: #ffffff;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .active {
    background-image: linear-gradient(
            90deg,
            rgb(38, 53, 79) 0%,
            rgb(56, 76, 109) 100%
    );
  }

  .legend-check-groups {
    padding: 12px 20px;
    padding-right: 0px;
    max-height: 400px;
    overflow-y: scroll;
  }

  .legend-check-groups::-webkit-scrollbar {
    width: 4px;
    height: 2px;
  }

  .legend-check-groups::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #00d5f9;
  }

  .legend-check-groups::-webkit-scrollbar-track {
  }

  .legend-check-group {
    display: flex;
    height: 22px;
    width: 100%;
  }

  .legend-check-group-header {
    display: flex;
    height: 22px;
    width: 100%;
  }

  .legend-item-color {
    margin: 3px 3px;
    height: 16px;
    width: 16px;
  }

  .legend-item-text {
    margin: 3px 3px;
    height: 16px;
    line-height: 16px;
    width: 120px;
    overflow: hidden;
    color: #ffffff;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    /*color: #00d5f9 !important;*/
    font-weight: bold;
  }

  .legend-item-count {
    margin: 3px 3px;
    padding-left: 20px;
    height: 16px;
    line-height: 16px;
    width: 100px;
    overflow: hidden;
    color: #ffffff;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    /*color: #00d5f9 !important;*/
    font-weight: bold;
  }

  .legend-item-count-text {
    margin: 3px 3px;
    height: 16px;
    line-height: 16px;
    width: 100px;
    overflow: hidden;
    color: #ffffff;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    /*color: #00d5f9 !important;*/
    font-weight: bold;
  }

  .legend-item-percent {
    margin: 3px 3px;
    padding-left: 18px;
    height: 16px;
    line-height: 16px;
    width: 50px;
    overflow: hidden;
    color: #ffffff;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .legend-item-percent-text {
    margin: 3px 3px;
    height: 16px;
    line-height: 16px;
    width: 50px;
    overflow: hidden;
    color: #ffffff;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .legend-item-checkbox {
    width: 16px;
    height: 16px;
    line-height: 16px;
    margin-top: 3px;
    margin-right: 3px;
  }

</style>