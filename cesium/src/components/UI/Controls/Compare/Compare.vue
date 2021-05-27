<template>
    <div class="slider" ref="slider"></div>
</template>

<script>
export default {
    name: "mapgis-3d-compare",
    inject: ["Cesium", "webGlobe"],
    props: {
        beforeLayers: {
            type: Array,
            default: function () {
                return [];
            },
        },
        afterLayers: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    data() {
        return {};
    },
    mounted() {
        this.initCompare();
    },

    methods: {
        initCompare() {
            let Cesium = this.Cesium;
            let viewer = this.webGlobe;
            let layers = this.webGlobe.layers._layers;

            if (this.beforeLayers.length && this.afterLayers.length) {
                layers.forEach((layer) => {
                    if (this.beforeLayers.includes(layer.id)) {
                        layer.splitDirection =
                            Cesium.ImagerySplitDirection.LEFT;
                    } else if (this.afterLayers.includes(layer.id)) {
                        layer.splitDirection =
                            Cesium.ImagerySplitDirection.RIGHT;
                    }
                });
            } else {
                layers[layers.length - 2].splitDirection =
                    Cesium.ImagerySplitDirection.LEFT;
                layers[layers.length - 1].splitDirection =
                    Cesium.ImagerySplitDirection.RIGHT;
            }

            let slider = this.$refs.slider;
            viewer.scene.imagerySplitPosition =
                slider.offsetLeft / slider.parentElement.offsetWidth;

            let handler = new Cesium.ScreenSpaceEventHandler(slider);
            let moveActive = false;

            function move(movement) {
                if (!moveActive) {
                    return;
                }
                let relativeOffset = movement.endPosition.x;
                let splitPosition =
                    (slider.offsetLeft + relativeOffset) /
                    slider.parentElement.offsetWidth;
                slider.style.left = 100.0 * splitPosition + "%";
                viewer.scene.imagerySplitPosition = splitPosition;
            }

            //鼠标左键按下事件
            handler.setInputAction(function () {
                moveActive = true;
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            //鼠标左键抬起事件
            handler.setInputAction(function () {
                moveActive = false;
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            //滑动事件的开始
            handler.setInputAction(function () {
                moveActive = true;
            }, Cesium.ScreenSpaceEventType.PINCH_START);
            //滑动事件的结束
            handler.setInputAction(function () {
                moveActive = false;
            }, Cesium.ScreenSpaceEventType.PINCH_END);
            //鼠标移动事件
            handler.setInputAction(
                move,
                Cesium.ScreenSpaceEventType.MOUSE_MOVE
            );
            //滑动事件
            handler.setInputAction(
                move,
                Cesium.ScreenSpaceEventType.PINCH_MOVE
            );
        },
    },
};
</script>

<style lang="css">
.slider {
    position: absolute;
    left: 50%;
    top: 0;
    background-color: #d3d3d3;
    width: 5px;
    height: 100%;
    z-index: 9999;
}

.slider:hover {
    cursor: ew-resize;
}
</style>
