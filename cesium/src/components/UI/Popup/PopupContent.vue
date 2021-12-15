<template>
  <div :id="id">
    <slot :popup="popupOptionsCopy">
      <!--    外边框-->
      <div class="mapgis-popup-container"
           :class="popupOptionsCopy.class.containerClass"
           :style="[popupOptionsCopy.style.containerStyle]"
      >
        <!--图片-->
        <mapgis-ui-carousel autoplay>
          <div :key="index" v-for="(image,index) in feature.properties.images">
            <img class="mapgis-ui-story-panel-large-carousel-img" :src="image" alt="">
          </div>
        </mapgis-ui-carousel>
        <!--标题-->
        <div class="mapgis-popup-title"
             :class="popupOptionsCopy.class.titleClass"
             :style="popupOptionsCopy.style.titleStyle"
             v-if="popupOptionsCopy.title"
             @click="$_clickTitle(popupOptionsCopy.title)"
        >
          {{ popupOptionsCopy.title }}
        </div>
        <div class="mapgis-popup-content-row-container"
             :style="{maxHeight: popupOptionsCopy.scrollNum * rowHeight + 'px', overflowY: popupOptionsCopy.fields.length > popupOptionsCopy.scrollNum ? 'scroll' : 'auto'}"
        >
          <div :key="index" v-for="(field,index) in popupOptionsCopy.fields">
            <!--一行数据-->
            <div class="mapgis-popup-row"
                 :class="[defaultRowClass,popupOptionsCopy.class.rowClass]"
                 :style="popupOptionsCopy.style.rowStyle"
                 v-if="field !== 'images'"
            >
              <!--前置元素-->
              <span v-if="popupOptionsCopy.popupType === 'point'" class='mapgis-popup-point'></span>
              <!--字段名-->
              <span :class="[defaultFieldClass,popupOptionsCopy.class.fieldClass]"
                    :style="popupOptionsCopy.style.fieldStyle"
                    :title="$_getField(field)"
                    @click="$_click(index, 0, field, $_getField(field))"
              >
          {{ $_getField(field) }}
          </span>
              <!--字段值-->
              <span :class="[defaultValueClass,popupOptionsCopy.class.valueClass]"
                    :style="popupOptionsCopy.style.valueStyle"
                    :title="$_getValue(field)"
                    @click="$_click(index, 1, $_getValue(field))"
              >
          {{ $_getValue(field) }}
          </span>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-popup-content",
  props: {
    popupOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    feature: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      id: new Date().getTime(),
      popupOptionsCopy: {
        type: "default",
        title: "",
        alias: {},
        class: {
          containerClass: "",
          titleClass: "",
          rowClass: "",
          fieldClass: "",
          valueClass: "",
        },
        style: {
          containerStyle: {
            width: "300px"
          },
          titleStyle: {},
          rowStyle: {},
          fieldStyle: {},
          valueStyle: {},
        },
        fields: [],
        feature: {
          geometry: {},
          properties: {}
        },
        scrollNum: 4
      },
      rowHeight: 30,
      titleHeight: 30,
      showCarousel: false
    }
  },
  watch: {
    popupOptions: {
      handler: function () {
        this.$_init();
      },
      deep: true
    }
  },
  computed: {
    defaultRowClass() {
      return {
        "mapgis-popup-underline-row": this.popupOptionsCopy.popupType === "default" || this.popupOptionsCopy.popupType === "card" || this.popupOptionsCopy.popupType === "underline",
        "mapgis-popup-table-row": this.popupOptionsCopy.popupType === "table",
        "mapgis-popup-point-row": this.popupOptionsCopy.popupType === "point",
      }
    },
    defaultValueClass() {
      return {
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-value": this.popupOptionsCopy.popupType === "default" || this.popupOptionsCopy.popupType === "card",
        "mapgis-popup-item mapgis-popup-table-item mapgis-popup-value mapgis-popup-table-value": this.popupOptionsCopy.popupType === "table",
        "mapgis-popup-item mapgis-popup-point-item mapgis-popup-value mapgis-popup-point-value": this.popupOptionsCopy.popupType === "point",
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-value mapgis-popup-underline-value": this.popupOptionsCopy.popupType === "underline",
      }
    },
    defaultFieldClass() {
      return {
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-field mapgis-popup-underline-field": this.popupOptionsCopy.popupType === "default" || this.popupOptionsCopy.popupType === "card",
        "mapgis-popup-item mapgis-popup-table-item mapgis-popup-value mapgis-popup-table-value": this.popupOptionsCopy.popupType === "table",
        "mapgis-popup-item mapgis-popup-point-item mapgis-popup-value mapgis-popup-point-value": this.popupOptionsCopy.popupType === "point",
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-value": this.popupOptionsCopy.popupType === "underline",
      }
    }
  },
  mounted() {
    this.$_init();
    this.$emit("load", this);
  },
  methods: {
    getElement() {
      return document.getElementById(String(this.id));
    },
    $_click(row, col, value, value2) {
      this.$emit("click", row, col, value, value2);
    },
    $_clickTitle(value) {
      this.$emit("clickTitle", value);
    },
    $_init() {
      this.popupOptionsCopy = Object.assign(this.popupOptionsCopy, this.popupOptions);
      //如果fields不是数组，则重置为数组
      if (!(this.popupOptionsCopy.fields instanceof Array)) {
        this.popupOptionsCopy.fields = [];
      }
      //如果fields数量为0，则取得properties里的所有健名
      if (this.popupOptionsCopy.fields.length === 0) {
        this.popupOptionsCopy.fields = Object.keys(this.feature.properties);
      }
      if (this.popupOptionsCopy.popupType === 'card') {
        if (this.feature.properties && this.feature.properties.images) {
          if (typeof this.feature.properties.images === "string") {
            this.feature.properties.images = this.feature.properties.images.split(";");
            this.showCarousel = true;
          } else if (this.feature.properties.images instanceof Array) {
            this.showCarousel = true;
          }
        }
      }
      this.$nextTick(function () {
        // let rows =  document.getElementsByClassName("mapgis-popup-row");
        // let title =  document.getElementsByClassName("mapgis-popup-title");
        // this.titleHeight = title[0] ? title[0].clientHeight + 2 : 34;
        // this.rowHeight =  rows[0] ? rows[0].clientHeight + 1 : 33;
        this.titleHeight = 34;
        this.rowHeight = 33;
      });
    },
    $_getField(field) {
      let alias = this.popupOptionsCopy.alias;
      if (alias.hasOwnProperty(field)) {
        field = alias[field];
      }
      return field;
    },
    $_getValue(field) {
      let value = "", properties = this.feature.properties;
      if (properties.hasOwnProperty(field)) {
        value = properties[field];
      }
      return value;
    }
  }
}
</script>

<style scoped>
.mapgis-ui-story-panel-large-carousel-img {
  width: 100%;
  height: 168.75px;
}
</style>