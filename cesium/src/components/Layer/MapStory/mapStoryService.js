import * as turf from "@turf/turf"
import Base64IconsKeyValue from "../../../../../ui/src/components/iconfont/Base64IconsKeyValue"
import {MRFS} from "@mapgis/webclient-es6-service";

export default {
    inject: ["viewer", "Cesium"],
    mixins: [Base64IconsKeyValue],
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
    data() {
        return {
            projectSet: {},
            optArr: [],
            projectMaps: [],
            popups: []
        }
    },
    methods: {
        $_flyTo(camera) {
            const {positionCartographic, heading, pitch, roll} = camera;
            const {longitude, latitude, height} = positionCartographic;
            this.viewer.camera.flyTo({
                destination: new Cesium.Cartesian3.fromRadians(longitude, latitude, height),
                orientation: {
                    heading: heading,
                    pitch: pitch,
                    roll: roll
                }
            });
        },
        $_getBillBoardIcon(index, callBack) {
            let img = document.createElement("img");
            if (typeof index === "number") {
                img.src = this.Base64IconsKeyValue[index].value;
            } else if (typeof index === "string") {
                for (let i = 0; i < this.Base64IconsKeyValue.length; i++) {
                    if (this.Base64IconsKeyValue[i].key === index) {
                        img.src = this.Base64IconsKeyValue[i].value;
                        break;
                    }
                }
            }
            img.onload = function () {
                callBack(img);
            }
        },
        $_setCamera() {
            window.feature.camera.positionCartographic.height = this.viewer.camera.positionCartographic.height;
            window.feature.camera.positionCartographic.longitude = this.viewer.camera.positionCartographic.longitude;
            window.feature.camera.positionCartographic.latitude = this.viewer.camera.positionCartographic.latitude;
            window.feature.camera.heading = this.viewer.scene.camera.heading;
            window.feature.camera.pitch = this.viewer.scene.camera.pitch;
            window.feature.camera.roll = this.viewer.scene.camera.roll;
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
                [points[0][0], points[1][1]],
                [points[1][0], points[1][1]],
                [points[1][0], points[0][1]],
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
        $_setCesiumClick() {
            let vm = this;
            this.viewer.scene.globe.depthTestAgainstTerrain = true;
            this.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
                let pickedFeature = vm.viewer.scene.pick(movement.position);
                if (Cesium.defined(pickedFeature)) {
                    if (pickedFeature.id && pickedFeature.id.id) {
                        let id = pickedFeature.id.id;
                        for (let i = 0; i < vm.popups.length; i++) {
                            if (id === vm.popups[i].id && !vm.popups[i].show) {
                                vm.popups[i].show = true;
                                break;
                            }
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        $_initManager() {
            let mapStoryManager = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex);
            let vm = this;
            if (!mapStoryManager) {
                let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
                window.vueCesium.MapStoryManager.addSource(this.vueKey, this.vueIndex, handler);
            }
            if (this.dataSource instanceof Array) {
                let popups = [];
                for (let i = 0; i < this.dataSource.length; i++) {
                    MRFS.FeatureService.get(this.dataSource[i].url, function (result) {
                        if (typeof result === "string") {
                            result = JSON.parse(result);
                        }
                        vm.projectSet[vm.dataSource[i].uuid] = result;
                        const {features, show, map} = result;
                        if (show === false) {
                            return;
                        }
                        if (map) {
                            vm.projectMaps.push(map);
                        }
                        for (let i = 0; i < features.length; i++) {
                            const {map} = features[i];
                            const {geometry} = features[i].baseUrl;
                            const {x, y, z} = geometry;
                            if (map) {
                                map.id = features[i].id;
                                vm.optArr.push(map);
                            }
                            let lnglatPosition = vm.$_cartesian3ToLongLat(features[i].baseUrl.geometry);
                            popups.push({
                                lng: lnglatPosition.lng,
                                lat: lnglatPosition.lat,
                                alt: 20,
                                title: features[i].title,
                                images: features[i].images,
                                feature: features[i],
                                id: features[i].id,
                                show: features[i].show,
                                vueIndex: parseInt(String(Math.random() * 10000))
                            });
                            if (x && y && z) {
                                let img = document.createElement("img");
                                let imgUrl = features[i].layerStyle.billboard.image;
                                if (typeof imgUrl === 'number') {
                                    imgUrl = vm.Base64IconsKeyValue[imgUrl].value;
                                }
                                img.src = imgUrl;
                                img.onload = function () {
                                    vm.viewer.entities.add({
                                        id: features[i].id,
                                        position: new Cesium.Cartesian3(x, y, z),
                                        billboard: {
                                            image: img,
                                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                                        }
                                    });
                                }
                            }
                        }
                        vm.$_setCesiumClick();
                        vm.$nextTick(function () {
                            let icons = document.getElementsByClassName("mapgis-3d-map-story-small-popup-tolarge");
                            for (let i = 0; i < icons.length; i++) {
                                icons[i].onclick = function () {
                                    vm.$emit("projectPreview", [features[i]], false);
                                }
                            }
                        });
                    }, function (error) {
                        console.error(error)
                    });
                }
                vm.popups = popups;
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