<template>
  <div :style="wrapperStyle">
    <slot name="document" />
  </div>
</template>

<style lang="scss"></style>

<script>
import withEvents from "../../../lib/withEvents";
import withSelfEvents from "../withSelfEvents";

const drawEvents = {
  drawCreate: "draw.create",
  drawDelete: "draw.delete",
  drawCombine: "draw.combine"
};

// const drawDOMEvents = {};

export default {
  name: "MapgisDocument",
  mixins: [withEvents, withSelfEvents],
  components: {},

  inject: {
    theme: {
      default: ""
    },
    color: {
      default: ""
    }
  },

  provide() {
    const self = this;
    return {
      get document() {
        // 提供给子组件或者插槽
        return self.document;
      },
      get layers() {
        // 提供给子组件或者插槽
        return self.document.layers;
      },
      get theme() {
        // 提供给子组件或者插槽
        return self.theme;
      },
      get color() {
        // 提供给子组件或者插槽
        return self.color;
      }
    };
  },

  props: {
    // mapbox drawer options
    wrapperStyle: {
      type: Object,
      default: () => {}
    },
    document: {
      type: Object,
      default: () => {}
      //required: true
    },
    map: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      initial: true
    };
  },

  watch: {
    draggable() {}
  },

  mounted() {
    /* const draweroptions = {
      ...this.$props
    };

    const eventNames = Object.keys(drawEvents);
    this.$_bindSelfEvents(eventNames);

    this.initial = false;
    this.$_addControl(); */
  },

  beforeDestroy() {},

  methods: {
    $_addMarker() {
      this.$_emitEvent("added", { drawer: this.drawer });
    },

    $_bindSelfEvents(events) {
      // asControl 本身是拥有 $_bindSelfEvents 方法的，但是这里的draw组件并不是遵循的mapbox-gl.js的事件机制，
      // 因此我们需要覆盖该方法, 按照对应的业务方式实现
      const vm = this;
      // 使用vue的this.$listeners方式来订阅用户指定的事件
      Object.keys(this.$listeners).forEach(eventName => {
        if (events.includes(eventName)) {
          this.map.on(
            drawEvents[eventName],
            vm.$_emitDrawEvent.bind(vm, eventName)
          );
        }
      });
    },

    $_unbindSelfEvents(events) {
      let vm = this;
      if (events.length === 0) return;

      events.forEach(eventName => {
        vm.map.off(drawEvents[eventName], this.$_emitDrawEvent);
      });
    },

    // 按照@mapgis/webclient-vue-mapboxgl的规范 发送事件 ，其实就是用{type：eventName}包装事件名
    $_emitDrawEvent(eventName, eventData) {
      return this.$_emitSelfEvent({ type: eventName }, eventData);
    },

    remove() {
      this.$_emitEvent("removed");
    }
  }
};
</script>
