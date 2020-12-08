<template>
  <div :style="wrapperStyle">
    <v-tree
      ref="tree"
      :data="layers"
      :multiple="true"
      :halfcheck="true"
      :tpl="tpl"
      :draggable="true"
      @drag-node-end="onDropChange"
    ></v-tree>
    <IconFont v-if="false" />
    <!-- slot for toolbar -->
    <!-- <slot name="toolbar" /> -->
    <!-- slot for toolbar-item -->
    <!-- <slot v-if="drawer" /> -->
  </div>
</template>

<style lang="scss"></style>

<script>
import withEvents from "../../../lib/withEvents";
import withSelfEvents from "../withSelfEvents";
import "../tree/tree.css";
import VTree from "../tree";
import IconFont from "../iconfont/iconfront";

const drawEvents = {
  drawCreate: "draw.create",
  drawDelete: "draw.delete",
  drawCombine: "draw.combine"
};

// const drawDOMEvents = {};

export default {
  name: "MapgisDocument",
  mixins: [withEvents, withSelfEvents],

  components: {
    VTree,
    IconFont
  },

  provide() {
    const self = this;
    return {
      get layers() {
        // 提供给子组件或者插槽
        return self.layers;
      }
    };
  },

  props: {
    // mapbox drawer options
    wrapperStyle: {
      type: Object,
      default: () => {}
    },
    layers: {
      type: Array,
      default: () => []
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
    tpl(node /* , ctx, parent, index, props */) {
      let titleClass = node.selected
        ? "node-title node-selected"
        : "node-title";
      if (node.searched) titleClass += " node-searched";

      return (
        <span>
          <IconFont type={node.icon} style={{ marginLeft: "4px" }} />
          <span
            class={titleClass}
            domPropsInnerHTML={node.title}
            onClick={() => {
              this.$refs.tree.nodeSelected(node);
            }}
          ></span>
        </span>
      );
    },

    onDropChange(dragNode, targetNode) {
      console.log(dragNode, targetNode);
    },

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
