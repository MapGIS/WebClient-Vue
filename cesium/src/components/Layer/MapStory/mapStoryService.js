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
        $_drawCreate(Cartesian3Points, degreeArr, viewerDraw, radians) {
            this.currentPoints = degreeArr;
            let center;
            switch (this.currentFeatureType) {
                case "rectangle":
                    let points = [[Cesium.Math.toDegrees(radians.west), Cesium.Math.toDegrees(radians.south)], [Cesium.Math.toDegrees(radians.east), Cesium.Math.toDegrees(radians.north)]];
                    center = this.$_getRectangleCenter(points);
                    window.feature.center = center;
                    this.viewer.entities.add({
                        id: window.feature.id,
                        rectangle: {
                            coordinates: radians,
                            material: Cesium.Color.RED,
                        },
                    });
                    break;
                case "polygon":
                    center = this.$_getPolygonCenter(degreeArr);
                    window.feature.center = center;
                    this.viewer.entities.add({
                        id: window.feature.id,
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(Cartesian3Points),
                            material: Cesium.Color.RED,
                            fill: true
                        }
                    });
                    break;
                case "polyline":
                    let newPoints = degreeArr.concat([degreeArr[0]]);
                    center = this.$_getPolygonCenter(newPoints);
                    window.feature.center = center;
                    this.viewer.entities.add({
                        id: window.feature.id,
                        polyline: {
                            positions: Cartesian3Points,
                            material: Cesium.Color.RED,
                            width: 3
                        }
                    });
                    break;
            }
            window.feature.layerStyle.opacity = 1;
            this.$refs.projectPanel.currentProject.features.push(window.feature);
            this.$refs.projectPanel.$refs.projectP.showEditPanel = false;
        },
        $_firstAddPicture(feature) {
            let lnglatPosition;
            if (feature.center) {
                lnglatPosition = {
                    lng: feature.center[0],
                    lat: feature.center[1],
                    alt: feature.center[2],
                };
            } else {
                lnglatPosition = this.$_cartesian3ToLongLat(feature.baseUrl.geometry);
            }
            this.popups.push({
                lng: lnglatPosition.lng,
                lat: lnglatPosition.lat,
                alt: 20,
                title: feature.title,
                images: feature.images,
                feature: feature,
                id: feature.id,
                show: feature.show,
                vueIndex: parseInt(String(Math.random() * 10000))
            });
        },
        $_editProject(index) {
            if (this.dataSource instanceof Array) {
                this.$refs.projectPanel.showProjectPanel = false;
                if (!this.enableClose) {
                    window.showPanels.showProjectEdit = true;
                    window.showPanels.currentPage = "projectEdit";
                }
                this.$refs.projectPanel.currentProject = this.projectSet[this.dataSource[index].uuid];
            }
        },
        $_closeHoverPanel() {
            let vm = this;
            switch (this.currentFeatureType) {
                case "point":
                    this.$_getBillBoardIcon(0, function (img) {
                        vm.viewer.entities.add({
                            id: window.feature.id,
                            position: window.feature.camera.cartesian3Position,
                            billboard: {
                                image: img,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });
                    });
                    window.feature.drawType = "point";
                    break;
                case "polyline":
                    this.currentPoints.push(this.currentPoints[0]);
                    window.feature.camera.longLatPosition = this.$_getPolygonCenter(this.currentPoints);
                    window.feature.drawType = "polyline";
                    break;
                case "polygon":
                    window.feature.camera.longLatPosition = this.$_getPolygonCenter(this.currentPoints);
                    window.feature.drawType = "polygon";
                    break;
                case "rectangle":
                    window.feature.camera.longLatPosition = this.$_getRectangleCenter(this.currentPoints);
                    window.feature.drawType = "rectangle";
                    break;
            }
            this.$refs.projectPanel.$refs.projectP.$_addFeatureSet(window.feature);
            this.$refs.projectPanel.$refs.projectP.showEditPanel = false;
        },
        $_titleChanged(title) {
            if (window.feature) {
                window.feature.title = title;
            }
        },
        $_featureTitleChanged(feature) {
            for (let i = 0; i < this.popups.length; i++) {
                if (this.popups[i].id === feature.id) {
                    this.$set(this.popups[i], "title", feature.title);
                    break;
                }
            }
        },
        $_changeOpacity(opacity, color, id, geometryType) {
            let entity = this.viewer.entities.getById(id);
            opacity = Number(opacity);
            switch (geometryType) {
                case "polygon":
                    if (entity.polygon) {
                        entity[geometryType].material = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), opacity);
                    } else if (entity.rectangle) {
                        entity.rectangle.material = new Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), opacity);
                    }
                    break;
                case "polyline":
                    entity[geometryType].material = new Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), opacity);
                    break;
            }
        },
        $_changeColor(color, type, id, geometryType) {
            let entity = this.viewer.entities.getById(id);
            switch (geometryType) {
                case "polygon":
                    if (entity.polygon) {
                        entity[geometryType].material = new Cesium.Color.fromCssColorString(color.hex);
                    } else if (entity.rectangle) {
                        entity.rectangle.material = new Cesium.Color.fromCssColorString(color.hex);
                    }
                    break;
                case "polyline":
                    entity[geometryType].material = new Cesium.Color.fromCssColorString(color.hex);
                    break;
            }
        },
        $_getLayer(index, project, callBack, feature) {
            let map;
            if (feature) {
                map = feature.map;
            } else {
                map = project.features[index].map;
            }

            if (map) {
                const {vueKey, vueIndex} = map;
                if (vueKey && vueIndex) {
                    let layerManager = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
                    callBack(layerManager.source);
                }
            }
        },
        $_deleteFeature(index, id, project, feature) {
            let vm = this;
            if (id) {
                this.viewer.entities.removeById(id);
            }
            this.$_getLayer(index, project, function (layer) {
                vm.viewer.imageryLayers.remove(layer);
            }, feature);
            for (let i = 0; i < this.popups.length; i++) {
                if (this.popups[i].id === feature.id) {
                    this.popups.splice(i, 1);
                    break;
                }
            }
        },
        $_getCamera(currentFeature) {
            let camera = this.viewer.camera;
            currentFeature.camera.positionCartographic = {
                height: camera.positionCartographic.height,
                latitude: camera.positionCartographic.latitude,
                longitude: camera.positionCartographic.longitude
            };
            currentFeature.camera.heading = camera.heading;
            currentFeature.camera.pitch = camera.pitch;
            currentFeature.camera.roll = camera.roll;
        },
        $_changeIcon(icon, id) {
            let entity = this.viewer.entities.getById(id);
            this.$_getBillBoardIcon(icon, function (img) {
                entity.billboard.image = img;
            });
        },
        $_addEntity(feature, layerStyle, id) {
            let vm = this;
            switch (feature.type) {
                case "point":
                    const {geometry} = feature;
                    if (!geometry) {
                        return;
                    }
                    const {x, y, z} = feature.geometry;
                    if (x && y && z) {
                        let img = document.createElement("img");
                        let imgUrl = layerStyle.billboard.image;
                        if (typeof imgUrl === 'number') {
                            imgUrl = Base64IconsKeyValue[imgUrl].value;
                        }
                        img.src = imgUrl;
                        img.onload = function () {
                            vm.viewer.entities.add({
                                id: id,
                                position: new Cesium.Cartesian3(x, y, z),
                                billboard: {
                                    image: img,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                }
                            });
                        }
                    }
                    break;
            }
        },
        $_showProject(project) {
            const {show, uuid} = project;
            if (show) {
                let newProject = this.projectSet[uuid];
                const {features, map} = newProject;
                for (let i = 0; i < features.length; i++) {
                    let entity = this.viewer.entities.getById(features[i].id);
                    const {layerStyle, baseUrl} = features[i];
                    if (entity) {
                        if (show) {
                            if (layerStyle.hasOwnProperty("show") && layerStyle.show !== false) {
                                entity.show = show;
                                this.$_getLayer(i, newProject, function (layer) {
                                    layer.show = show;
                                });
                            }
                        } else {
                            entity.show = show;
                            this.$_getLayer(i, newProject, function (layer) {
                                layer.show = show;
                            });
                        }
                    } else {
                        const {map} = features[i];
                        this.$_addEntity(baseUrl, features[i].layerStyle, features[i].id);
                        if (map) {
                            this.optArr.push(map);
                        }
                    }
                }
                if (map) {
                    const {vueKey, vueIndex, type} = map;
                    if (vueKey && vueIndex && type) {
                        let layer;
                        switch (type) {
                            case "WMTS":
                                layer = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
                                break;
                        }
                        if (!layer) {
                            this.projectMaps.push(map);
                        }
                    }
                }
            } else {

            }
        },
        $_showFeature(id, flag, index, project) {
            if (id) {
                let entity = this.viewer.entities.getById(id);
                entity.show = flag;
            }
            this.$_getLayer(index, project, function (layer) {
                layer.show = flag;
            });
        },
        $_addMapToProject(type, map) {
            map.vueKey = this.vueKey;
            map.vueIndex = new Date().getTime();
            let index, addMap = true;
            for (let i = 0; i < this.projectMaps.length; i++) {
                if (this.projectMaps[i].vueKey === map.vueKey && this.projectMaps[i].vueIndex === map.vueIndex) {
                    index = i;
                    addMap = false;
                    break;
                }
            }
            if (addMap) {
                this.projectMaps.push(map);
            } else {
                this.$emit(this.projectMaps, index, map);
            }
        },
        $_addFeature(feature) {
            let vm = this;
            this.currentFeatureType = feature.type;
            switch (feature.type) {
                case "point":
                    this.$_addPoint(function (position, cartesian3Position) {
                        if (!vm.$refs.projectPanel.$refs.projectP.showEditPanel) {
                            feature.feature.baseUrl.geometry = cartesian3Position;
                            feature.feature.camera.longLatPosition = [position.lng, position.lat, position.alt];
                            window.feature = feature.feature;
                            vm.$_setCamera();
                            vm.$refs.projectPanel.$refs.projectP.showEditPanel = true;
                            vm.$_getBillBoardIcon(0, function (img) {
                                vm.viewer.entities.add({
                                    id: window.feature.id,
                                    position: feature.feature.baseUrl.geometry,
                                    billboard: {
                                        image: img,
                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    }
                                });
                                vm.$refs.projectPanel.currentProject.features.push(window.feature);
                                vm.$refs.projectPanel.$refs.projectP.showEditPanel = false;
                            });
                            window.feature.drawType = "point";
                        }
                    });
                    break;
                case "polyline":
                    window.feature = feature.feature;
                    vm.$_setCamera();
                    this.drawer && this.drawer.enableDrawLine(true);
                    break;
                case "rectangle":
                    window.feature = feature.feature;
                    vm.$_setCamera();
                    this.drawer && this.drawer.enableDrawRectangle(true);
                    break;
                case "polygon":
                    window.feature = feature.feature;
                    vm.$_setCamera();
                    this.drawer && this.drawer.enableDrawPolygon(true);
                    break;
            }
        },
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