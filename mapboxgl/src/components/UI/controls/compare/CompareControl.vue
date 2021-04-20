<template>
    <div class="mapgis-compare-bar">
        <mapbox-map
            id="left"
            class="map"
            ref="leftmap"
            v-bind="{ ...leftMapOptions }"
            v-on:load="handleLeftMapLoad"
        >
            <slot name="leftMap"></slot>
        </mapbox-map>
        <mapbox-map
            id="right"
            class="map"
            v-bind="{ ...rightMapOptions }"
            v-on:load="handleRightMapLoad"
        >
            <slot name="rightMap"></slot>
        </mapbox-map>
    </div>
</template>

<script>
import Compare from "@mapgis/mapbox-gl-compare";
// const Compare = require('mapbox-gl-compare');
import controlMixin from "../controlMixin";

import MapboxMap from "../../../map/GlMap.vue";

var leftMap, rightMap;

const StateEvents = {
    update: "update",
};

export default {
    name: "mapbox-compare",
    mixins: [controlMixin],
    props: {
        default: {
            type: Boolean,
            default: true,
        },
        orientation: {
            type: String,
            default: "vertical",
        },
        leftMapOptions: {
            type: Object,
            default: function () {
                return {};
            },
        },
        rightMapOptions: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    components: {
        MapboxMap,
    },

    data() {
        return {
            initial: true,
            control: undefined,
        };
    },

    created() {
        this.control = new CompareControl(this.$props);
        this.$_addControl();
        let events = Object.keys(StateEvents);
        this.$_bindSelfEvents(events, this.control);
    },

    methods: {
        /**
         * @param {Object} a The first Mapbox GL Map
         * @param {Object} b The second Mapbox GL Map
         * @param {string|HTMLElement} container An HTML Element, or an element selector string for the compare container. It should be a wrapper around the two map Elements.
         * @param {Object} options
         * @param {string} [options.orientation=vertical] The orientation of the compare slider. `vertical` creates a vertical slider bar to compare one map on the left (map A) with another map on the right (map B). `horizontal` creates a horizontal slider bar to compare on mop on the top (map A) and another map on the bottom (map B).
         * @param {boolean} [options.mousemove=false] If `true` the compare slider will move with the cursor, otherwise the slider will need to be dragged to move.
         * @example
         * var compare = new mapboxgl.Compare(beforeMap, afterMap, '#wrapper', {
         *   orientation: 'vertical',
         *   mousemove: true
         * });
         * @see [Swipe between maps](https://www.mapbox.com/mapbox-gl-js/example/mapbox-gl-compare/)
         */
        compare(a, b, container, options) {
            console.log("对比", Compare);
            console.log("参数", a, b, container, options);
            this.$compare = new Compare(a, b, container, options);
        },
        handleLeftMapLoad(payload) {
            leftMap = payload.map;
            this.handleMap();
        },
        handleRightMapLoad(payload) {
            rightMap = payload.map;
            this.handleMap();
        },
        handleMap() {
            if (leftMap && rightMap) {
                this.$compare && this.$compare.remove();
                this.$compare = undefined;
                let parent = this.$refs.leftmap.$parent.$el;
                this.compare(leftMap, rightMap, parent, {
                    // Set this to enable comparing two maps by mouse movement:
                    // mousemove: true,
                    orientation: this.orientation,
                });
            }
        },
    },
};

class CompareControl {
    constructor(option) {
        this.option = option || {};
    }

    initDom(dom) {
        dom.className = "mapboxgl-ctrl mapboxgl-compare-bar";
        dom.style.display = "flex";

        const controls = [""];
    }

    bindEvent() {}

    unbindEvent() {}

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl";
        this.initDom(this._container);
        this.bindEvent();
        return this._container;
    }

    onRemove() {
        this.unbindEvent();
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
</script>
<style>
.mapgis-compare-bar {
    margin: 0 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
.map {
    position: absolute;
    /* 只能是绝对布局 */
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
}
</style>