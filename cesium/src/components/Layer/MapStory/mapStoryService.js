import * as turf from "@turf/turf"
import base64Image from "./img/base64Image";

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
        $_getBillBoardIcon(index, callBack) {
            let img = document.createElement("img");
            if (typeof index === "number") {
                img.src = base64Image[index].value;
            } else if (typeof index === "string") {
                for (let i = 0; i < base64Image.length; i++) {
                    if (base64Image[i].key === index) {
                        img.src = base64Image[i].value;
                        break;
                    }
                }
            }
            img.onload = function () {
                callBack(img);
            }
        },
        $_setCamera() {
            window.feature.camera.orientation = {
                heading: this.viewer.scene.camera.heading,
                pitch: this.viewer.scene.camera.pitch,
                roll: this.viewer.scene.camera.roll,
            };
            window.feature.camera.height = this.viewer.camera.positionCartographic.height;
        },
        $_getPolygonCenter(points) {
            let pPoints = [];
            for (let i = 0; i < points.length; i++) {
                pPoints.push([points[i][0], points[i][1]])
            }
            let center = this.$_getCenter([pPoints]);
            return [center.geometry.coordinates[0], center.geometry.coordinates[1], 0];
        },
        $_getRectangleCenter(points) {
            let pPoints = [[
                [points[0][0], points[0][1]],
                [points[0][1], points[1][0]],
                [points[1][0], points[1][1]],
                [points[0][0], points[1][1]],
                [points[0][0], points[0][1]]
            ]];
            let center = this.$_getCenter(pPoints);
            let coordinates = center.geometry.coordinates;
            coordinates[2] = 0;
            return coordinates;
        },
        $_getCenter(points) {
            let polygon = turf.polygon(points);
            return turf.centerOfMass(polygon);
        },
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