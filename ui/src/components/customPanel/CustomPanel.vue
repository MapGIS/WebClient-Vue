<template>
  <div :id="id" class="custom-panel">
    <div v-for="(rects,index) in optionsCopy" :key="index">
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
      <!--      <div v-if="rects.type === 'Div'">-->
      <!--        <div v-for="(rect,index) in rects" :key="index" :style="rect.style" :class="rect.className">-->
      <!--          <div>-->
      <!--            {{ rect.title }}-->
      <!--          </div>-->
      <!--          <div v-for="(item,itemIndex) in rect.rows" :key="itemIndex">-->
      <!--            <mapgis-ui-row-->
      <!--                v-if="item.type === 'multiCols'"-->
      <!--                :ref="item.id"-->
      <!--            >-->
      <!--              <mapgis-ui-col-->
      <!--                  :span="12"-->
      <!--                  v-for="(child,index) in item.children"-->
      <!--                  :key="index"-->
      <!--              >-->
      <!--                <mapgis-ui-mix-row-->
      <!--                    v-if="child.type === 'MapgisUiInput'"-->
      <!--                    :title="child.title"-->
      <!--                    :value="child.value"-->
      <!--                    :type="child.type"-->
      <!--                    :titleStyle="child.titleStyle"-->
      <!--                />-->
      <!--              </mapgis-ui-col>-->
      <!--            </mapgis-ui-row>-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiInput'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :regExp="item.regExp"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiInputNumber'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiSlider'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiSelect'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiColorPicker'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <mapgis-ui-collapse v-if="rect.type === 'MapgisUiCollapse'">-->
      <!--        <mapgis-ui-collapse-panel :header="rect.title" v-for="(rect,index) in rects" :key="index"-->
      <!--                                  :style="rect.style" :class="rect.className">-->
      <!--          <div v-for="(item,itemIndex) in rect.rows" :key="itemIndex">-->
      <!--            <mapgis-ui-row-->
      <!--                v-if="item.type === 'multiCols'"-->
      <!--                :ref="item.id"-->
      <!--            >-->
      <!--              <mapgis-ui-col-->
      <!--                  :span="12"-->
      <!--                  v-for="(child,index) in item.children"-->
      <!--                  :key="index"-->
      <!--              >-->
      <!--                <mapgis-ui-mix-row-->
      <!--                    v-if="child.type === 'MapgisUiInput'"-->
      <!--                    :title="child.title"-->
      <!--                    :value="child.value"-->
      <!--                    :type="child.type"-->
      <!--                />-->
      <!--              </mapgis-ui-col>-->
      <!--            </mapgis-ui-row>-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiInput'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :regExp="item.regExp"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiInputNumber'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiSlider'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiSelect'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiColorPicker'"-->
      <!--                :title="item.title"-->
      <!--                :value="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </mapgis-ui-collapse-panel>-->
      <!--      </mapgis-ui-collapse>-->
      <!--      <div v-if="rects.type === 'MapgisUiCard'">-->
      <!--        <mapgis-ui-card :title="rect.title" v-for="(rect,index) in rects" :key="index" :style="rect.style"-->
      <!--                        :class="rect.className">-->
      <!--          <div v-for="(item,itemIndex) in rect.rows" :key="itemIndex">-->
      <!--            <mapgis-ui-row-->
      <!--                v-if="item.type === 'multiCols'"-->
      <!--                :ref="item.id"-->
      <!--            >-->
      <!--              <mapgis-ui-col-->
      <!--                  :span="12"-->
      <!--                  v-for="(child,index) in item.children"-->
      <!--                  :key="index"-->
      <!--              >-->
      <!--                <mapgis-ui-row v-if="child.type === 'MapgisUiInput'">-->
      <!--                  <mapgis-ui-col span="6">-->
      <!--                    <p class="mix-row-title" :style="child.titleStyle">{{ child.title }}</p>-->
      <!--                  </mapgis-ui-col>-->
      <!--                  <mapgis-ui-col span="18">-->
      <!--                    <mapgis-ui-form-item-->
      <!--                        :validate-status="child.validateStatus"-->
      <!--                    >-->
      <!--                      <mapgis-ui-input-->
      <!--                          v-model="child.value"-->
      <!--                          :ref="child.id"-->
      <!--                          @change="$_change(child.id,child.value,child.filter)"-->
      <!--                      />-->
      <!--                    </mapgis-ui-form-item>-->
      <!--                    <mapgis-ui-form-item-->
      <!--                        validate-status="error"-->
      <!--                        :help="child.errorMessage"-->
      <!--                        v-if="child.validateStatus === 'error'"-->
      <!--                    />-->
      <!--                  </mapgis-ui-col>-->
      <!--                </mapgis-ui-row>-->
      <!--              </mapgis-ui-col>-->
      <!--            </mapgis-ui-row>-->
      <!--            <mapgis-ui-row v-if="item.type === 'MapgisUiInput'">-->
      <!--              <mapgis-ui-col :span="item.props.titleCol">-->
      <!--                <p class="mix-row-title" :style="item.titleStyle">{{ item.title }}</p>-->
      <!--              </mapgis-ui-col>-->
      <!--              <mapgis-ui-col :span="item.props.inputCol">-->
      <!--                <mapgis-ui-form-item-->
      <!--                    :validate-status="item.validateStatus"-->
      <!--                >-->
      <!--                  <mapgis-ui-input-->
      <!--                      v-model="item.value"-->
      <!--                      @change="$_change(item.id,item.value,item.filter)"-->
      <!--                      :ref="item.id"-->
      <!--                  />-->
      <!--                </mapgis-ui-form-item>-->
      <!--                <mapgis-ui-form-item-->
      <!--                    validate-status="error"-->
      <!--                    :help="item.errorMessage"-->
      <!--                    v-if="item.validateStatus === 'error'"-->
      <!--                />-->
      <!--              </mapgis-ui-col>-->
      <!--            </mapgis-ui-row>-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiInputNumber'"-->
      <!--                :title="item.title"-->
      <!--                v-model="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :props="item.props"-->
      <!--                @change="$_change(item.id,item.value,item.filter)"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiSlider'"-->
      <!--                :title="item.title"-->
      <!--                v-model="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :props="item.props"-->
      <!--                @change="$_change(item.id,item.value,item.filter)"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiSelect'"-->
      <!--                :title="item.title"-->
      <!--                v-model="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :props="item.props"-->
      <!--                :dataSource="item.dataSource"-->
      <!--                @change="$_change(item.id,item.value,item.filter)"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiGrediantSelect'"-->
      <!--                :title="item.title"-->
      <!--                v-model="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :props="item.props"-->
      <!--                :dataSource="item.dataSource"-->
      <!--                @change="$_change(item.id,item.value,item.filter)"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiColorPicker'"-->
      <!--                :title="item.title"-->
      <!--                v-model="item.value"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :props="item.props"-->
      <!--                @change="$_change(item.id,item.value,item.filter)"-->
      <!--            />-->
      <!--            <mapgis-ui-mix-row-->
      <!--                v-if="item.type === 'MapgisUiThemeList'"-->
      <!--                :type="item.type"-->
      <!--                :ref="item.id"-->
      <!--                :props="item.props"-->
      <!--                @change="$_change"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </mapgis-ui-card>-->
      <!--      </div>-->
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
        return []
      }
    },
  },
  watch: {
    options: {
      handler: function () {
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
    }
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
                  titleStyle = Object.assign(titleStyle, children[m].titleStyle);
                }
                children[m].titleStyle = titleStyle;
              }
              children[m].id = children[m].type + m + parseInt(Math.random() * 10000);
            }
          }
          if (rows[k].type === "MapgisUiInput") {
            rows[k]["validateStatus"] = "success";
            let props = {
              titleCol: 6,
              inputCol: 18,
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
          if (rects[i].type === "MapgisUiThemeList") {
            let listProps = this.$refs[rects[i].id][0].listProps
            forms[rects[i].id] = this.$_formatThemeList({
              "checkBoxArr": listProps.checkBoxArr,
              "colors": listProps.colors,
              "dataSource": listProps.dataSource,
              "startData": listProps.startData
            });
          }
        }
      }
      return forms;
    },
    $_formatThemeList(data) {
      let dataSource = data.dataSource;
      let checkBoxArr = data.checkBoxArr;
      let colors = data.colors;
      let newData = [];
      if (dataSource && dataSource.length > 0) {
        if (checkBoxArr && checkBoxArr.length > 0) {
          newData.push( {
            "min": data.startData,
            "max": dataSource[0],
            "color": colors[0],
            "checkBox": checkBoxArr[0]
          });
          for (let i = 0; i < dataSource.length; i++) {
            newData.push( {
              "min": dataSource[i - 1],
              "max": dataSource[i],
              "color": colors[i],
              "checkBox": checkBoxArr[i]
            });
          }
        } else {
          newData.push( {
            "min": data.startData,
            "max": dataSource[0],
            "color": colors[0]
          });
          for (let i = 1; i < dataSource.length; i++) {
            newData.push( {
              "min": dataSource[i - 1],
              "max": dataSource[i],
              "color": colors[i]
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
        console.log("---value, filter, id", value, filter, id)
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
}
</script>

<style scoped>
.custom-panel {
  width: 100%;;
  height: 100%;
}

/deep/ .mix-row-title {
  font-size: 12px;
  position: absolute;
  top: 8px;
}
</style>