<template>
  <div :id="id">
    <slot :popup="popupOptionsCopy">
      <!--    外边框-->
      <div class="mapgis-popup-container"
           :class="popupOptionsCopy.class.containerClass"
           :style="popupOptionsCopy.style.containerStyle"
      >
        <!--标题-->
        <div class="mapgis-popup-title"
             :class="popupOptionsCopy.class.titleClass"
             :style="popupOptionsCopy.style.titleStyle"
             v-if="popupOptionsCopy.title"
             @click="$_click(popupOptionsCopy.title)"
        >
          {{ popupOptionsCopy.title }}
        </div>
        <!--一行数据-->
        <div :class="[defaultRowClass,popupOptionsCopy.class.rowClass]"
             :style="popupOptionsCopy.style.rowStyle"
             :key="index" v-for="(field,index) in popupOptionsCopy.fields"
        >
          <!--前置元素-->
          <span v-if="popupOptionsCopy.type === 'point'" class='mapgis-popup-point'></span>
          <!--字段名-->
          <span :class="[defaultFieldClass,popupOptionsCopy.class.fieldClass]"
                :style="popupOptionsCopy.style.fieldStyle"
                :title="$_getField(field)"
                @click="$_click(field, $_getField(field))"
          >
          {{ $_getField(field) }}
        </span>
          <!--字段值-->
          <span :class="[defaultFieldClass,popupOptionsCopy.class.valueClass]"
                :style="popupOptionsCopy.style.valueStyle"
                :title="$_getValue(field)"
                @click="$_click($_getValue(field))"
          >
          {{ $_getValue(field) }}
        </span>
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
          containerStyle: {},
          titleStyle: {},
          rowStyle: {},
          fieldStyle: {},
          valueStyle: {},
        },
        fields: [],
        feature: {
          geometry: {},
          properties: {}
        }
      }
    }
  },
  watch: {
    popupOptions: {
      handle: function () {
        this.$_init();
      },
      deep: true
    }
  },
  computed: {
    defaultRowClass() {
      return {
        "mapgis-popup-underline-row": this.popupOptionsCopy.type === "default" || this.popupOptionsCopy.type === "underline",
        "mapgis-popup-table-row": this.popupOptionsCopy.type === "table",
        "mapgis-popup-point-row": this.popupOptionsCopy.type === "point",
      }
    },
    defaultValueClass() {
      return {
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-value": this.popupOptionsCopy.type === "default",
        "mapgis-popup-item mapgis-popup-table-item mapgis-popup-field mapgis-popup-table-field": this.popupOptionsCopy.type === "table",
        "mapgis-popup-item mapgis-popup-point-item mapgis-popup-field mapgis-popup-point-field": this.popupOptionsCopy.type === "point",
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-field mapgis-popup-underline-field": this.popupOptionsCopy.type === "underline",
      }
    },
    defaultFieldClass() {
      return {
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-field mapgis-popup-underline-field": this.popupOptionsCopy.type === "default",
        "mapgis-popup-item mapgis-popup-table-item mapgis-popup-value mapgis-popup-table-value": this.popupOptionsCopy.type === "table",
        "mapgis-popup-item mapgis-popup-point-item mapgis-popup-value mapgis-popup-point-value": this.popupOptionsCopy.type === "point",
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-value": this.popupOptionsCopy.type === "underline",
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
    $_click(value, value2) {
      this.$emit("click", value, value2);
    },
    $_init() {
      this.popupOptionsCopy = Object.assign(this.popupOptionsCopy, this.popupOptions);
      //如果fields不是数组，则重置为数组
      if (!(this.popupOptionsCopy.fields instanceof Array)) {
        this.popupOptionsCopy.fields = [];
      }
      //如果fields数量为0，则取得properties里的所有健名
      if (this.popupOptionsCopy.fields.length === 0) {
        this.popupOptionsCopy.fields = Object.keys(this.popupOptionsCopy.feature.properties);
      }
    },
    $_getField(field) {
      let alias = this.popupOptionsCopy.alias;
      if (alias.hasOwnProperty(field)) {
        field = alias[field];
      }
      return field;
    },
    $_getValue(field) {
      let value = "", properties = this.popupOptionsCopy.feature.properties;
      if (properties.hasOwnProperty(field)) {
        value = properties[field];
      }
      return value;
    }
  }
}
</script>

<style scoped>

</style>