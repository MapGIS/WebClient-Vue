<template>
  <div class="plot-symbol-panel">
    <mapgis-ui-input-search class="symbol-search" @search="onSearch" />
    <template v-for="(item, index) in dataCopy">
      <div :key="index">
        <div class="class-title" v-if="item.title">{{ item.title }}</div>
        <template v-for="(icons, key) in item.children">
          <mapgis-ui-title-collapse
            :title="icons.type"
            :key="key"
            :collapse="icons.collapse === undefined ? collapse : icons.collapse"
            :hasTopMargin="false"
            :hasBottomMargin="false"
            :class="[
              'class-content',
              icons.id == activeID ? 'activeColor' : ''
            ]"
            @change="chooseFolder(icons.id)"
          >
            <div
              v-for="(icon, i) in icons.icon"
              :key="key + '_' + i"
              class="icon-wrapper"
              :class="{ 'icon-wrapper-active': icon.id === currentIconID }"
              @click="onIconClick(icon, icons)"
            >
              <img
                :src="
                  `${baseUrl}${
                    icon.id
                  }?f=image&timestamp=${new Date().getTime()}`
                "
                :title="icon.name"
              />
            </div>
          </mapgis-ui-title-collapse>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-plot-symbol",
  props: {
    data: {
      type: [Array, Object]
    },
    // 控制图标折叠面板默认是折叠还是展开，该参数为true时折叠
    collapse: {
      type: Boolean,
      default: true
    },
    format: {
      type: Boolean,
      default: false
    },
    baseUrl: {
      type: String,
      default: ""
    },
    /**
     * 是否使用IGS作文文件服务，默认true
     */
    useIGS: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    data: {
      handler: function(obj) {
        if (!obj) return;
        if (this.format) {
          this.formatData();
        } else {
          this.dataCopy = obj;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      dataCopy: undefined,
      currentIconID: undefined,
      activeID: undefined
    };
  },
  methods: {
    chooseFolder(id) {
      this.activeID = id;
      this.$emit("chooseFolder", id);
    },
    formatData() {
      let result = [];
      let symbols = this.data.symbols || [];
      let vm = this;
      for (let i = 0; i < symbols.length; i++) {
        if (symbols[i].type === "folder") {
          result.push({
            children: [],
            title: symbols[i].name
          });
          let items = symbols[i].items || [];
          for (let j = 0; j < items.length; j++) {
            if (items[j].type === "folder") {
              //使用IGS作为文件服务，则根据symbolId获取图片
              if(vm.useIGS){
                result[i].children.push({
                  id: items[j].symbolId,
                  icon: [],
                  type: items[j].name
                });
              }else {
                //不使用IGS作为文件服务，则根据path获取图片
                result[i].children.push({
                  id: items[j].path,
                  //这样写是因为不想破坏UI的逻辑
                  symbolId: items[j].id,
                  icon: [],
                  type: items[j].name
                });
              }
              let icons = items[j].items || [];
              for (let k = 0; k < icons.length; k++) {
                if (icons[k].type !== "folder") {
                  //使用IGS作为文件服务，则根据symbolId获取图片
                  if(vm.useIGS){
                    result[i].children[j].icon.push({
                      id: icons[k].symbolId,
                      name: icons[k].name,
                      type: icons[k].type
                    });
                  }else {
                    //不使用IGS作为文件服务，则根据path获取图片
                    result[i].children[j].icon.push({
                      id: icons[k].path,
                      //这样写是因为不想破坏UI的逻辑
                      symbolId: icons[k].id,
                      name: icons[k].name,
                      type: icons[k].type
                    });
                  }
                }
              }
            }
          }
        }
      }
      this.dataCopy = result;
    },
    onSearch(value) {
      this.$emit("search", value);
    },
    onIconClick(icon, icons) {
      this.currentIconID = icon.id;
      this.$emit("click", { icon: icon, iconCol: icons });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../util/style/theme/theme.scss";
// 这个位置是行业标绘选择时候的颜色提示(后台也受此处控制)
.icon-wrapper-active {
  border: 1px solid $select-item-selected-color;
}
.activeColor {
  color: $select-item-selected-color;
  border: 1px solid $select-item-selected-color;
}
</style>
