<template>
    <span />
</template>
<script>
import VueOption from "../../Base/Vue/VueOptions";

export default {
    name: "mapgis-3d-igs-vector-layer",
    props: {
        url: {
            type: String,
            require: true,
        },
        gdbps: {
            type: [Array, String] ,
            require: true,
        },
        options: {
            type: Object,
            default: function () {
                return {};
            },
        },
        layerStyle: {
            type: Object,
            default: function () {
                return {
                    visible: true,
                    opacity: 1,
                };
            },
        },
        ...VueOption,
    },
    data() {
        return {};
    },
    inject: ["Cesium", "webGlobe", "CesiumZondy"],
    created() {},
    mounted() {
        this.mount();
    },
    destroyed() {
        this.unmount();
    },
    watch: {
        layerStyle: {
            handler: function () {
                let { vueKey, vueIndex, CesiumZondy } = this;
                let layer = CesiumZondy.arcgisManager.findSource(
                    vueKey,
                    vueIndex
                );
                if (this.layerStyleCopy.visible !== this.layerStyle.visible) {
                    layer.source.show = this.layerStyle.visible;
                }
                if (this.layerStyleCopy.opacity !== this.layerStyle.opacity) {
                    layer.source.alpha = this.layerStyle.opacity;
                }
                if (this.layerStyleCopy.zIndex !== this.layerStyle.zIndex) {
                    this.unmount();
                    this.mount();
                }
                this.layerStyleCopy = Object.assign(
                    this.layerStyleCopy,
                    this.layerStyle
                );
            },
            deep: true,
        },
        options: {
            handler: function () {
                this.unmount();
                this.mount();
            },
            deep: true,
        },
    },
    methods: {
        initUrl() {
            if (this.url) {
                return this.url;
            }
        },
        createCesiumObject() {
            const url = this.initUrl();
            let { options, gdbps, Cesium } = this;
            if (typeof gdbps === "string") {
                gdbps = [gdbps];
            }
            options = this.$_initOptions(options);
            const allOptions = { ...options, gdbps, url };
            return new Cesium.MapGIS2DDocMapProvider(allOptions);
        },
        mount() {
            let provider = this.createCesiumObject();
            this.layerStyleCopy = Object.assign({}, this.layerStyle);
            let { webGlobe, layerStyle } = this;
            const { vueIndex, vueKey, CesiumZondy } = this;
            const { zIndex, visible, opacity } = layerStyle;
            layerStyle = this.$_initLayerStyle(layerStyle);
            const viewer = webGlobe.viewer;
            const { imageryLayers } = viewer;
            let imageLayer = imageryLayers.addImageryProvider(provider, zIndex);

            CesiumZondy.IgsserverManager.addSource(
                vueKey,
                vueIndex,
                imageLayer
            );
            let find = CesiumZondy.IgsserverManager.findSource(
                vueKey,
                vueIndex
            );

            if (find && find.source) {
                if (visible) {
                    find.source.show = visible;
                }
                if (opacity >= 0) {
                    find.source.alpha = opacity;
                }
            }

            return !viewer.isDestroyed(); // && viewer.imageryLayers.contains(imageLayer)
        },
        unmount() {
            let { webGlobe, vueKey, vueIndex, CesiumZondy } = this;
            const { viewer } = webGlobe;
            const { imageryLayers } = viewer;
            let find = CesiumZondy.IgsserverManager.findSource(
                vueKey,
                vueIndex
            );
            imageryLayers.remove(find.source, true);
            CesiumZondy.IgsserverManager.deleteSource(vueKey, vueIndex);
            this.$emit("unload", this);
        },

        $_initOptions(options) {
            return options;
        },
        $_initLayerStyle(layerStyle) {
            if (layerStyle.zIndex == null && layerStyle.zIndex === undefined) {
                layerStyle.zIndex = this.vueIndex;
            }
            return layerStyle;
        },
    },
};
</script>