import {Style} from "@mapgis/webclient-es6-service";
import DrawModeEnum from "./drawModeEnum";

const {PointStyle, ModelStyle, MarkerStyle} = Style;
export default {
    inject: ["Cesium", "viewer"],
    data() {
        return {
            drawMode: undefined
        }
    },
    props: {
        vueKey: {
            type: String,
            default: "plottingDraw"
        },
        vueIndex: {
            type: Number,
            default() {
                return Number((Math.random() * 100000000).toFixed(0));
            }
        }
    },
    methods: {
        $_draw(drawStyle, callBack, extraOptions, updateStyle, vueKey, vueIndex) {
            let vm = this;
            let handlerManager = window.CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
            if (!handlerManager) {
                let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
                handler.setInputAction(function (event) {
                    let earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
                    let pick = viewer.scene.pick(event.position);
                    if (!Cesium.defined(pick)) {
                        if (vm.drawMode && vm.drawMode !== DrawModeEnum.UnPicked && vm.drawMode !== DrawModeEnum.Picked && vm.drawMode !== DrawModeEnum.Added) {
                            let entity;
                            switch (vm.drawMode) {
                                case "point":
                                    if (updateStyle && vm.mapgisPlottingeDrawStyle) {
                                        drawStyle = vm.mapgisPlottingeDrawStyle;
                                    }
                                    let style = new PointStyle(drawStyle);
                                    entity = vm.viewer.entities.add({
                                        position: earthPosition,
                                        point: style.toCesiumStyle(Cesium),
                                        extraOptions: extraOptions
                                    });
                                    vm.drawMode = DrawModeEnum.Added;
                                    pick = entity;
                                    break;
                            }
                            if (entity) {
                                handlerManager = window.CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
                                handlerManager.options.push(entity);
                            }
                        } else {
                            vm.drawMode = DrawModeEnum.UnPicked;
                        }
                    } else {
                        vm.drawMode = DrawModeEnum.Picked;
                    }
                    if (callBack) {
                        callBack(vm.drawMode, pick);
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                window.CesiumZondy.DrawToolManager.addSource(
                    vueKey,
                    vueIndex,
                    handler,
                    []
                );
            }
        },
        drawPoint(pointStyle, callBack, extraOptions, updateStyle, vueKey, vueIndex) {
            vueKey = vueKey || this.vueKey;
            vueIndex = vueIndex || this.vueIndex;
            this.drawMode = DrawModeEnum.Point;
            this.$_draw(pointStyle, callBack, extraOptions, updateStyle, vueKey, vueIndex);
        },
        updateEntityStyle(entity,style){
            let entityStyle = new PointStyle(style);
            entityStyle = entityStyle.toCesiumStyle(Cesium);
            entity.point = entityStyle;
        }
    }
}