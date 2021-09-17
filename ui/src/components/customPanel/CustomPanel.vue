<template>
  <div>
    <div>
      {{ optionsCopy.title }}
    </div>
    <div v-for="(rect,index) in optionsCopy.rects" :key="index" :style="rect.style" :class="rect.className">
      <div>
        {{ rect.title }}
      </div>
      <div v-for="(item,itemIndex) in rect.rows" :key="itemIndex">
        <mapgis-ui-row
            v-if="item.type === 'multiCols'"
            :ref="item.id"
        >
          <mapgis-ui-col
              :span="12"
              v-for="(child,index) in item.children"
              :key="index"
          >
            <mapgis-ui-mix-row
                v-if="child.type === 'MapgisUiInput'"
                :title="child.title"
                :value="child.value"
                :type="child.type"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-mix-row
            v-if="item.type === 'MapgisUiInput'"
            :title="item.title"
            :value="item.value"
            :type="item.type"
            :ref="item.id"
            :regExp="item.regExp"
        />
        <mapgis-ui-mix-row
            v-if="item.type === 'MapgisUiInputNumber'"
            :title="item.title"
            :value="item.value"
            :type="item.type"
            :ref="item.id"
        />
        <mapgis-ui-mix-row
            v-if="item.type === 'MapgisUiSlider'"
            :title="item.title"
            :value="item.value"
            :type="item.type"
            :ref="item.id"
        />
        <mapgis-ui-mix-row
            v-if="item.type === 'MapgisUiSelect'"
            :title="item.title"
            :value="item.value"
            :type="item.type"
            :ref="item.id"
        />
        <mapgis-ui-mix-row
            v-if="item.type === 'MapgisUiColorPicker'"
            :title="item.title"
            :value="item.value"
            :type="item.type"
            :ref="item.id"
        />
      </div>
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
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      optionsCopy: undefined,
      rowsId: []
    }
  },
  created() {
    this.$_initOptions();
  },
  methods: {
    $_initOptions() {
      this.optionsCopy = this.options;
      for (let i = 0; i < this.optionsCopy.rects.length; i++) {
        let className = this.optionsCopy.rects[i].className;
        className = className.split(",");
        let classObj = {};
        for (let j = 0; j < className.length; j++) {
          classObj[className[i]] = true;
        }
        this.optionsCopy.rects[i].className = classObj;
        let rows = this.optionsCopy.rects[i].rows;
        for (let k = 0; k < rows.length; k++) {
          if (!rows[k].hasOwnProperty("id")) {
            rows[k].id = rows[k].type + i + parseInt(Math.random() * 10000);
          }
          this.rowsId.push(rows[k].id);
        }
      }
    },
    $_getForm(rectId) {
      console.log("this.rowsId",this.rowsId)
      console.log("this.$refs",this.$refs)
      let forms = {};
      if (rectId) {

      } else {
        for (let i=0;i<this.rowsId.length;i++){
          if(this.rowsId[i].indexOf("multiCols") <0){
            console.log("this.$refs[this.rowsId[i]]",this.$refs[this.rowsId[i]][0].valueCopy)
            forms[this.rowsId[i]] = this.$refs[this.rowsId[i]][0].valueCopy;
          }
        }
      }
      console.log("forms",forms)
    }
  }
}
</script>

<style scoped>
</style>