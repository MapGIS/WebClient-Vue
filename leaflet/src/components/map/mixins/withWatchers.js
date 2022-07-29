/**
 * @description 改对象主要是提供一个方法，将监控的属性如mapStyl,center,zoom等传递给this.map对象
 */
const watchers = {
  maxBounds(next) {
    this.map.setMaxBounds(next);
  },
  minZoom(next) {
    this.map.setMinZoom(next);
  },
  maxZoom(next) {
    this.map.setMaxZoom(next);
  },
  mapStyle(next) {
    this.map.setStyle(next);
  },
  // TODO: make 'bounds' synced prop
  // bounds (next) { this.map.fitBounds(next, { linear: true, duration: 0 }) },
  collisionBoxes(next) {
    this.map.showCollisionBoxes = next;
  },
  tileBoundaries(next) {
    this.map.showTileBoundaries = next;
  },
  repaint(next) {
    this.map.repaint = next;
  },
  zoom(next) {
    this.map.setZoom(next);
  },
  center(next) {
    this.map.setCenter(next);
  },
  bearing(next) {
    this.map.setBearing(next);
  },
  pitch(next) {
    this.map.setPitch(next);
  },
  light(next) {
    this.map.setLigh(next);
  },
};

/**
 *
 * @param {*} prop 需要更新的属性
 * @param {*} callback 属性更新的方法，对应上面的watchers里面的函数
 * @param {*} next 下一个的属性值
 * @param {*} prev 前一个的属性值
 */
function watcher(prop, callback, next, prev) {
  // this.initial 来自GLMap.vue中的data属性，标志是否初始化完毕
  if (this.initial) return;
  // vm.$listeners包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。
  // 它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。
  if (this.$listeners[`update:${prop}`]) {
    if (this.propsIsUpdating[prop]) {
      // 如果prop属性 需要更新
      this._watcher.active = false;
      this.$nextTick(() => {
        this._watcher.active = true;
      });
    } else {
      this._watcher.active = true;
      callback(next, prev);
    }
    this.propsIsUpdating[prop] = false;
  } else {
    // 常规情况下， 直接走这里
    callback(next, prev);
  }
}

function makeWatchers() {
  const wrappers = {};
  Object.entries(watchers).forEach((prop) => {
    wrappers[prop[0]] = function (next, prev) {
      return watcher.call(this, prop[0], prop[1].bind(this), next, prev);
    };
  });
  return wrappers;
}

/**
 * @name 提供GlMap的watch属性
 * @description 这个watch属性和常规的vue的watch不一样的在于：不是所有的属性都是实时更新的，其更新的逻辑封装在watcher中
 * @see watcher 封装了针对不同的使用场景下， 不同的属性zoom, style, center的变化，不是属性一变，地图就更新
 */
export let object = {
  watch: makeWatchers(),
};

/**
 * @name 提供GlMap的watch属性
 * @description 这个watch属性和常规的vue的watch不一样的在于：不是所有的属性都是实时更新的，其更新的逻辑封装在watcher中
 * @see watcher 封装了针对不同的使用场景下， 不同的属性zoom, style, center的变化，不是属性一变，地图就更新
 */
export default {
  watch: makeWatchers(),
};
