<template>
  <div>
    <mapgis-ui-space>
      <mapgis-ui-select
        :size="size"
        style="width: 80px"
        :default-value="currentType"
        @change="handleTypeChange"
      >
        <mapgis-ui-select-option
          :value="l.name"
          v-for="(l, i) in list"
          :key="i"
        >
          {{ l.name }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
      <mapgis-ui-select
        :size="size"
        style="width: 274px"
        :default-value="currentColor"
        @change="handleColorChange"
      >
        <mapgis-ui-select-option
          :value="c.title"
          v-for="(c, i) in colors"
          :key="i"
        >
          {{ c.title }}
          <img class="mapgis-ui-d3-color-item" :src="c.icon" />
        </mapgis-ui-select-option>
      </mapgis-ui-select>
    </mapgis-ui-space>
  </div>
</template>

<script>
import { Schemes, Interpolates } from "./d3/color";

export default {
  name: "mapgis-ui-d3-colorpick",
  props: {
    size: {
      type: String,
      default: "size"
    },
    type: {
      type: String,
      default: "interpolates" // interpolates schemes
    }
  },
  data() {
    return {
      list: this.parseList(),
      colors: this.parseColors(),
      schemes: Schemes,
      interpolates: Interpolates,
      currentType: undefined,
      currentColor: undefined
    };
  },
  methods: {
    parseList() {
      if (this.type == "interpolates") {
        this.currentType = "对比色";
        return Interpolates;
      } else {
        this.currentType = "类型配色";
        return Schemes;
      }
    },
    parseColors() {
      const { type } = this;
      if (type == "interpolates") {
        this.currentType = this.currentType || "对比色";
      } else {
        this.currentType = this.currentType || "类型配色";
      }
      let types = type == "interpolates" ? Interpolates : Schemes;
      let find = types.find(t => t.name == this.currentType);
      if (find) {
        return find.value;
      } else {
        return [];
      }
    },
    handleTypeChange(type) {
      this.currentType = type;
      this.colors = this.parseColors();
    },
    handleColorChange(color) {
      this.currentColor = color;
      const { type, currentType } = this;
      let types = type == "interpolates" ? Interpolates : Schemes;
      let findtype = types.find(t => t.name == currentType);
      let findcolor = findtype.value.find(y => y.title == color);
      this.$emit("change", findcolor);
    }
  }
};
</script>
