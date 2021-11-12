export default {
    inject: ["viewer", "Cesium"],
    props: {
        vueKey: {
            type: String,
            default: "default"
        },
        vueIndex: {
            type: Number,
            default() {
                return Number((Math.random() * 100000000).toFixed(0));
            }
        }
    },
    methods: {
        $_getContainerHeight() {
            return this.viewer.container.offsetHeight;
        },
        $_cartesian3ToLongLat(cartesian3) {
            let position = {};
            let graphicPosition = Cesium.Cartographic.fromCartesian(cartesian3);
            position.lat = Cesium.Math.toDegrees(graphicPosition.latitude);
            position.lng = Cesium.Math.toDegrees(graphicPosition.longitude);
            position.alt = graphicPosition.height;
            return position;
        },
        $_initManager() {
            let mapStoryManager = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex);
            if (!mapStoryManager) {
                let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
                window.vueCesium.MapStoryManager.addSource(this.vueKey, this.vueIndex, handler);
            }
        },
        $_addPoint(callBack) {
            let vm = this;
            let handler = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex).source;
            if (handler) {
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                handler.setInputAction(function (event) {
                    let cartesian3Position = viewer.camera.pickEllipsoid(
                        event.position,
                        viewer.scene.globe.ellipsoid
                    );
                    let lnglatPosition = vm.$_cartesian3ToLongLat(cartesian3Position);
                    callBack(lnglatPosition, cartesian3Position);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        }
    }
}