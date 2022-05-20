<template>
  <div class="plot-symbol-panel">
    <mapgis-ui-input-search class="symbol-search" @search="onSearch" />
    <template v-for="(item, index) in dataCopy">
      <div :key="index">
        <div class="class-title" v-if="item.title">{{ item.title }}</div>
        <template v-for="(icons, key) in item.children">
          <mapgis-ui-title-collapse
            :title="icons.title"
            :key="key"
            :collapse="collapse"
            :hasTopMargin="false"
            :hasBottomMargin="false"
            class="class-content"
          >
            <div
              v-for="(src, i) in icons.icon"
              :key="key + '_' + i"
              class="icon-wrapper"
              @click="onIconClick(src, icons)"
            >
              <img :src="src" />
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
      type: Array,
      required: true
    },
    // 控制图标折叠面板默认是折叠还是展开，该参数为true时折叠
    collapse: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    data: {
      handler: function(obj) {
        this.dataCopy = obj;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      dataCopy: undefined
    };
  },
  methods: {
    onSearch(value) {
      this.$emit("search", value);
      console.log("search", value);
    },
    onIconClick(icon, icons) {
      this.$emit("click", { icon: icon, iconCol: icons });
      console.log("click", { icon: icon, iconCol: icons });
    }
  }
};
</script>
