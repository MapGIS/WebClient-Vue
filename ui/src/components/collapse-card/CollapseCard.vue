<template>
  <div v-show="visible" :style="outStyle" class="mapgis-ui-collapse-card">
    <mapgis-ui-button
      shape="circle"
      v-if="collapse"
      :class="getPositionClassName()"
      @click="show"
      ><mapgis-ui-iconfont
        :type="iconfont"
        class="mapgis-ui-collapse-card-iconfont"
      />
    </mapgis-ui-button>
    <transition name="bounce">
      <mapgis-ui-card v-if="!collapse" :bordered="false" size="small">
        <slot name="title"></slot>
        <slot></slot>
      </mapgis-ui-card>
    </transition>
  </div>
</template>
<script>
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-collapse-card",
  mixins: [ThemeMixin],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          right: "10px",
          bottom: "10px"
        };
      }
    },
    iconfont: {
      type: [String, Node],
      default: "mapgis-yingyan"
    },
    visible: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: "bottom-right" // top-left top-right bottom-left bottom-right
    }
  },
  data() {
    return {
      collapse: false
    };
  },
  computed: {
    rotateDeg() {
      return {
        "top-right": ["rotate(-45deg)", "rotate(135deg)"],
        "top-left": ["rotate(-135deg)", "rotate(45deg)"],
        "bottom-left": ["rotate(135deg)", "rotate(-45deg)"],
        "bottom-right": ["rotate(45deg)", "rotate(-135deg)"]
      };
    },
    hasHeaderRotateDeg() {
      return {
        "top-right": ["rotate(-45deg)", "rotate(135deg)"],
        "top-left": ["rotate(-135deg)", "rotate(45deg)"],
        "bottom-left": ["rotate(-135deg)", "rotate(45deg)"],
        "bottom-right": ["rotate(-45deg)", "rotate(135deg)"]
      };
    }
  },
  created() {},
  mounted() {},
  methods: {
    show() {
      this.collapse = false;
      console.log("show", this.collapse);
    },
    hide() {
      this.collapse = true;
    },
    getPositionClassName() {
      let { position } = this;
      let className = "mapgis-ui-collapse-card-button ";
      switch (position) {
        case "right":
        case "top-right":
        case "bottom-right":
          className += "mapgis-mvt-legend-card-right";
          break;
        case "left":
        case "top-left":
        case "bottom-left":
          className += "mapgis-mvt-legend-card-left";
          break;
      }
      return className;
    }
  }
};
</script>
<style>
.mapgis-ui-collapse-card-iconfont {
  font-size: 22px;
}

.mapgis-mvt-legend-card-left {
  float: left;
}

.mapgis-mvt-legend-card-right {
  float: right;
}

.mapgis-ui-collapse-card-button {
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
