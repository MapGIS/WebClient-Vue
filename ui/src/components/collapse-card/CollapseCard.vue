<template>
  <div v-show="visible">
    <mapgis-ui-tooltip v-if="collapse" :placement="placement">
      <template slot="title">
        <span>{{ title }}</span>
      </template>
      <mapgis-ui-button
        :style="outStyle"
        class="mapgis-ui-collapse-card-mini"
        type="primary"
        :shape="iconshape"
        :class="getPositionClassName()"
        @click="show"
      >
        <slot name="icon-hiden" />
        <mapgis-ui-iconfont
          :type="iconfont"
          class="mapgis-ui-collapse-card-iconfont"
        />
      </mapgis-ui-button>
    </mapgis-ui-tooltip>

    <transition name="bounce">
      <mapgis-ui-card
        class="mapgis-ui-collapse-card"
        :style="outStyle"
        hoverable
        v-show="!collapse && mode == 'collapse'"
        :bordered="false"
        size="small"
      >
        <slot name="title"></slot>
        <div class="mapgis-ui-collapse-card-extra">
          <slot name="extra"></slot>
        </div>
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
    mode: {
      type: String,
      default: "collapse" // 'collapse'  'button'
    },
    iconshape: {
      type: String,
      default: "circle"
    },
    iconfont: {
      type: [String, Node],
      default: ""
    },
    visible: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: "bottom-right" // top-left top-right bottom-left bottom-right
    },
    title: {
      type: String,
      default: "提示"
    }
  },
  data() {
    return {
      collapse: true
    };
  },
  computed: {
    placement() {
      let place = "top";
      let { position } = this;
      switch (position) {
        case "top-left":
        case "bottom-left":
          place = "right";
          break;
        case "top-right":
        case "bottom-right":
          place = "left";
          break;
      }
      return place;
    },
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
      if (this.mode == "collapse") {
        this.collapse = false;
      }
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
          className += "mapgis-ui-collapse-card-right";
          break;
        case "left":
        case "top-left":
        case "bottom-left":
          className += "mapgis-ui-collapse-card-left";
          break;
      }
      return className;
    }
  }
};
</script>
<style>
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
