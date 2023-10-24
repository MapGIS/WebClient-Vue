<template>
  <div :id="id" class="custom-panel">
    <div v-for="(rects, index) in optionsCopy" :key="index">
      <mapgis-ui-mix-row
        :type="rects.type"
        :ref="rects.id"
        :value="rects.value"
        :dataSource="rects.dataSource"
        :panelId="id"
        :props="rects.props"
        :customProps="rects.customProps"
        @change="$_change"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-custom-panel",
  props: {
    /**
     * 组合面板的参数数组
     * */
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    options: {
      handler: function() {
        this.optionsCopy = this.options;
      },
      deep: true
    }
  },
  data() {
    return {
      optionsCopy: [],
      rowsId: [],
      id: "custom-panel" + parseInt(String(Math.random() * 10000))
    };
  },
  created() {
    this.optionsCopy = this.options;
    // this.$_initOptions();
  },
  methods: {
    $_initOptions() {
      this.optionsCopy = this.options;
      for (let i = 0; i < this.optionsCopy.rects.length; i++) {
        let className = this.optionsCopy.rects[i].className;
        if (typeof className === "string") {
          className = className.split(",");
          let classObj = {};
          for (let j = 0; j < className.length; j++) {
            classObj[className[i]] = true;
          }
          this.optionsCopy.rects[i].className = classObj;
        }
        let rows = this.optionsCopy.rects[i].rows;
        for (let k = 0; k < rows.length; k++) {
          if (!rows[k].hasOwnProperty("id")) {
            rows[k].id = rows[k].type + i + parseInt(Math.random() * 10000);
          }
          this.rowsId.push(rows[k].id);
          if (rows[k].type === "multiCols") {
            let children = rows[k].children;
            for (let m = 0; m < children.length; m++) {
              if (m % 2 === 1) {
                let titleStyle = {
                  paddingLeft: "8px"
                };
                if (children[m].hasOwnProperty("titleStyle")) {
                  titleStyle = Object.assign(
                    titleStyle,
                    children[m].titleStyle
                  );
                }
                children[m].titleStyle = titleStyle;
              }
              children[m].id =
                children[m].type + m + parseInt(Math.random() * 10000);
            }
          }
          if (rows[k].type === "MapgisUiInput") {
            rows[k]["validateStatus"] = "success";
            let props = {
              titleCol: 6,
              inputCol: 18
            };
            if (!rows[k].hasOwnProperty("props")) {
              rows[k].props = props;
            }
            rows[k].props = Object.assign(props, rows[k].props);
          }
        }
      }
    },
    $_getForm(rectId) {
      let forms = {};
      if (rectId) {
      } else {
        let rects = this.options;
        for (let i = 0; i < rects.length; i++) {
          let listProps = this.$refs[rects[i].id][0].listProps;
          switch (rects[i].type) {
            case "MapgisUiThemeList":
              forms[rects[i].id] = this.$_formatThemeList({
                checkBoxArr: listProps.checkBoxArr,
                colors: listProps.colors,
                dataSource: listProps.dataSource,
                startData: listProps.startData
              });
              break;
            case "MapgisUiThemeListSymbol":
              forms[rects[i].id] = this.$_formatThemeListSymbol({
                checkBoxArr: listProps.checkBoxArr,
                radius: listProps.radius,
                dataSource: listProps.dataSource,
                startData: listProps.startData
              });
              break;
            case "MapgisUiExplosionRange":
              forms[rects[i].id] = this.$_formatExplosionRange({
                checkBoxArr: listProps.checkBoxArr,
                directions: listProps.directions,
                dataSource: listProps.dataSource,
                startData: listProps.startData
              });
              break;
            case "MapgisUiExplosionUnique":
              forms[rects[i].id] = this.$_formatExplosionUnique({
                checkBoxArr: listProps.checkBoxArr,
                directions: listProps.directions,
                dataSource: listProps.dataSource,
                ids: listProps.ids
              });
              break;
          }
        }
      }
      return forms;
    },
    $_formatExplosionUnique(data) {
      let dataSource = data.dataSource;
      let checkBoxArr = data.checkBoxArr;
      let directions = data.directions;
      let ids = data.ids;
      let newData = [];
      if (dataSource && dataSource.length > 0) {
        if (checkBoxArr && checkBoxArr.length > 0) {
          newData.push({
            value: dataSource[0],
            direction: directions[0],
            id: ids[0],
            checkBox: checkBoxArr[0]
          });
          for (let i = 0; i < dataSource.length; i++) {
            newData.push({
              value: dataSource[i],
              direction: directions[i],
              id: ids[i],
              checkBox: checkBoxArr[i]
            });
          }
        } else {
          /*** 爆炸分析属性单值的格式：
          valueGroups: [
            //field字段所对应分段爆炸样式，默认用direction
           {
            value: 30, //字段值
            direction: 0,0,1000// 爆炸方向设置，对应new Cesium.Cartesian3(0,0,1000)
          }]
          */
          newData.push({
            value: dataSource[0],
            direction: directions[0],
            id: ids[0]
          });
          for (let i = 1; i < dataSource.length; i++) {
            newData.push({
              value: dataSource[i],
              direction: directions[i],
              id: ids[i]
            });
          }
        }
      }
      return newData;
    },
    $_formatExplosionRange(data) {
      let dataSource = data.dataSource;
      let checkBoxArr = data.checkBoxArr;
      let directions = data.directions;
      let newData = [];
      if (dataSource && dataSource.length > 0) {
        if (checkBoxArr && checkBoxArr.length > 0) {
          newData.push({
            start: data.startData,
            end: dataSource[0],
            direction: directions[0],
            checkBox: checkBoxArr[0]
          });
          for (let i = 0; i < dataSource.length; i++) {
            newData.push({
              start: dataSource[i - 1],
              end: dataSource[i],
              direction: directions[i],
              checkBox: checkBoxArr[i]
            });
          }
        } else {
          /*** 爆炸分析属性分段的格式：
          valueGroups: [
            //field字段所对应分段爆炸样式，默认用direction
           {
            start: 0, //起始值
            end: 30, //结束值
            direction: 0,0,1000// 爆炸方向设置，对应new Cesium.Cartesian3(0,0,1000)
          }]
          */
          newData.push({
            start: data.startData,
            end: dataSource[0],
            direction: directions[0]
          });
          for (let i = 1; i < dataSource.length; i++) {
            newData.push({
              start: dataSource[i - 1],
              end: dataSource[i],
              direction: directions[i]
            });
          }
        }
      }
      return newData;
    },
    $_formatThemeListSymbol(data) {
      let dataSource = data.dataSource;
      let checkBoxArr = data.checkBoxArr;
      let radius = data.radius;
      let newData = [];
      if (dataSource && dataSource.length > 0) {
        if (checkBoxArr && checkBoxArr.length > 0) {
          newData.push({
            start: data.startData,
            end: dataSource[0],
            style: { radius: radius[0], color: "#FF9933" },
            checkBox: checkBoxArr[0]
          });
          for (let i = 0; i < dataSource.length; i++) {
            newData.push({
              start: dataSource[i - 1],
              end: dataSource[i],
              style: { radius: radius[i], color: "#FF9933" },
              checkBox: checkBoxArr[i]
            });
          }
        } else {
          /*** 等级符号专题图的格式：
          styleGroups: [
            //field字段所对应专题图样式，默认用style
           {
            start: 0, //起始值
            end: 30, //结束值
            style: {
             //分段样式，注意不可更改符号
             radius: 10, //设定符号大小
             color:'#FF9933' // 兼容三维，目前三维还是以绘制实心圆的方式，表示符号，需要设置color。
             //  界面上暂时不支持设置color字段，后期等三维专题服务确定后，再处理这块
            },
          }]
          */
          newData.push({
            start: data.startData,
            end: dataSource[0],
            style: { radius: radius[0], color: "#FF9933" }
          });
          for (let i = 1; i < dataSource.length; i++) {
            newData.push({
              start: dataSource[i - 1],
              end: dataSource[i],
              style: { radius: radius[i], color: "#FF9933" }
            });
          }
        }
      }
      return newData;
    },
    $_formatThemeList(data) {
      let dataSource = data.dataSource;
      let checkBoxArr = data.checkBoxArr;
      let colors = data.colors;
      let newData = [];
      if (dataSource && dataSource.length > 0) {
        if (checkBoxArr && checkBoxArr.length > 0) {
          newData.push({
            min: data.startData,
            max: dataSource[0],
            color: colors[0],
            checkBox: checkBoxArr[0]
          });
          for (let i = 0; i < dataSource.length; i++) {
            newData.push({
              min: dataSource[i - 1],
              max: dataSource[i],
              color: colors[i],
              checkBox: checkBoxArr[i]
            });
          }
        } else {
          /***分段专题图的格式：
          styleGroups: [
           //field字段所对应的专题图分段值样式设置，默认用style
          {
            start: 0, //起始值
            end: 30, //结束值
            style: {
              //分段样式
              color: "#FF0000", //设定填充颜色
            },
          }]
          */
          newData.push({
            start: data.startData,
            end: dataSource[0],
            style: { color: colors[0] }
          });
          for (let i = 1; i < dataSource.length; i++) {
            newData.push({
              start: dataSource[i - 1],
              end: dataSource[i],
              style: { color: colors[i] }
            });
          }
        }
      }
      return newData;
    },
    $_change(id, value, filter, extra, extra2) {
      //正则判断
      if (filter && typeof filter === "string") {
        let reg = new RegExp(filter);
        this.$_showError(reg.test(value), id);
      }
      //简单sql语句
      if (filter && filter instanceof Array) {
        let flag = true;
        for (let i = 0; i < filter.length; i += 2) {
          flag = this.$_filter(filter[i], filter[i + 1], value);
          if (!flag) {
            break;
          }
        }
        this.$_showError(flag, id);
      }
      //自定义过滤函数
      if (filter && filter instanceof Function) {
        this.$_showError(filter(id, value, this), id);
      }
      if (id === "MapgisUiThemeListCheckBox") {
        this.$emit("formChanged", value, filter, id, extra, extra2);
      } else if (id === "MapgisUiThemeListColor") {
        this.$emit("formChanged", value, filter, id);
      } else {
        this.$emit("formChanged", id, value, this.$_getForm());
      }
    },
    $_showError(flag, id) {
      if (flag) {
        this.$_setValueById(id, "validateStatus", "success");
      } else {
        this.$_setValueById(id, "validateStatus", "error");
      }
    },
    $_filter(filter, filterValue, value) {
      let flag;
      if (filter !== "in") {
        value = Number(value);
      }
      switch (filter) {
        case ">":
          if (value > filterValue) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case ">=":
          if (value >= filterValue) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case "<":
          if (value < filterValue) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case "<=":
          if (value <= filterValue) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case "=":
          if (value === filterValue) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case "!=":
          if (value !== filterValue) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case "in":
          if (value.indexOf(filterValue) > -1) {
            flag = true;
          } else {
            flag = false;
          }
          break;
      }
      return flag;
    },
    $_setValueById(id, key, value) {
      let rects = this.options.rects;
      for (let i = 0; i < rects.length; i++) {
        let rows = rects[i].rows;
        for (let j = 0; j < rows.length; j++) {
          if (rows[j].type !== "multiCols") {
            if (rows[j].id === id) {
              rows[j][key] = value;
            }
          } else {
            let children = rows[j].children;
            for (let k = 0; k < children.length; k++) {
              if (children[k].id === id) {
                children[k][key] = value;
              }
            }
          }
        }
      }
    },
    $_getValueById(id, key) {
      let value;
      let rects = this.options.rects;
      for (let i = 0; i < rects.length; i++) {
        let rows = rects[i].rows;
        for (let j = 0; j < rows.length; j++) {
          if (rows[j].type !== "multiCols") {
            if (rows[j].id === id) {
              value = rows[j][key];
            }
          } else {
            let children = rows[j].children;
            for (let k = 0; k < children.length; k++) {
              if (children[k].id === id) {
                value = children[k][key];
              }
            }
          }
        }
      }
      return value;
    },
    getValue(id) {
      return this.$_getValueById(id, "value");
    }
  }
};
</script>

<style scoped>
.custom-panel {
  width: 100%;
  height: 100%;
}

/deep/ .mix-row-title {
  font-size: 12px;
  position: absolute;
  top: 8px;
}
</style>
