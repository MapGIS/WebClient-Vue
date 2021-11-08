<template>
  <mapgis-ui-space class="mapgis-ui-sprite-symbol-wrapper1">
    <mapgis-ui-select
      show-search
      class="mapgis-ui-sprite-select"
      :default-value="defaultValue"
      :size="size"
      @change="updateSpriteItem"
      @blur="updateSpriteItem"
      @select="handleSpriteSelect"
      @search="updateSpriteItem"
      @popupScroll="updateSpriteItem"
    >
      <mapgis-ui-select-option
        v-for="(k, i) in Object.keys(json)"
        :key="i"
        :value="k"
      >
        <div class="mapgis-ui-sprite-symbol-wrapper">
          <canvas class="mapgis-ui-sprite-symbol-canvas" :id="`sprite-${k}`" />
          <span class="mapgis-ui-sprite-symbol-text">{{ k }}</span>
        </div>
      </mapgis-ui-select-option>
    </mapgis-ui-select>
    <mapgis-ui-button :size="size" shape="circle" @click="showModal"
      >符</mapgis-ui-button
    >
    <mapgis-ui-modal
      forceRender
      title="符号库"
      :visible="show"
      :width="width"
      :height="height"
      @ok="show = false"
      @cancel="show = false"
    >
      <canvas ref="mapgis-ui-sprite-canvas" />
    </mapgis-ui-modal>
  </mapgis-ui-space>
</template>
<script>
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-sprite-select",
  mixins: [ThemeMixin],
  props: {
    url: {
      type: String,
      required: true
    },
    defaultValue: {
      type: String
    },
    size: { type: String, default: "small" }
  },
  data() {
    return {
      json: {},
      png: undefined,
      base64: undefined,
      width: 512,
      height: 512,
      show: false
    };
  },
  watch: {
    url: function(next) {
      if (next) this.initSprite();
    },
    defaultValue: function(next) {}
  },
  computed: {},
  created() {},
  mounted() {
    if (this.url) {
      this.initSprite();
    }
  },
  methods: {
    showModal() {
      this.show = true;
    },
    initSprite() {
      let { url } = this;
      if (!url) return;
      let vm = this;

      let jsonUrl = fetch(`${url}.json`).then(response => response.json());
      let pngUrl = fetch(`${url}.png`, {
        method: "get",
        responseType: "arraybuffer"
      })
        .then(response => response.arrayBuffer())
        .then(response => {
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(response).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        });

      Promise.all([pngUrl, jsonUrl]).then(([base64, json]) => {
        let spriteImage = new Image();
        spriteImage.src = base64;
        vm.png = spriteImage;
        vm.base64 = base64;
        vm.json = json;
        vm.initCanvas(base64, json);
      });
    },
    initCanvas(base64, json) {
      const vm = this;
      let canvas = this.$refs["mapgis-ui-sprite-canvas"];
      const ctx = canvas.getContext("2d");
      let image = new Image();
      image.onload = function() {
        let { height, width } = image;
        canvas.width = width;
        canvas.height = height;
        vm.width = width + 40;
        vm.height = height + 40;
        ctx.drawImage(image, 0, 0);
        localStorage.setItem("base64", base64);
        vm.$emit("iconLoaded", json);
      };
      image.src = base64;
    },
    updateSpriteItem() {
      let { json } = this;
      Object.keys(json).forEach(k => {
        this.getSpriteIcon(k);
      });
    },
    /**
     * @param icon 图片名称
     */
    getSpriteIcon(icon) {
      let pngImage = this.png;
      let json = this.json;
      let canvas = document.getElementById(`sprite-${icon}`);
      if (canvas && pngImage && json && json[icon]) {
        let pattern;
        const item = json[icon];
        const { width, height, x, y } = item;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return undefined;
        ctx.drawImage(pngImage, x, y, width, height, 0, 0, width, height);
        pattern = ctx.createPattern(canvas, "repeat");
        return pattern;
      }
      return undefined;
    },
    handleSpriteSelect(item) {
      this.$emit("change", item);
    }
  }
};
</script>
