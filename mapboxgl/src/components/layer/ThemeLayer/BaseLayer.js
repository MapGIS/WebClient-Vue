import {MRFS} from "@mapgis/webclient-es6-service";
import EventBusMapMixin from "../../../lib/eventbus/EventBusMapMixin";
import {
    emitMapChangeStyle,
    emitMapAddLayer,
    emitMapRemoveLayer
} from "../../../lib/eventbus/EmitMap";
import ZondyThemeManager from "./themeManager";
import gradients from "./gradient";
import gradientHeatColor from "./gradientHeatColor";

const {FeatureService, VFeature} = MRFS;
import {gradientColor} from "../../util/util";
import All from "@mapgis/webclient-es6-service";
import {formatInterpolate, formatStyleToLayer, getLayerFromTextStyle} from "./themeUtil";
import {getPopupHtml} from "../../UI/popupUtil"

import {
    fillOutlinePaintList,
    fillPaintList,
    pointPaintList,
    linePaintList,
    symbolPaintList,
    symbolLayoutList,
    polylineDefaultValue, pointDefaultValue, polygonDefaultValue
} from "./mappingList"

import * as turf from "@turf/turf"

export const DefaultThemeMains = [
    "_统一专题图",
    "_单值专题图",
    "_分段专题图",
    "_等级专题图",
    "_热力专题图",
    "_符号专题图"
];

export const DefaultThemeSubs = [
    "_统一专题图_线",
    "_统一专题图_注记",
    "_统一专题图_符号",
    "_单值专题图_线",
    "_单值专题图_注记",
    "_单值专题图_符号",
    "_分段专题图_线",
    "_分段专题图_注记",
    "_分段专题图_符号",
    "_等级专题图_线",
    "_等级专题图_注记",
    "_热力专题图_线",
    "_热力专题图_注记"
];

export const DefaultThemeLayers = [
    "_统一专题图",
    "_统一专题图_线",
    "_统一专题图_注记",
    "_统一专题图_符号",
    "_单值专题图",
    "_单值专题图_线",
    "_单值专题图_注记",
    "_单值专题图_符号",
    "_分段专题图",
    "_分段专题图_线",
    "_分段专题图_注记",
    "_分段专题图_符号",
    "_等级专题图",
    "_等级专题图_线",
    "_等级专题图_注记",
    "_热力专题图",
    "_热力专题图_线",
    "_热力专题图_注记",
    "_符号专题图"
];

let themeManager = new ZondyThemeManager();
export default {
    mixin: [EventBusMapMixin],
    inject: ["mapbox", "map"],
    props: {
        /**
         * 以url的方式请求geojson数据
         * */
        baseUrl: {
            type: String
        },
        /**
         * 传入layerId，通过queryRenderFeature的方式取得数据
         * */
        layerId: {
            type: String
        },
        /**
         * 传入sourceId，通过直接取得source的方式取得数据
         * */
        sourceId: {
            type: String
        },
        /**
         * 传入sourceId，通过直接取得source的方式取得数据
         * */
        sourceLayerId: {
            type: String
        },
        /**
         * mapbox的原生参数
         * */
        mapboxProps: {
            type: Object,
            default() {
                return {};
            }
        },
        /**
         * 图标数组
         * */
        icons: {
            type: Array
        },
        dataSource: {
            type: [Object, String]
        },
        hideItem: {
            type: Array,
            default() {
                return [];
            }
        },
        panelStyle: {
            type: Object
        },
        themeOption: {
            type: Object,
            default() {
                return {}
            }
        },
        type: {
            type: String
        },
        field: {
            type: String
        },
        layerStyle: {
            type: Object,
            default() {
                return {}
            }
        },
        highlightStyle: {
            type: Object
        },
        highlightFeature: {
            type: Object
        },
        highlightCoordinates: {
            type: Array
        },
        styleGroups: {
            type: Array
        },
        isHoverAble: {
            type: Boolean,
            default: false
        },
        enableTips: {
            type: Boolean,
            default: false
        },
        tipsOptions: {
            type: Object,
            default() {
                return {
                    enableHighlight: true
                }
            }
        },
        enablePopup: {
            type: Boolean,
            default: false
        },
        popupOptions: {
            type: Object,
            default() {
                return {
                    enableHighlight: true
                }
            }
        },
        enableLoading: {
            type: Boolean,
            default: true
        },
        loadingOptions: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    watch: {
        dataSource: {
            handler: function () {
                this.$_addThemeLayerBySource();
            },
            deep: true
        },
        highlightFeature: {
            handler: function () {
                this.$_highLightFeature();
            },
            deep: true
        },
        type: {
            handler: function () {
                this.$_removeHighlightLayerAll();
                this.$_themeTypeChanged(this.type);
                this.$_addTipsAndPopup(this.type);
            },
            deep: true
        },
        field: {
            handler: function () {
                this.$_fieldChanged(this.field);
            },
            deep: true
        },
        enableTips: {
            handler: function () {
            },
            deep: true
        },
        enablePopup: {
            handler: function () {
            },
            deep: true
        },
        "themeOption.layerStyle": {
            handler: function () {
                let vm = this;
                Object.keys(this.themeOption.layerStyle).forEach(function (key) {
                    let layerStyleCopy = vm.themeOptionCopy.layerStyle;
                    let layerStyle = vm.themeOption.layerStyle;
                    if ((layerStyleCopy.hasOwnProperty(key) && layerStyle.hasOwnProperty(key) && layerStyleCopy[key] !== layerStyle[key]) ||
                        (!layerStyleCopy.hasOwnProperty(key) && layerStyle.hasOwnProperty(key))
                    ) {
                        vm.$_updateStyle(layerStyle, key);
                    }
                });
                this.$_getThemeOptionCopy();
            },
            deep: true
        },
        "themeOption.styleGroups": {
            handler: function () {
                let groups = {}, vm = this;
                const {styleGroups} = this.themeOption
                for (let i = 0; i < styleGroups.length; i++) {
                    const {style} = styleGroups[i];
                    if (style) {
                        Object.keys(style).forEach(function (key) {
                            if (!groups[key]) {
                                groups[key] = [];
                            }
                            let s;
                            if(vm.themeType === "range"){
                                s = {
                                    start: styleGroups[i].start,
                                    end: styleGroups[i].end
                                }
                            }else if(vm.themeType === "unique"){
                                s = {
                                    value: styleGroups[i].value
                                }
                            }
                            s[key] = style[key];
                            groups[key].push(s);
                        });
                    }
                }
                switch (this.themeType) {
                    case "range":
                        this.$_updateRangeStyleGroups(groups);
                        break;
                    case "unique":
                        this.$_updateUniqueStyleGroups(groups);
                        break;
                }
                this.$_getThemeOptionCopy();
            },
            deep: true
        },
    },
    data() {
        return {
            //组件ID,如果有多个组件，可以进行区分
            vueId: parseInt(String(Math.random() * 10000000000)),
            //图层的sourceId
            source_Id: undefined,
            //图层的source_layer_Id，有的有，有的没有，有就使用
            source_layer_Id: undefined,
            //所有非空字段
            fields: undefined,
            //所有数字字段
            numberFields: undefined,
            //专题图类型，single（单值），range（分段），heatmap（热力），symbol（符号），cluster（聚类）
            themeType: undefined,
            //数据类型，circle、fill、line
            dataType: undefined,
            //当前选择的字段
            selectValue: undefined,
            //layerId副本，内部统一使用这个
            layerIdCopy: undefined,
            //从数据源里面取得的数据
            dataSourceCopy: undefined,
            //数据副本
            dataSourceCopyBack: undefined,
            //图例复选框数组
            checkBoxArr: undefined,
            //图例颜色数组
            colors: undefined,
            //下一个图层的id，专题图要确保在两个原始图层之间
            upLayer: undefined,
            //当前的渐变颜色
            currentGradient: undefined,
            //起始数据
            endData: undefined,
            //结束数据
            startData: undefined,
            //分段级数
            rangeLevel: 10,
            //是否含有空数据提示，每个图层只提示一次
            hasNullProperty: [],
            //初始化类型，function或props
            initType: "function",
            hideItemCopy: this.hideItem,
            panelClass: undefined,
            hoveredStateId: undefined,
            tipsSourceId: undefined,
            popupStateId: undefined,
            popupSourceId: undefined,
            panelType: "fix",
            markers: [],
            spinId: undefined,
            maskId: undefined,
            dataSourceUrl: undefined,
            igsTextSourceId: undefined,
            themeOptionCopy: undefined,
            defaultIcon: "useDefault"
        };
    },
    mounted() {
        window.mapgis2d = this.map;
        if (!window.layerManager) {
            window.layerManager = {};
        }
        //初始化专题图管理对象
        themeManager.init(this.vueId);
        this.$emit("loaded", this);
        if (this.hideItem.length > 0) {
            this.hideItemCopy = this.hideItem;
        }
        if (this.enableLoading) {
            this.$_addSpin(this.layerId || "geojson_layer_" + parseInt(Math.random() * 10000));
        }
        this.$_addThemeLayerBySource();
    },
    methods: {
        $_getInterpolate(key, defaultValue, colors) {
            let opacitys = ["step", ["to-number", ["get", key]], defaultValue];
            for (let k = 3; k < colors.length; k += 2) {
                opacitys[k] = colors[k];
                opacitys[k + 1] = defaultValue;
            }
            return opacitys;
        },
        $_updateUniqueStyleGroups(groups){
            let vm = this, watchObject;
            function setPaint(groups, key, vm, keyAlias) {
                let paintArr = groups[key];
                let paintsKey = keyAlias || key;
                let paints = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, vm.dataType + "-" + paintsKey);
                if(!paints){
                    let defaultValue;
                    switch (vm.dataType) {
                        case "circle":
                            defaultValue = pointDefaultValue[key];
                            break;
                        case "line":
                            defaultValue = polylineDefaultValue[key];
                            break;
                        case "fill":
                            defaultValue = polygonDefaultValue[key];
                            break;
                    }
                    let pColors = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, vm.dataType + "-color");
                    paints = vm.$_getInterpolate(paintsKey, defaultValue, pColors);
                }
                for (let i = 0; i < paintArr.length; i++) {
                    if(paints.indexOf(paintArr[i].value) >= 0){
                        paints[paints.indexOf(paintArr[i].value) + 1] = paintArr[i][key];
                    }
                }
                let newKey = keyAlias || key;
                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-" + newKey, paints);
            }
            switch (this.dataType) {
                case "fill":
                    watchObject = {
                        color: "",
                        opacity: ""
                    }
                    Object.keys(groups).forEach(function (key) {
                        if (watchObject.hasOwnProperty(key)) {
                            setPaint(groups, key, vm, watchObject[key]);
                        }
                    });
                    break;
                case "circle":
                    watchObject = {
                        color: "",
                        opacity: "",
                        radius: "",
                        outlineWidth: "stroke-width",
                        outlineColor: "stroke-color",
                        outlineOpacity: "stroke-opacity"
                    }
                    Object.keys(groups).forEach(function (key) {
                        if (watchObject.hasOwnProperty(key)) {
                            setPaint(groups, key, vm, watchObject[key]);
                        }
                    });
                    break;
                case "line":
                    watchObject = {
                        color: "",
                        opacity: ""
                    }
                    Object.keys(groups).forEach(function (key) {
                        if (watchObject.hasOwnProperty(key)) {
                            setPaint(groups, key, vm, watchObject[key]);
                        }
                    });
                    break;
            }
        },
        $_updateRangeStyleGroups(groups) {
            let vm = this, watchObject;

            function setPaint(groups, key, vm, keyAlias) {
                let paintArr = groups[key];
                let paintsKey = keyAlias || key;
                let paints = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, vm.dataType + "-" + paintsKey);
                if(!paints){
                    let defaultValue;
                    switch (vm.dataType) {
                        case "circle":
                            defaultValue = pointDefaultValue[key];
                            break;
                        case "line":
                            defaultValue = polylineDefaultValue[key];
                            break;
                        case "fill":
                            defaultValue = polygonDefaultValue[key];
                            break;
                    }
                    let pColors = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, vm.dataType + "-color");
                    paints = vm.$_getInterpolate(paintsKey, defaultValue, pColors);
                }
                for (let i = 0; i < paintArr.length; i++) {
                    for (let j = 3; j < paints.length; j += 2) {
                        if (paintArr[i].start <= paints[j] && paints[j] <= paintArr[i].end) {
                            paints[j + 1] = paintArr[i][key];
                        } else if (paints[j] > paintArr[i].end) {
                            break;
                        }
                    }
                }
                let newKey = keyAlias || key;
                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-" + newKey, paints);
            }

            switch (this.dataType) {
                case "fill":
                    watchObject = {
                        color: "",
                        opacity: ""
                    }
                    Object.keys(groups).forEach(function (key) {
                        if (watchObject.hasOwnProperty(key)) {
                            setPaint(groups, key, vm, watchObject[key]);
                        }
                    });
                    break;
                case "circle":
                    watchObject = {
                        color: "",
                        opacity: "",
                        radius: "",
                        outlineWidth: "stroke-width",
                        outlineColor: "stroke-color",
                        outlineOpacity: "stroke-opacity"
                    }
                    Object.keys(groups).forEach(function (key) {
                        if (watchObject.hasOwnProperty(key)) {
                            setPaint(groups, key, vm, watchObject[key]);
                        }
                    });
                    break;
                case "line":
                    watchObject = {
                        color: "",
                        opacity: ""
                    }
                    Object.keys(groups).forEach(function (key) {
                        if (watchObject.hasOwnProperty(key)) {
                            setPaint(groups, key, vm, watchObject[key]);
                        }
                    });
                    break;
            }
        },
        $_updateStyle(layerStyle, key) {
            let vm = this;
            if (vm.themeType !== "heatmap" && vm.themeType !== "symbol") {
                switch (vm.dataType) {
                    case "fill":
                        if (fillOutlinePaintList.hasOwnProperty(key)) {
                            vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName() + "_线", fillOutlinePaintList[key], layerStyle[key]);
                        }
                        vm.$_updatePaint(fillPaintList, layerStyle, key);
                        break;
                    case "circle":
                        vm.$_updatePaint(pointPaintList, layerStyle, key);
                        break;
                    case "line":
                        vm.$_updatePaint(linePaintList, layerStyle, key);
                        break;
                }
            } else if (vm.themeType === "heatmap") {
                if (key === "color") {
                    let colors = vm.$_getHeatmapColors(layerStyle[key]);
                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-color", colors);
                } else {
                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-radius", layerStyle[key]);
                }
            } else if (vm.themeType === "symbol") {
                let value = layerStyle[key];
                if (symbolPaintList.hasOwnProperty(key)) {
                    if (key === "xOffset" || key === "yOffset") {
                        let translate = themeManager.getPanelProps(vm.layerIdCopy, vm.themeType, "icon-translate");
                        if (key === "xOffset") {
                            translate[0] = Number(layerStyle[key]);
                        } else {
                            translate[1] = Number(layerStyle[key]) * -1;
                        }
                        value = translate;
                    }
                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), symbolPaintList[key], value);
                }
                if (symbolLayoutList.hasOwnProperty(key)) {
                    if (key === "symbol") {
                        let iconName = "useDefault";
                        vm.defaultIcon = layerStyle[key];
                        if (vm.defaultIcon !== "useDefault") {
                            let iconFullName = vm.defaultIcon.split("/")[vm.defaultIcon.split("/").length - 1];
                            iconName = iconFullName.split(".")[0];
                        }
                        if (!vm.map.hasImage(iconName)) {
                            let img = new Image(128, 128);
                            img.addEventListener("load", function () {
                                vm.map.addImage(iconName, img);
                                vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), symbolLayoutList[key], iconName);
                            });
                            if (vm.defaultIcon === "useDefault") {
                                img.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjI5OTcyNzU0MDMwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyMzQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEwLjY5MTE5MSA2NC41Njc1NTFjLTI0Ni41NDgyMzIgMC00NDcuMTI1NDU3IDIwMC41NzgyNDgtNDQ3LjEyNTQ1NyA0NDcuMTI1NDU3IDAgMjQ2LjU0MzExNiAyMDAuNTc4MjQ4IDQ0Ny4xMjU0NTcgNDQ3LjEyNTQ1NyA0NDcuMTI1NDU3IDI0Ni41NDMxMTYgMCA0NDcuMTI1NDU3LTIwMC41ODIzNDEgNDQ3LjEyNTQ1Ny00NDcuMTI1NDU3Qzk1Ny44MTY2NDggMjY1LjE0NDc3NiA3NTcuMjM0MzA3IDY0LjU2NzU1MSA1MTAuNjkxMTkxIDY0LjU2NzU1MXpNNTEwLjY5MTE5MSA4NjMuNDg5MzA2Yy0xOTMuOTgyMDE2IDAtMzUxLjc5NjI5OC0xNTcuODE0MjgyLTM1MS43OTYyOTgtMzUxLjc5NjI5OHMxNTcuODE0MjgyLTM1MS43OTYyOTggMzUxLjc5NjI5OC0zNTEuNzk2Mjk4Uzg2Mi40ODc0ODkgMzE3LjcxMDk5MiA4NjIuNDg3NDg5IDUxMS42OTMwMDggNzA0LjY3MzIwOCA4NjMuNDg5MzA2IDUxMC42OTExOTEgODYzLjQ4OTMwNnoiIHAtaWQ9IjIyMzUiIGZpbGw9IiMxMjk2ZGIiPjwvcGF0aD48cGF0aCBkPSJNNTEwLjY5MTE5MSA1MTEuNjkzMDA4bS0yMTQuNDkxMTE5IDBhMjA5LjYwNiAyMDkuNjA2IDAgMSAwIDQyOC45ODIyMzggMCAyMDkuNjA2IDIwOS42MDYgMCAxIDAtNDI4Ljk4MjIzOCAwWiIgcC1pZD0iMjIzNiIgZmlsbD0iIzEyOTZkYiI+PC9wYXRoPjwvc3ZnPg==";
                            } else {
                                img.src = vm.defaultIcon;
                            }
                        } else {
                            vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), symbolLayoutList[key], iconName);
                        }
                    } else {
                        if (key === "symbolSize") {
                            value = value / 10;
                        }
                        vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), symbolLayoutList[key], value);
                    }
                }
            }
        },
        $_updatePaint(PaintList, layerStyle, key) {
            if (PaintList.hasOwnProperty(key)) {
                if (key === "color") {
                    let geojson = this.dataSourceUrl || this.dataSource;
                    if (geojson && geojson instanceof Object) {
                        let dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
                        let colors = this.$_getRangeColors(layerStyle[key], dataSource, this.selectValue, geojson.features).colors;
                        this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), PaintList[key], colors);
                    }
                } else {
                    this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), PaintList[key], layerStyle[key]);
                }
            }
        },
        $_getThemeOptionCopy() {
            if (this.themeOption) {
                let vm = this;
                this.themeOptionCopy = {};
                const {layerStyle} = this.themeOption;
                if (layerStyle instanceof Object) {
                    this.themeOptionCopy.layerStyle = {};
                    Object.keys(layerStyle).forEach(function (key) {
                        vm.themeOptionCopy.layerStyle[key] = layerStyle[key];
                    });
                }
            }
        },
        $_addSpin(layerId) {
            let _container = document.getElementById(this.map._container.id), vm = this;
            let spinSpan = document.createElement("span");
            const {maskClass, maskStyle, spinClass, spinStyle, delayTime} = this.loadingOptions;
            spinSpan.className = "mapgis-ui-spin-dot mapgis-ui-spin-dot-spin";
            for (let i = 0; i < 4; i++) {
                let spinSpanI = document.createElement("i");
                spinSpanI.className = "mapgis-ui-spin-dot-item";
                spinSpan.append(spinSpanI);
            }
            let spin = document.createElement("div");
            let spinClassName = "mapgis-ui-spin mapgis-ui-spin-spinning mapgis-ui-spin-loading";
            if (spinClass) {
                spinClassName += " " + spinClass;
            }
            spin.className = spinClassName;
            spin.append(spinSpan);
            spin.style.position = "absolute";
            if (spinStyle) {
                Object.keys(spinStyle).forEach(function (key) {
                    spin.style[key] = spinStyle[key];
                });
            }
            this.spinId = layerId + "_spin_" + parseInt(String(Math.random() + 10000));
            spin.id = this.spinId;
            let mask = document.createElement("div");
            let maskClassName = "mapgis-mask";
            if (maskClass) {
                maskClassName += " " + maskClass;
            }
            mask.className = maskClassName;
            if (maskStyle) {
                Object.keys(maskStyle).forEach(function (key) {
                    mask.style[key] = maskStyle[key];
                });
            }
            this.maskId = layerId + "_mask_" + parseInt(String(Math.random() + 10000));
            mask.id = this.maskId;
            _container.append(spin);
            _container.append(mask);
            let interval = setInterval(function () {
                if (vm.map.getLayer(vm.layerIdCopy + vm.$_getThemeName())) {
                    let time = delayTime || 100;
                    setTimeout(function () {
                        let _container = document.getElementById(vm.map._container.id);
                        _container.removeChild(document.getElementById(vm.spinId));
                        _container.removeChild(document.getElementById(vm.maskId));
                    }, time);
                    clearInterval(interval);
                }
            }, 30);
        },
        $_formatThemeListOptions(options) {
            let newOptions = {
                startData: undefined,
                dataSource: [],
                colors: []
            };
            newOptions.startData = Number(options[0].min);
            for (let i = 0; i < options.length; i++) {
                newOptions.dataSource.push(Number(options[i].max));
                newOptions.colors.push(options[i].sectionColor);
            }
            return newOptions;
        },
        $_formatThemeListOptionsSymbol(options) {
            let newOptions = {
                startData: undefined,
                dataSource: [],
                radius: []
            };
            newOptions.startData = Number(options[0].min);
            for (let i = 0; i < options.length; i++) {
                newOptions.dataSource.push(Number(options[i].max));
                newOptions.radius.push(options[i].radius);
            }
            return newOptions;
        },
        $_getValueById(id, key, options) {
            let value;
            let rects = options.rects;
            for (let i = 0; i < rects.length; i++) {
                let rows = rects[i].rows;
                for (let j = 0; j < rows.length; j++) {
                    if (rows[j].type !== "multiCols") {
                        if (rows[j].id === id) {
                            value = rows[j][key];
                        }
                    } else {
                        let children = rows[j].children;
                        for (let k = 0; k < children.length; k++) {
                            if (children[k].id === id) {
                                value = children[k][key];
                            }
                        }
                    }
                }
            }
            return value;
        },
        $_highLightFeature(highlightFeature) {
            if (this.themeType === "heatmap" || this.themeType === "symbol") {
                return;
            }
            this.highlightFeature = highlightFeature || this.highlightFeature;
            if (this.highlightFeature && this.highlightFeature instanceof Object) {
                if (this.highlightFeature.hasOwnProperty("properties") && this.highlightFeature.properties.fid) {
                    if (this.hoveredStateId) {
                        this.map.setFeatureState(
                            {source: this.tipsSourceId, id: this.hoveredStateId},
                            {hover: false}
                        );
                    }
                    this.hoveredStateId = this.highlightFeature.properties.fid;
                    this.map.setFeatureState(
                        {source: this.tipsSourceId, id: this.hoveredStateId},
                        {hover: true}
                    );
                }
                if (this.highlightFeature.hasOwnProperty("geometry") && this.highlightFeature.geometry.coordinates) {
                    this.$_addTips(this.$_getCenter(this.highlightFeature), this.highlightFeature);
                }
            }
        },
        $_getCenter(feature) {
            let coordinates, points = [];
            if (feature.geometry.type === "MultiPolygon") {
                coordinates = feature.geometry.coordinates[0][0];
            } else {
                coordinates = feature.geometry.coordinates[0];
            }
            for (let i = 0; i < coordinates.length; i++) {
                points.push(turf.point([coordinates[i][0], coordinates[i][1]]));
            }
            let featuresCollection = turf.featureCollection(points);
            let center = turf.center(featuresCollection);
            return center.geometry.coordinates;
        },
        $_deleteHeightLightLayerByIndex(index) {
            if (this.dataType === "fill") {
                this.hoveredStateId = this.dataSource.features[index].id;
                this.map.setFeatureState(
                    {source: this.source_Id, id: this.hoveredStateId},
                    {hover: false}
                );
                this.hoveredStateId = null;
            }
        },
        $_addHeightLightLayer(name, options, source_Id, themeType) {
            let hId, heightLightLayer;
            if (this.dataSource && this.dataSource instanceof Object) {
                this.map.addSource(
                    source_Id,
                    {
                        "type": "geojson",
                        "data": this.dataSource
                    }
                );
            } else if (this.dataSourceUrl && this.dataSourceUrl instanceof Object) {
                this.map.addSource(
                    source_Id,
                    {
                        "type": "geojson",
                        "data": this.dataSourceUrl
                    }
                );
            } else {
                return;
            }
            if (this.themeType !== "symbol" && this.themeType !== "heatmap") {
                if (this.dataType === "fill") {
                    hId = this.layerIdCopy + this.$_getThemeName(themeType) + name + "_高亮_线";
                    let hIdFill = this.layerIdCopy + this.$_getThemeName(themeType) + name + "_高亮_多边形";
                    heightLightLayer = {
                        id: hId,
                        type: "line",
                        source: source_Id,
                        paint: {
                            "line-color": "#7B75C6",
                            "line-width": ['case',
                                ['boolean', ['feature-state', 'hover'], false],
                                4,
                                0]
                        }
                    }
                    let heightLightLayerFill = {
                        id: hIdFill,
                        type: "fill",
                        source: source_Id,
                        paint: {
                            "fill-color": "#7B75C6",
                            "fill-opacity": ['case',
                                ['boolean', ['feature-state', 'hover'], false],
                                0.5,
                                0]
                        }
                    }
                    if (options.highlightStyle) {
                        const {lineStyle, fillStyle} = options.highlightStyle;
                        if (lineStyle) {
                            if (lineStyle.color) {
                                heightLightLayer.paint["line-color"] = lineStyle.color;
                            }
                            if (lineStyle.width) {
                                heightLightLayer.paint["line-width"] = ['case',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    lineStyle.width,
                                    0];
                            }
                            if (lineStyle.opacity) {
                                heightLightLayer.paint["line-opacity"] = lineStyle.opacity;
                            }
                        }
                        if (fillStyle) {
                            if (fillStyle.color) {
                                heightLightLayerFill.paint["fill-color"] = fillStyle.color;
                            }
                            if (fillStyle.opacity) {
                                heightLightLayerFill.paint["fill-opacity"] = ['case',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    fillStyle.opacity,
                                    0];
                            }
                        }
                    }
                    if (!this.map.getLayer(hIdFill)) {
                        this.map.addLayer(heightLightLayerFill);
                    }
                } else if (this.dataType === "circle") {
                    hId = this.layerIdCopy + this.$_getThemeName(themeType) + name + "_高亮_点";
                    let cRadius;
                    if (this.themeOption.layerStyle) {
                        const {radius} = this.themeOption.layerStyle;
                        cRadius = radius || 6;
                    }
                    heightLightLayer = {
                        id: hId,
                        type: "circle",
                        source: source_Id,
                        paint: {
                            "circle-color": "#0000FF",
                            "circle-stroke-color": "#7B75C6",
                            "circle-stroke-width": 2,
                            "circle-stroke-opacity": ['case',
                                ['boolean', ['feature-state', 'hover'], false],
                                0.5,
                                0],
                            "circle-radius": cRadius,
                            "circle-opacity": ['case',
                                ['boolean', ['feature-state', 'hover'], false],
                                0.5,
                                0]
                        }
                    }
                    if (options.highlightStyle) {
                        const {pointStyle} = options.highlightStyle;
                        if (pointStyle) {
                            if (pointStyle.color) {
                                heightLightLayer.paint["circle-color"] = pointStyle.color;
                            }
                            if (pointStyle.radius) {
                                heightLightLayer.paint["circle-radius"] = pointStyle.radius;
                            }
                            if (pointStyle.outlineColor) {
                                heightLightLayer.paint["circle-stroke-color"] = pointStyle.outlineColor;
                            }
                            if (pointStyle.outlineWidth) {
                                heightLightLayer.paint["circle-stroke-width"] = pointStyle.outlineWidth;
                            }
                            if (pointStyle.outlineOpacity) {
                                heightLightLayer.paint["circle-stroke-opacity"] = ['case',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    pointStyle.outlineOpacity,
                                    0];
                            }
                            if (pointStyle.opacity) {
                                heightLightLayer.paint["circle-opacity"] = ['case',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    pointStyle.opacity,
                                    0];
                            }
                        }
                    }
                } else if (this.dataType === "line") {
                    hId = this.layerIdCopy + this.$_getThemeName(themeType) + name + "_高亮_线";
                    let lWidth;
                    if (this.themeOption.layerStyle) {
                        const {width} = this.themeOption.layerStyle;
                        lWidth = width || 1;
                    }
                    heightLightLayer = {
                        id: hId,
                        type: "line",
                        source: source_Id,
                        paint: {
                            "line-color": "#0000FF",
                            "line-width": lWidth,
                            "line-opacity": ['case',
                                ['boolean', ['feature-state', 'hover'], false],
                                0.5,
                                0]
                        }
                    }
                    if (options.highlightStyle) {
                        const {lineStyle} = options.highlightStyle;
                        if (lineStyle) {
                            if (lineStyle.color) {
                                heightLightLayer.paint["line-color"] = lineStyle.color;
                            }
                            if (lineStyle.width) {
                                heightLightLayer.paint["line-width"] = lineStyle.width;
                            }
                            if (lineStyle.opacity) {
                                heightLightLayer.paint["line-opacity"] = ['case',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    lineStyle.opacity,
                                    0];
                            }
                        }
                    }
                }
                if (!this.map.getLayer(hId)) {
                    this.map.addLayer(heightLightLayer);
                }
            }
        },
        $_addPopup(coordinates, feature) {
            if (window.popup) {
                this.$_removePopup();
            }
            if (!window.popup) {
                let popupOptions = {
                    offset: 12,
                    closeOnClick: false,
                    closeButton: true,
                    maxWidth: '300px',
                    className: 'popup-content'
                }
                popupOptions = Object.assign(popupOptions, this.popupOptions);
                window.popup = new this.mapbox.Popup(popupOptions).addTo(this.map);
            }
            const {type} = this.popupOptions;
            window.popup.setHTML(getPopupHtml(type, feature, this.popupOptions, this.selectValue));
            window.popup.setLngLat(coordinates);
        },
        $_removePopup() {
            if (window.popup) {
                window.popup.remove();
                window.popup = undefined;
            }
        },
        $_addTips(coordinates, feature) {
            if (this.enableTips) {
                if (!window.tips) {
                    let tipsOption = {
                        offset: 12,
                        closeOnClick: false,
                        closeButton: false,
                        maxWidth: "300px",
                        className: 'popup-content'
                    }
                    tipsOption = Object.assign(tipsOption, this.tipsOptions);
                    window.tips = new this.mapbox.Popup(tipsOption).addTo(this.map);
                }
                const {type} = this.tipsOptions;
                window.tips.setHTML(getPopupHtml(type, feature, this.tipsOptions, this.selectValue));
                window.tips.setLngLat(coordinates);
            }
        },
        $_removeTips() {
            if (window.tips) {
                window.tips.remove();
                window.tips = undefined;
            }
        },
        $_resultToGeojson(result) {
            let geojson = {
                "type": "FeatureCollection",
                "features": []
            };
            let FldName = result.AttStruct.FldName;
            for (let i = 0; i < result.SFEleArray.length; i++) {
                let fGeom = result.SFEleArray[i].fGeom, feature, coordinates;
                let AttValue = result.SFEleArray[i].AttValue;
                if (fGeom.LinGeom.length > 0) {

                } else if (fGeom.PntGeom.length > 0) {

                } else if (fGeom.RegGeom.length > 0) {
                    let RegGeom = fGeom.RegGeom;
                    let properties = {};
                    for (let g = 0; g < FldName.length; g++) {
                        properties[FldName[g]] = AttValue[g];
                    }
                    if (RegGeom.length > 1) {
                        feature = {
                            "type": "Feature",
                            "properties": properties,
                            "geometry": {
                                "type": "MultiPolygon",
                                "coordinates": []
                            }
                        };
                        for (let k = 0; k < RegGeom.length; k++) {
                            coordinates = [];
                            let Dots = RegGeom[k].Rings[0].Arcs[0].Dots;
                            for (let m = 0; m < Dots.length; m++) {
                                coordinates.push([Dots[m].x, Dots[m].y]);
                            }
                            feature.geometry.coordinates.push([coordinates]);
                        }
                    } else {
                        coordinates = [];
                        let Dots = RegGeom[0].Rings[0].Arcs[0].Dots;
                        for (let m = 0; m < Dots.length; m++) {
                            coordinates.push([Dots[m].x, Dots[m].y]);
                        }
                        feature = {
                            "type": "Feature",
                            "properties": properties,
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [coordinates]
                            }
                        };
                    }
                }
                geojson.features.push(feature);
            }
            return geojson;
        },
        $_addThemeLayerBySource() {
            let vm = this;
            this.$_getThemeOptionCopy();
            if (this.dataSource && !(this.dataSource instanceof Array) && this.dataSource instanceof Object && Object.keys(this.dataSource).length > 0) {
                vm.$_addTheme(this.dataSource);
            } else if (this.dataSource && typeof this.dataSource === "string") {
                if (this.dataSource.indexOf("igs/rest/mrfs/layer/query") >= 0) {
                    FeatureService.get(this.dataSource,
                        function (result) {
                            result = JSON.parse(result);
                            let LabelDots = result.LabelDots;
                            result = vm.$_resultToGeojson(result);
                            let textGeojson = {
                                type: "FeatureCollection",
                                features: []
                            }
                            for (let k = 0; k < LabelDots.length; k++) {
                                textGeojson.features.push({
                                    "type": "Feature",
                                    "properties": result.features[k].properties,
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [LabelDots[k].X, LabelDots[k].Y]
                                    }
                                });
                            }
                            vm.igsTextSourceId = "igs_text_" + parseInt(String(Math.random() * 10000));
                            vm.map.addSource(vm.igsTextSourceId, {
                                type: "geojson",
                                data: textGeojson
                            });
                            vm.dataSourceUrl = result;
                            vm.$_addTheme(result);
                        });
                } else {
                    FeatureService.get(this.dataSource, function (result) {
                        result = JSON.parse(result);
                        vm.dataSourceUrl = result;
                        vm.$_addTheme(result);
                    });
                }
            }

        },
        $_addTipsAndPopup(themeType) {
            let vm = this;
            //是否开启tips
            if (this.enableTips && this.type !== "symbol" && this.type !== "heatmap") {
                //是否开启高亮
                if (this.tipsOptions.enableHighlight || !this.tipsOptions.hasOwnProperty("enableHighlight")) {
                    this.tipsSourceId = this.layerIdCopy + "_tips_" + parseInt(String(Math.random() * 10000));
                    this.$_addHeightLightLayer("_tips", this.tipsOptions, this.tipsSourceId, themeType);
                    this.map.on('mousemove', this.layerIdCopy + this.$_getThemeName(), (e) => {
                        if (vm.enableTips) {
                            if (vm.hoveredStateId) {
                                vm.map.setFeatureState(
                                    {source: vm.tipsSourceId, id: vm.hoveredStateId},
                                    {hover: false}
                                );
                            }
                            vm.hoveredStateId = e.features[0].id;
                            vm.map.setFeatureState(
                                {source: vm.tipsSourceId, id: vm.hoveredStateId},
                                {hover: true}
                            );
                            vm.$_addTips([e.lngLat.lng, e.lngLat.lat], e.features[0]);
                            vm.$emit("highlightChanged", vm.hoveredStateId);
                        }
                    });
                    this.map.on('mouseleave', this.layerIdCopy + this.$_getThemeName(), (e) => {
                        if (vm.enableTips) {
                            if (vm.hoveredStateId !== null) {
                                vm.map.setFeatureState(
                                    {source: vm.tipsSourceId, id: vm.hoveredStateId},
                                    {hover: false}
                                );
                                vm.$_removeTips();
                            }
                            vm.hoveredStateId = null;
                        }
                    });
                } else {
                    this.map.on('mousemove', this.layerIdCopy + this.$_getThemeName(), (e) => {
                        if (vm.enableTips) {
                            vm.hoveredStateId = e.features[0].id;
                            vm.$_addTips([e.lngLat.lng, e.lngLat.lat], e.features[0]);
                        }
                    });
                    this.map.on('mouseleave', this.layerIdCopy + this.$_getThemeName(), (e) => {
                        if (vm.enableTips) {
                            if (vm.hoveredStateId !== null) {
                                vm.$_removeTips();
                            }
                            vm.hoveredStateId = null;
                        }
                    });
                }
            }
            //是否开启Popup
            if (this.enablePopup && this.type !== "symbol" && this.type !== "heatmap") {
                if (this.popupOptions.enableHighlight || !this.popupOptions.hasOwnProperty("enableHighlight")) {
                    this.popupSourceId = this.layerIdCopy + "_popup_" + parseInt(String(Math.random() * 10000));
                    this.$_addHeightLightLayer("_popup", this.popupOptions, this.popupSourceId, themeType);
                }
                this.map.on('click', this.layerIdCopy + this.$_getThemeName(), (e) => {
                    if (vm.enablePopup) {
                        if (vm.popupStateId) {
                            vm.map.setFeatureState(
                                {source: vm.popupSourceId, id: vm.popupStateId},
                                {hover: false}
                            );
                        }
                        vm.popupStateId = e.features[0].id;
                        vm.map.setFeatureState(
                            {source: vm.popupSourceId, id: vm.popupStateId},
                            {hover: true}
                        );
                        vm.$_addPopup([e.lngLat.lng, e.lngLat.lat], e.features[0]);
                    }
                });
            }
        },
        $_addTheme(dataSource) {
            let vm = this;
            for (let i = 0; i < dataSource.features.length; i++) {
                if (!dataSource.features[i].hasOwnProperty("id")) {
                    dataSource.features[i].id = i + 1;
                }
            }
            this.source_Id = "geojson_" + parseInt(Math.random() * 10000);
            this.map.addSource(this.source_Id, {
                type: "geojson",
                data: dataSource
            });
            this.initType = "props";
            let layerId = this.layerId || "geojson_layer_" + parseInt(Math.random() * 10000);
            this.selectValue = this.field;
            themeManager.field = this.selectValue;
            themeManager.vueId = this.vueId;
            this.$_addThemeLayer(this.type, layerId, this.selectValue);
            this.$_addTipsAndPopup();
        },
        $_addThemeLayer(themeType, layerId, themeField) {
            this.$refs.themePanel.$_show();
            let vm = this;
            if (themeType) {
                //初始化专题图存储对象
                themeManager.vueId = this.vueId;
                themeManager.initLayerProps(layerId);
                //取得原图层绘制信息
                let originLayerStyle = this.$_getLayerStyle(layerId);
                this.$_setOriginPaint(layerId, originLayerStyle);
                //保存原始图层信息
                themeManager.setLayerProps(layerId, layerId, originLayerStyle);
                //设置专题图类型
                themeManager.setLayerProps(layerId, "themeType", themeType);
            }
            //存储layerId
            this.layerIdCopy = layerId;
            //专题图类型
            this.themeType = themeType;
            //取得下一个图层的ID，没有就是undefined
            this.upLayer = this.$_getUpLayer();
            this.$refs.themePanel.$_setTitle(layerId);
            //保存图层信息
            this.$_setLayerInfo(this.layerIdCopy);
            let hasManager = themeManager.hasManager(this.layerIdCopy + this.$_getThemeName());
            if (hasManager) {
                this.themeType = themeManager.getLayerProps(layerId, "themeType");
                this.selectValue = themeManager.getSelectField(this.layerIdCopy, this.themeType);
                themeManager.field = this.selectValue;
                let fields;
                if (this.themeType === "unique" || this.themeType === "uniform") {
                    fields = themeManager.getLayerProps(this.layerIdCopy, "fields");
                } else {
                    fields = themeManager.getLayerProps(this.layerIdCopy, "numberFields");
                }
                let textFields = themeManager.getLayerProps(this.layerIdCopy, "fields");
                this.dataType = themeManager.getLayerProps(this.layerIdCopy, "dataType");
                this.source_Id = themeManager.getLayerProps(this.layerIdCopy, this.layerIdCopy).source;
                let props = themeManager.getPanelByField(this.layerIdCopy, this.themeType, this.selectValue);
                this.$refs.themePanel.$_setDataType(this.dataType);
                this.$refs.themePanel.$_setPanel(props, this.selectValue, fields);
                this.currentGradient = props["gradient-color"];
                this.$refs.themePanel.currentThemeType = this.themeType;
                this.$refs.themePanel.$_setLabelFields(["未设置"].concat(textFields), true);
                if (this.themeType === "range") {
                    let rangeLevel = themeManager.getExtraData(this.layerIdCopy, this.themeType, "rangeLevel");
                    this.$refs.themePanel.rangeLevel = rangeLevel;
                }
                if (this.themeType === "symbol") {
                    let radiusArr = themeManager.getExtraDataByField(this.layerIdCopy, this.themeType, "radiusArr", this.selectValue);
                    this.$refs.themePanel.$_setRadiusArr(radiusArr);
                    this.startData = props.startData;
                    this.$nextTick(function () {
                        let iconUrl = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "icon-url");
                        this.$refs.themePanel.$_resetIcon(iconUrl);
                    });
                }
                if (this.dataType === "fill" || this.dataType === "line") {
                    let patternUrl = themeManager.getPanelProps(this.layerIdCopy, this.themeType, this.dataType + "-pattern-url");
                    if (patternUrl) {
                        this.$nextTick(function () {
                            this.$refs.themePanel.$_setPattern(patternUrl);
                        });
                    }
                }
                let dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
                if (dataSource) {
                    this.$refs.themePanel.$_setDataSoure(dataSource);
                }
                //抛出更新图例事件
                let legends = this.$_getLegend(this.layerIdCopy);
                this.$emit("updateLegend", legends);
                this.$refs.themePanel.$_show();
                if (this.initType !== "props") {
                    //将原图层opacity设置为0，而不是设置原图层的visibility，因为隐藏了某些时候queryRenderFeature会取不到数据
                    this.map.setPaintProperty(this.layerIdCopy, this.dataType + "-opacity", 0);
                }
            } else {
                //取得数据
                this.$_getDataByLayer(layerId, function (features) {
                    //设定数据几何类型
                    vm.$_setDataType(features[0]);
                    //保存字段信息
                    let fieldsObj = vm.$_setFieldsInfo(features);
                    //绑定数据
                    let fields, dataSource, checkBoxAr;
                    //设置渐变颜色
                    vm.currentGradient = gradients[0].key;
                    switch (themeType) {
                        case "uniform":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "fields");
                            if (vm.initType === "props") {
                                vm.selectValue = themeField;
                            } else {
                                vm.selectValue = fields[0];
                            }
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "unique");
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            //覆盖渐变颜色
                            vm.currentGradient = "#EE4C5A";
                            vm.$_setUniformColors(vm.currentGradient, vm.dataSourceCopy, vm.selectValue);
                            //可以复用单值专题图
                            vm.$_addUniqueLayer();
                            break;
                        case "unique":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "fields");
                            if (vm.initType === "props") {
                                vm.selectValue = themeField;
                            } else {
                                vm.selectValue = fields[0];
                            }
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "unique");
                            checkBoxAr = vm.$_setCheckBoxArr(dataSource);
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            vm.$refs.themePanel.$_setCheckBoxArr(checkBoxAr);
                            vm.$_setUniqueColors(gradients[0].key, vm.dataSourceCopy, vm.selectValue);
                            vm.$refs.themePanel.$_setColors(vm.colors);
                            vm.$_addUniqueLayer();
                            break;
                        case "range":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            if (vm.initType === "props") {
                                vm.selectValue = themeField;
                            } else {
                                vm.selectValue = fields[0];
                            }
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            vm.rangeLevel = gradients[0].key.split(",").length;
                            themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "rangeLevel", vm.rangeLevel);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "range");
                            checkBoxAr = vm.$_setCheckBoxArr(dataSource);
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            vm.$refs.themePanel.$_setCheckBoxArr(checkBoxAr);
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$refs.themePanel.rangeLevel = vm.rangeLevel;
                            vm.$_setRangeColors(gradients[0].key, vm.dataSourceCopy, vm.selectValue, features);
                            vm.$refs.themePanel.$_setColors(vm.colors);
                            vm.$_addRangeLayer();
                            break;
                        case "symbol":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            if (vm.initType === "props") {
                                vm.selectValue = themeField;
                            } else {
                                vm.selectValue = fields[0];
                            }
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "range");
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$refs.themePanel.$_setIcons(vm.icons);
                            vm.$refs.themePanel.$_setDefaultIcon(vm.defaultIcon);
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            let radiusArr = [], radiusArrCopy = [];
                            for (let i = 0; i < dataSource.length; i++) {
                                radiusArr.push(i + 1);
                            }
                            themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "radiusArr", radiusArr);
                            vm.$refs.themePanel.$_setRadiusArr(radiusArr);
                            vm.$_addSymbolLayer(dataSource);
                            break;
                        case "heatmap":
                            vm.selectValue = themeField || fields[0];
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, fields[0], "unique");
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$_addHeatmapLayer(dataSource);
                            break;
                    }
                    if (vm.dataType === "fill" || vm.dataType === "line") {
                        vm.$refs.themePanel.$_setIcons(vm.icons);
                        vm.$refs.themePanel.$_setDefaultIcon(vm.defaultIcon);
                    }
                    let textFields = themeManager.getLayerProps(vm.layerIdCopy, "fields");
                    //设置选中字段
                    themeManager.setSelectField(vm.layerIdCopy, vm.themeType, vm.selectValue);
                    //设置面板参数
                    vm.$refs.themePanel.$_setFields(fields);
                    vm.$refs.themePanel.$_setLabelFields(["未设置"].concat(textFields));
                    vm.$refs.themePanel.$_setField(vm.selectValue);
                    vm.$refs.themePanel.$_setDataType(vm.dataType);
                    //抛出更新图例事件
                    let legends = vm.$_getLegend(vm.layerIdCopy);
                    vm.$emit("updateLegend", legends);
                    vm.$refs.themePanel.$_show();
                    if (vm.initType !== "props") {
                        //将原图层opacity设置为0，而不是设置原图层的visibility，因为隐藏了某些时候queryRenderFeature会取不到数据
                        vm.map.setPaintProperty(vm.layerIdCopy, vm.dataType + "-opacity", 0);
                    }
                });
            }
            if (this.panelType === "custom") {
            }
        },
        $_getNewArray(dataSource) {
            let newData = [];
            for (let k = 0; k < dataSource.length; k++) {
                newData.push(dataSource[k]);
            }
            return newData;
        },
        /**
         * 拥护已经加载了一张地图，通过mapbox的queryRenderFeature方法获取数据
         * @param layerId 图层ID
         * @return features 取得的要素集合
         * */
        $_getDataByLayer(layerId, callback) {
            if (!layerId) {
                throw new Error("layerId不能为空！");
            }
            if (!this.map.getLayer(layerId) && this.initType !== "props") {
                throw new Error(
                    "未找到该图层，请确认layerId：" +
                    layerId +
                    "是否正确，或图层是否存在！"
                );
            }
            let features;
            if (this.initType === "props") {
                if (typeof this.dataSource === "string") {
                    features = this.dataSourceUrl.features;
                } else {
                    features = this.dataSource.features;
                }
            } else {
                //从图层取得数据
                features = this.map.queryRenderedFeatures({layers: [layerId]});
            }
            if (this.hasNullProperty.indexOf(layerId) < 0) {
                this.$_getNullFields(features, layerId);
            }
            //如果不存在数据，则不绘制图层
            if (features.length === 0) {
                this.$emit("createLayerFailed", {
                    message: "专题图",
                    description: "数据量为0!"
                });
            } else {
                //执行回调
                callback(features);
            }
        },
        /**
         * 取得图层信息，并保存
         * @param layerId 图层Id
         * */
        $_setLayerInfo(layerId) {
            if (this.initType !== "props") {
                let layer = this.map.getLayer(layerId);
                this.source_Id = layer.source;
                this.source_layer_Id = layer.sourceLayer;
            }
        },
        /**
         * 将要素数组转化为geojson数据
         * @param features 要素数组
         * @return featureCollection 返回的geojson数据
         * */
        $_getFeatureCollection(features) {
            let featureCollection = {
                features: [],
                type: "FeatureCollection"
            };
            for (let i = 0; i < features.length; i++) {
                featureCollection.features.push({
                    geometry: features[i].geometry,
                    properties: features[i].properties,
                    type: "Feature"
                });
            }
            return featureCollection;
        },
        /**
         * 设置字段信息，包括所有可用字段（内容不全为空）和所有内容位数字的字段（字符串、浮点数、整数
         * @param features 要素数组
         * */
        $_setFieldsInfo(features) {
            let originFields = [], //原始的字段集合
                fields = [], //非空字段集合
                numberFields = [], //纯数字字段集合
                hasValueFlag = {}, //是否不全为空，计算纯数字字段集合使用
                numberFlag = {}; //是否全为数字，计算纯数字字段集合使用
            if (!features[0].hasOwnProperty("properties")) {
                throw new Error("没有properties对象！");
            }
            //取得所有的字段
            Object.keys(features[0].properties).forEach(function (key) {
                //排除proto上的对象
                if (features[0].properties.hasOwnProperty(key)) {
                    originFields.push(key);
                    numberFlag[key] = true;
                    hasValueFlag[key] = false;
                }
            });
            if (originFields.length === 0) {
                throw new Error("数据属性为空！");
            }
            //设置正则，只筛选数字
            let reg = new RegExp("^[0-9]+$"),
                regFloat = new RegExp("^[.\\d]*$");
            //取得非空字段以及数字字段
            for (let i = 0; i < originFields.length; i++) {
                //遍历该字段下的所有值
                //是否全部为空，初始为true，如果有一个，则设置为false
                let allNull = true;
                for (let j = 0; j < features.length; j++) {
                    let value = features[j].properties[originFields[i]];
                    //如果有值，则设置为false
                    if (value) {
                        //表示含有属性，会保留该字段
                        hasValueFlag[originFields[i]] = true;
                        allNull = false;
                    }
                    //含有非数字的属性，则设置为false
                    if (
                        value &&
                        !reg.test(value) &&
                        !regFloat.test(value) &&
                        numberFlag[originFields[i]]
                    ) {
                        numberFlag[originFields[i]] = false;
                    }
                }
                //筛选掉都为空的字段
                if (!allNull) {
                    fields.push(originFields[i]);
                }
            }
            //取得只含数字的字段
            Object.keys(numberFlag).forEach(function (key) {
                if (numberFlag[key] && hasValueFlag[key]) {
                    numberFields.push(key);
                }
            });
            themeManager.setLayerProps(this.layerIdCopy, "fields", fields);
            themeManager.setLayerProps(
                this.layerIdCopy,
                "numberFields",
                numberFields
            );
            return {
                fields: fields,
                numberFields: numberFields
            };
        },
        /**
         * 取得上一个layer的id确保专题图图层在两个原图层之间，而不是在下一个图层上面，为空也行
         * @return upLayerId 目标图层的上面一个图层
         * */
        $_getUpLayer() {
            let layers = this.map.getStyle().layers,
                upLayerId = undefined;
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].id === this.layerIdCopy) {
                    if (i + 1 < layers.length) {
                        upLayerId = layers[i + 1].id;
                    }
                    break;
                }
            }
            return upLayerId;
        },
        $_setUniformColors(color, dataSourceCopy, key) {
            //判断是为数字还是字符串
            let iSString = false;
            for (let i = 0; i < dataSourceCopy.length; i++) {
                if (typeof dataSourceCopy[i] === "string") {
                    iSString = true;
                    break;
                }
            }
            let newColors;
            if (iSString) {
                newColors = ["match", ["get", key], "", color];
                for (let i = 0; i < dataSourceCopy.length; i++) {
                    if (dataSourceCopy[i] !== "") {
                        newColors.push(dataSourceCopy[i]);
                        newColors.push(color);
                    }
                }
                newColors.push("#FFFFFF");
            } else {
                newColors = {
                    property: key,
                    stops: []
                };
                for (let i = 0; i < dataSourceCopy.length; i++) {
                    newColors.stops.push([dataSourceCopy[i], color]);
                }
            }
            themeManager.setExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-color",
                newColors
            );
            themeManager.setPanelProps(
                this.layerIdCopy,
                this.themeType,
                "uniformColor",
                color
            );
            return newColors;
        },
        /**
         * 根据colors、dataSource取得mapbox的绘制颜色数组，单值专题图
         * @param color 渐变颜色
         * @param dataSourceCopy 数据源
         * @param key 字段名
         * @newColors newColors 返回的绘制数据
         * */
        $_setUniqueColors(color, dataSourceCopy, key) {
            if (this.themeOption.layerStyle && this.themeOption.layerStyle.hasOwnProperty("color")) {
                color = this.themeOption.layerStyle.color;
            }
            //判断是为数字还是字符串
            let iSString = false;
            for (let i = 0; i < dataSourceCopy.length; i++) {
                if (dataSourceCopy[i] && typeof dataSourceCopy[i] === "string") {
                    iSString = true;
                    break;
                }
            }
            //根据渐变颜色取得所有颜色
            let colorArr = color.split(",");
            let colorArrLength = colorArr.length - 1;
            let dataLength = dataSourceCopy.length;
            let colorLength = [];
            let colors = [];
            for (let i = 0; i < colorArrLength; i++) {
                if (i === colorArrLength - 1) {
                    colorLength.push(
                        dataLength -
                        parseInt(dataLength / colorArrLength) * (colorArrLength - 1)
                    );
                } else {
                    colorLength.push(parseInt(dataLength / colorArrLength));
                }
            }
            for (let i = 0; i < colorLength.length; i++) {
                colors = colors.concat(
                    this.$_gradientColor(colorArr[i], colorArr[i + 1], colorLength[i])
                );
            }
            //根据数据与渐变颜色，取得绘制颜色
            let newColors,
                checkBoxArr = [];
            if (iSString) {
                newColors = ["match", ["get", key]];
                for (let i = 0; i < dataSourceCopy.length; i++) {
                    if (dataSourceCopy[i] !== "") {
                        newColors.push(dataSourceCopy[i]);
                        newColors.push(colors[i]);
                        checkBoxArr.push(true);
                    }
                }
                newColors.push("#FFFFFF");
                if (this.themeOption.styleGroups) {
                    let radius, outlineWidth, outlineColor, outlineOpacity, opacity;
                    for (let i = 0; i < this.themeOption.styleGroups.length; i++) {
                        if(newColors.indexOf(this.themeOption.styleGroups[i].value) >= 0){
                            newColors[newColors.indexOf(this.themeOption.styleGroups[i].value) + 1] = this.themeOption.styleGroups[i].style.color;
                        }
                        if (this.themeOption.styleGroups[i].style.radius) {
                            if (!radius) {
                                let r = this.themeOption.layerStyle.radius || 6;
                                radius = formatInterpolate(iSString, dataSourceCopy, key, r);
                            }
                            if(radius.indexOf(this.themeOption.styleGroups[i].value) >= 0){
                                radius[radius.indexOf(this.themeOption.styleGroups[i].value) + 1] = this.themeOption.styleGroups[i].style.radius;
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.outlineWidth) {
                            if (!outlineWidth) {
                                let w = this.themeOption.layerStyle.outlineWidth || 1;
                                outlineWidth = formatInterpolate(iSString, dataSourceCopy, key, w);
                            }
                            if(outlineWidth.indexOf(this.themeOption.styleGroups[i].value) >= 0){
                                outlineWidth[outlineWidth.indexOf(this.themeOption.styleGroups[i].value) + 1] = this.themeOption.styleGroups[i].style.outlineWidth;
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.outlineColor) {
                            if (!outlineColor) {
                                let c = this.themeOption.layerStyle.outlineColor || "#000000";
                                outlineColor = formatInterpolate(iSString, dataSourceCopy, key, c);
                            }
                            if(outlineColor.indexOf(this.themeOption.styleGroups[i].value) >= 0){
                                outlineColor[outlineColor.indexOf(this.themeOption.styleGroups[i].value) + 1] = this.themeOption.styleGroups[i].style.outlineColor;
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.outlineOpacity) {
                            if (!outlineOpacity) {
                                let o = this.themeOption.layerStyle.outlineOpacity || 1;
                                outlineOpacity = formatInterpolate(iSString, dataSourceCopy, key, o);
                            }
                            if(outlineOpacity.indexOf(this.themeOption.styleGroups[i].value) >= 0){
                                outlineOpacity[outlineOpacity.indexOf(this.themeOption.styleGroups[i].value) + 1] = this.themeOption.styleGroups[i].style.outlineOpacity;
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("opacity")) {
                            if (!opacity) {
                                let o = this.themeOption.layerStyle.opacity || 1;
                                opacity = formatInterpolate(iSString, dataSourceCopy, key, o);
                            }
                            if(opacity.indexOf(this.themeOption.styleGroups[i].value) >= 0){
                                opacity[opacity.indexOf(this.themeOption.styleGroups[i].value) + 1] = this.themeOption.styleGroups[i].style.opacity;
                            }
                        }
                    }
                    if (radius) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            this.dataType + "-radius",
                            radius
                        );
                    }
                    if (outlineWidth && this.dataType === "circle") {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "circle-stroke-width",
                            outlineWidth
                        );
                    }
                    if (outlineColor && this.dataType === "circle") {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "circle-stroke-color",
                            outlineColor
                        );
                    }
                    if (outlineOpacity && this.dataType === "circle") {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "circle-stroke-opacity",
                            outlineOpacity
                        );
                    }
                    if (opacity) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            this.dataType + "-opacity",
                            opacity
                        );
                    }
                }
            } else {
                newColors = {
                    property: key,
                    stops: []
                };
                for (let i = 0; i < dataSourceCopy.length; i++) {
                    newColors.stops.push([dataSourceCopy[i], colors[i]]);
                    checkBoxArr.push(true);
                }
                if (this.themeOption.styleGroups) {
                    for (let i = 0; i < this.themeOption.styleGroups.length; i++) {
                        for (let j = 0; j < newColors.stops.length; j++) {
                            if (newColors.stops[j][0] === this.themeOption.styleGroups[i].value) {
                                newColors.stops[j][1] = this.themeOption.styleGroups[i].style.color;
                            }
                        }
                    }
                }
            }
            //保存颜色，复选框的值
            themeManager.setPanelProps(
                this.layerIdCopy,
                this.themeType,
                "colors",
                colors
            );
            themeManager.setPanelProps(
                this.layerIdCopy,
                this.themeType,
                "checkBoxArr",
                checkBoxArr
            );
            themeManager.setExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-color",
                newColors
            );
            //将数值绑定到vue上
            this.$_setDataToVue("colors", colors);
            this.$_setDataToVue("checkBoxArr", checkBoxArr);
            return newColors;
        },
        $_getRangeColors(color, dataSourceCopy, key, features) {
            if (this.themeOption.layerStyle && this.themeOption.layerStyle.hasOwnProperty("color")) {
                color = this.themeOption.layerStyle.color;
            }
            let colors = ["step", ["to-number", ["get", key]]], checkBoxArr = [], colorArr = color.split(",");
            colors.push("#ffffff");
            let valueArr = [], index = 0;
            for (let i = 0; i < features.length; i++) {
                let value = features[i].properties[key];
                if (
                    value !== "" &&
                    value !== undefined &&
                    value !== null &&
                    valueArr.indexOf(Number(value)) < 0
                ) {
                    valueArr.push(Number(value));
                }
            }
            valueArr = valueArr.sort(function (a, b) {
                return a - b;
            });
            for (let i = 0; i < colorArr.length; i++) {
                checkBoxArr.push(true);
                for (let j = index; j < valueArr.length; j++) {
                    let value = valueArr[j];
                    if (Number(value) <= dataSourceCopy[i]) {
                        colors.push(Number(value));
                        colors.push(colorArr[i]);
                        if (j === valueArr.length - 1) {
                            index = j + 1;
                        }
                    } else {
                        index = j;
                        break;
                    }
                }
            }
            return {
                colors: colors,
                checkBoxArr: checkBoxArr
            }
        },
        $_setRangeColors(color, dataSourceCopy, key, features) {
            let colorAndCheckBox = this.$_getRangeColors(color, dataSourceCopy, key, features);
            let colors = colorAndCheckBox.colors;
            let checkBoxArr = colorAndCheckBox.checkBoxArr;
            let opacitys, radiuses, outlineWidths, outlineColors, outlineOpacities;
            //如果有styleGroups，则应用
            if (this.themeOption.styleGroups && this.themeOption.styleGroups.length > 0) {
                //处理透明度
                let opacity = 1;
                const {layerStyle} = this.themeOption;
                if (layerStyle && layerStyle.hasOwnProperty("opacity")) {
                    opacity = this.themeOption.layerStyle.opacity;
                }
                opacitys = ["step", ["to-number", ["get", key]], opacity];
                for (let k = 3; k < colors.length; k += 2) {
                    opacitys[k] = colors[k];
                    opacitys[k + 1] = opacity;
                }
                //处理半径
                let radius = 6;
                if (layerStyle && layerStyle.hasOwnProperty("radius")) {
                    radius = this.themeOption.layerStyle.radius;
                }
                radiuses = ["step", ["to-number", ["get", key]], radius];
                for (let k = 3; k < colors.length; k += 2) {
                    radiuses[k] = colors[k];
                    radiuses[k + 1] = radius;
                }
                //处理外边线宽度
                let outlineWidth = 1;
                if (layerStyle && layerStyle.hasOwnProperty("outlineWidth")) {
                    outlineWidth = this.themeOption.layerStyle.outlineWidth;
                }
                outlineWidths = ["step", ["to-number", ["get", key]], outlineWidth];
                for (let k = 3; k < colors.length; k += 2) {
                    outlineWidths[k] = colors[k];
                    outlineWidths[k + 1] = outlineWidth;
                }
                //处理外边线颜色
                let outlineColor = "#000000";
                if (layerStyle && layerStyle.hasOwnProperty("outlineColor")) {
                    outlineColor = this.themeOption.layerStyle.outlineColor;
                }
                outlineColors = ["step", ["to-number", ["get", key]], outlineColor];
                for (let k = 3; k < colors.length; k += 2) {
                    outlineColors[k] = colors[k];
                    outlineColors[k + 1] = outlineColor;
                }
                //处理外边线透明度
                let outlineOpacity = 1;
                if (layerStyle && layerStyle.hasOwnProperty("outlineColor")) {
                    outlineOpacity = this.themeOption.layerStyle.outlineOpacity;
                }
                outlineOpacities = ["step", ["to-number", ["get", key]], outlineOpacity];
                for (let k = 3; k < colors.length; k += 2) {
                    outlineOpacities[k] = colors[k];
                    outlineOpacities[k + 1] = outlineOpacity;
                }
                for (let i = 0; i < this.themeOption.styleGroups.length; i++) {
                    if (this.themeOption.styleGroups[i].hasOwnProperty("style") && this.themeOption.styleGroups[i].hasOwnProperty("start") && this.themeOption.styleGroups[i].hasOwnProperty("end")) {
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("color")) {
                            for (let j = 3; j < colors.length; j += 2) {
                                if (this.themeOption.styleGroups[i].start <= colors[j] && colors[j] <= this.themeOption.styleGroups[i].end) {
                                    colors[j + 1] = this.themeOption.styleGroups[i].style.color;
                                } else if (colors[j] > this.themeOption.styleGroups[i].end) {
                                    break;
                                }
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("opacity")) {
                            for (let j = 3; j < opacitys.length; j += 2) {
                                if (this.themeOption.styleGroups[i].start <= opacitys[j] && opacitys[j] <= this.themeOption.styleGroups[i].end) {
                                    opacitys[j + 1] = this.themeOption.styleGroups[i].style.opacity;
                                } else if (opacitys[j] > this.themeOption.styleGroups[i].end) {
                                    break;
                                }
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("radius")) {
                            for (let j = 3; j < radiuses.length; j += 2) {
                                if (this.themeOption.styleGroups[i].start <= radiuses[j] && radiuses[j] <= this.themeOption.styleGroups[i].end) {
                                    radiuses[j + 1] = this.themeOption.styleGroups[i].style.radius;
                                } else if (radiuses[j] > this.themeOption.styleGroups[i].end) {
                                    break;
                                }
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("outlineWidth")) {
                            for (let j = 3; j < outlineWidths.length; j += 2) {
                                if (this.themeOption.styleGroups[i].start <= outlineWidths[j] && outlineWidths[j] <= this.themeOption.styleGroups[i].end) {
                                    outlineWidths[j + 1] = this.themeOption.styleGroups[i].style.outlineWidth;
                                } else if (outlineWidths[j] > this.themeOption.styleGroups[i].end) {
                                    break;
                                }
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("outlineColor")) {
                            for (let j = 3; j < outlineColors.length; j += 2) {
                                if (this.themeOption.styleGroups[i].start <= outlineColors[j] && outlineColors[j] <= this.themeOption.styleGroups[i].end) {
                                    outlineColors[j + 1] = this.themeOption.styleGroups[i].style.outlineColor;
                                } else if (outlineColors[j] > this.themeOption.styleGroups[i].end) {
                                    break;
                                }
                            }
                        }
                        if (this.themeOption.styleGroups[i].style.hasOwnProperty("outlineOpacity")) {
                            for (let j = 3; j < outlineOpacities.length; j += 2) {
                                if (this.themeOption.styleGroups[i].start <= outlineOpacities[j] && outlineOpacities[j] <= this.themeOption.styleGroups[i].end) {
                                    outlineOpacities[j + 1] = this.themeOption.styleGroups[i].style.outlineOpacity;
                                } else if (outlineOpacities[j] > this.themeOption.styleGroups[i].end) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            //保存颜色，复选框的值
            themeManager.setPanelProps(
                this.layerIdCopy,
                this.themeType,
                "colors",
                color.split(",")
            );
            themeManager.setPanelProps(
                this.layerIdCopy,
                this.themeType,
                "checkBoxArr",
                checkBoxArr
            );
            themeManager.setExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-color",
                colors
            );
            themeManager.setExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-opacity",
                opacitys
            );
            if (this.dataType === "circle") {
                if (radiuses) {
                    themeManager.setExtraData(
                        this.layerIdCopy,
                        this.themeType,
                        "circle-radius",
                        radiuses
                    );
                }
                if (outlineWidths) {
                    themeManager.setExtraData(
                        this.layerIdCopy,
                        this.themeType,
                        "circle-stroke-width",
                        outlineWidths
                    );
                }
                if (outlineColors) {
                    themeManager.setExtraData(
                        this.layerIdCopy,
                        this.themeType,
                        "circle-stroke-color",
                        outlineColors
                    );
                }
                if (outlineOpacities) {
                    themeManager.setExtraData(
                        this.layerIdCopy,
                        this.themeType,
                        "circle-stroke-opacity",
                        outlineOpacities
                    );
                }
            }
            //将数值绑定到vue上
            this.$_setDataToVue("colors", color.split(","));
            this.$_setDataToVue("checkBoxArr", checkBoxArr);
            return colors;
        },
        /**
         * 根据themeType，添加相应图层
         * @param featureCollection geojson数据
         * */
        $_addLayer(featureCollection) {
        },
        $_gradientColor(startColor, endColor, step) {
            return gradientColor(startColor, endColor, step);
        },
        /**
         * 将外部参数（mapbox参数）转化为面板参数，xx-xx-xx转化为驼峰命名的参数，并且不绑定在vue上面，通过panel的方法进行更新
         * @param panelProps 外部传入的props
         * @return newPanelProps 转换好的props，驼峰命名
         * */
        $_getProps(panelProps) {
            let newPanelProps = {};
            Object.keys(panelProps).forEach(function (key) {
                if (
                    panelProps.hasOwnProperty(key) &&
                    typeof panelProps[key] !== "function"
                ) {
                    let values = panelProps[key].split("-");
                    let newValue = "";
                    for (let i = 0; i < values.length; i++) {
                        if (i === 0) {
                            newValue = values[i];
                        } else {
                            newValue +=
                                values[i].substr(0, 1).toUpper +
                                values[i].substr(1, values[i].length - 1);
                        }
                    }
                    newPanelProps[key] = newValue;
                }
            });
            return newPanelProps;
        },
        /**
         * 取得数据，并绑定到vue上
         * @param features 要素数组
         * @param key 字段名
         * @param type 单值或分段
         * */
        $_setDataSource(features, key, type, setData) {
            let dataSourceCopy = [], newDataSourceCopy = [];
            for (let i = 0; i < features.length; i++) {
                if (
                    features[i].properties[key] !== "" &&
                    features[i].properties[key] !== null &&
                    features[i].properties[key] !== undefined
                ) {
                    dataSourceCopy.push(features[i].properties[key]);
                }
            }
            dataSourceCopy.sort(function (a, b) {
                return a - b;
            });
            dataSourceCopy = Array.from(new Set(dataSourceCopy));
            switch (type) {
                case "unique":
                    this.$_setDataToVue("dataSourceCopy", dataSourceCopy);
                    this.$_setDataToVue("dataSourceCopyBack", dataSourceCopy);
                    newDataSourceCopy = dataSourceCopy;
                    break;
                case "range":
                    let length = dataSourceCopy.length;
                    //某些情况下，取得的数字数据包含字符串要排除
                    let temp = [];
                    for (let j = 0; j < length; j++) {
                        if (!isNaN(Number(dataSourceCopy[j]))) {
                            temp.push(Number(dataSourceCopy[j]));
                        }
                    }
                    dataSourceCopy = temp;
                    length = dataSourceCopy.length;
                    let range = dataSourceCopy[length - 1] - dataSourceCopy[0];
                    if (range === 0) {
                        newDataSourceCopy.push(dataSourceCopy[0]);
                        this.startData = dataSourceCopy[0];
                        this.$refs.themePanel.startData = this.startData;
                        this.$refs.themePanel.startDataCopy = this.startData;
                        themeManager.setExtraData(this.layerIdCopy, this.themeType, "dataSource", newDataSourceCopy);
                        themeManager.setPanelProps(this.layerIdCopy, this.themeType, "startData", this.startData);
                        return newDataSourceCopy;
                    } else {
                        let rangeSect = range / this.rangeLevel;
                        let floatLength;
                        if (String(rangeSect).indexOf(".") > -1) {
                            floatLength = String(rangeSect).split(".")[1].length;
                        }
                        if (dataSourceCopy[0] < 0) {
                            this.startData = dataSourceCopy[0] - 1;
                        } else {
                            this.startData = dataSourceCopy[0];
                        }
                        for (let j = 0; j < this.rangeLevel; j++) {
                            newDataSourceCopy.push(Number(dataSourceCopy[0]) + (j + 1) * rangeSect);
                        }
                        this.endData = newDataSourceCopy[this.rangeLevel - 1] + rangeSect;
                    }
                    this.$_setDataToVue("dataSourceCopy", newDataSourceCopy);
                    this.$_setDataToVue("dataSourceCopyBack", newDataSourceCopy);
                    break;
            }
            if (this.themeType !== "heatmap" && !setData) {
                if (this.themeType !== "uniform" && this.themeType !== "unique") {
                    this.$refs.themePanel.startData = this.startData;
                    this.$refs.themePanel.startDataCopy = this.startData;
                }
                themeManager.setExtraData(this.layerIdCopy, this.themeType, "dataSource", newDataSourceCopy);
            }
            return newDataSourceCopy;
        },
        /**
         * 将数据绑定到vue上，因为要导出数据，因此不能直接保定，否则会带上vue的变量
         * @param key 变量名
         * @param value 变量值
         * */
        $_setDataToVue(key, value) {
            if (value instanceof Array) {
                let newData = [];
                for (let i = 0; i < value.length; i++) {
                    newData.push(value[i]);
                }
                this[key] = newData;
            }
        },
        /**
         * 取得数据几何类型
         * @param feature 一个要素
         * */
        $_setDataType(feature) {
            switch (feature.geometry.type) {
                case "Point":
                    this.dataType = "circle";
                    break;
                case "MultiPoint":
                    this.dataType = "circle";
                    break;
                case "LineString":
                    this.dataType = "line";
                    break;
                case "MultiLineString":
                    this.dataType = "line";
                    break;
                case "Polygon":
                    this.dataType = "fill";
                    break;
                case "MultiPolygon":
                    this.dataType = "fill";
                    break;
            }
            //保存数据类型
            themeManager.setLayerProps(this.layerIdCopy, "dataType", this.dataType);
        },
        $_editLayerByStyle(layer) {
            let paintRadius = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-radius"
            );
            let outlineWidth = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-stroke-width"
            );
            let outlineColor = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-stroke-color"
            );
            let opacity = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-opacity"
            );
            let outlineOpacity = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                "circle-stroke-opacity"
            );
            let layers;
            if (this.themeOption.layerStyle) {
                layers = formatStyleToLayer(this.themeOption.layerStyle, this.themeType, this.dataType, layer.id);
                //当要素类型为fill时，要单独设置边线宽度、边线颜色、边线透明度
                if (this.dataType === "fill") {
                    if (this.themeOption.layerStyle.hasOwnProperty("outlineWidth")) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "line-width",
                            this.themeOption.layerStyle.outlineWidth
                        );
                    }
                    if (this.themeOption.layerStyle.hasOwnProperty("outlineColor")) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "line-color",
                            this.themeOption.layerStyle.outlineColor
                        );
                    }
                    if (this.themeOption.layerStyle.hasOwnProperty("outlineOpacity")) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "line-opacity",
                            this.themeOption.layerStyle.outlineOpacity
                        );
                    }
                }
            }
            if (layers) {
                layer.paint = Object.assign(layer.paint, layers.themeLayer.paint);
                layer.layout = Object.assign(layer.layout, layers.themeLayer.layout);
            }
            if (paintRadius) {
                layer.paint[this.dataType + "-radius"] = paintRadius;
            }
            if (outlineWidth && this.dataType === "circle") {
                layer.paint["circle-stroke-width"] = outlineWidth;
            }
            if (outlineColor && this.dataType === "circle") {
                layer.paint["circle-stroke-color"] = outlineColor;
            }
            if (outlineOpacity) {
                layer.paint["circle-stroke-opacity"] = outlineOpacity;
            }
            if (opacity) {
                layer.paint[this.dataType + "-opacity"] = opacity;
            }
            if (layer.paint.hasOwnProperty("icon-translate")) {
                themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-translate", layer.paint["icon-translate"]);
            }
            return layer;
        },
        //添加专题图图层
        $_addUniqueLayer() {
            let paintColors = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-color"
            ), layer;
            let paintRadius = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-radius"
            );
            let outlineWidth = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-stroke-width"
            );
            let outlineColor = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-stroke-color"
            );
            let outlineOpacity = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-stroke-opacity"
            );
            let opacity = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-opacity"
            );
            switch (this.dataType) {
                case "circle":
                    layer = {
                        id: this.layerIdCopy + this.$_getThemeName(),
                        type: "circle",
                        source: this.source_Id, //必须和上面的layerVectorId一致
                        layout: {
                            visibility: "visible"
                        },
                        paint: {
                            "circle-color": paintColors,
                            "circle-opacity": 1,
                            "circle-stroke-opacity": 1,
                            "circle-radius": 6,
                            "circle-stroke-color": "#000000",
                            "circle-stroke-width": 1,
                            "circle-translate": [0, 0]
                        }
                    };
                    break;
                case "line":
                    layer = {
                        id: this.layerIdCopy + this.$_getThemeName(),
                        type: "line",
                        source: this.source_Id,
                        layout: {
                            visibility: "visible"
                        },
                        paint: {
                            "line-color": paintColors,
                            "line-opacity": 1,
                            "line-width": 1
                        }
                    };
                    break;
                case "fill":
                    layer = {
                        id: this.layerIdCopy + this.$_getThemeName(),
                        type: "fill",
                        source: this.source_Id, //必须和上面的layerVectorId一致
                        layout: {
                            visibility: "visible"
                        },
                        paint: {
                            "fill-antialias": true,
                            "fill-color": paintColors,
                            "fill-opacity": 1
                        }
                    };
                    break;
            }
            if (this.source_layer_Id) {
                layer["source-layer"] = this.source_layer_Id;
            }
            let layers;
            if (this.themeOption.layerStyle) {
                layers = formatStyleToLayer(this.themeOption.layerStyle, "unique", this.dataType, layer.id);
                if (this.dataType === "fill") {
                    if (this.themeOption.layerStyle.hasOwnProperty("outlineWidth")) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "line-width",
                            this.themeOption.layerStyle.outlineWidth
                        );
                    }
                    if (this.themeOption.layerStyle.hasOwnProperty("outlineColor")) {
                        themeManager.setExtraData(
                            this.layerIdCopy,
                            this.themeType,
                            "line-color",
                            this.themeOption.layerStyle.outlineColor
                        );
                    }
                }
            }
            if (!this.map.getLayer(this.layerIdCopy + this.$_getThemeName())) {
                if (layers) {
                    layer.paint = Object.assign(layer.paint, layers.themeLayer.paint);
                    layer.layout = Object.assign(layer.layout, layers.themeLayer.layout);
                }
                if (paintRadius) {
                    layer.paint[this.dataType + "-radius"] = paintRadius;
                }
                if (outlineWidth && this.dataType === "circle") {
                    layer.paint["circle-stroke-width"] = outlineWidth;
                }
                if (outlineColor && this.dataType === "circle") {
                    layer.paint["circle-stroke-color"] = outlineColor;
                }
                if (outlineOpacity && this.dataType === "circle") {
                    layer.paint["circle-stroke-opacity"] = outlineOpacity;
                }
                if (opacity) {
                    layer.paint[this.dataType + "-opacity"] = opacity;
                }
                this.map.addLayer(layer, this.upLayer);
                this.$_addExtraLayer();
                themeManager.setLayerProps(
                    this.layerIdCopy,
                    this.layerIdCopy + this.$_getThemeName(),
                    layer
                );
            }
        },
        $_addRangeLayer() {
            let paintColors = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-color"
            );
            let layer;
            switch (this.dataType) {
                case "circle":
                    layer = {
                        id: this.layerIdCopy + "_分段专题图",
                        type: "circle",
                        source: this.source_Id, //必须和上面的layerVectorId一致
                        layout: {
                            visibility: "visible"
                        },
                        paint: {
                            "circle-color": paintColors,
                            "circle-opacity": 1,
                            "circle-stroke-opacity": 1,
                            "circle-radius": 6,
                            "circle-stroke-color": "#000000",
                            "circle-stroke-width": 1,
                            "circle-translate": [0, 0]
                        }
                    };
                    break;
                case "line":
                    layer = {
                        id: this.layerIdCopy + "_分段专题图",
                        type: "line",
                        source: this.source_Id,
                        layout: {
                            visibility: "visible"
                        },
                        paint: {
                            "line-color": paintColors,
                            "line-opacity": 1,
                            "line-width": 1
                        }
                    };
                    break;
                case "fill":
                    layer = {
                        id: this.layerIdCopy + "_分段专题图",
                        type: "fill",
                        source: this.source_Id, //必须和上面的layerVectorId一致
                        layout: {
                            visibility: "visible"
                        },
                        paint: {
                            "fill-antialias": true,
                            "fill-color": paintColors,
                            "fill-opacity": 1
                        }
                    };
                    break;
            }
            //当有style参数时，应用参数
            layer = this.$_editLayerByStyle(layer);
            if (this.source_layer_Id) {
                layer["source-layer"] = this.source_layer_Id;
            }
            if (!this.map.getLayer(this.layerIdCopy + "_分段专题图")) {
                this.map.addLayer(layer, this.upLayer);
                this.$_addExtraLayer();
                themeManager.setLayerProps(
                    this.layerIdCopy,
                    this.layerIdCopy + "_分段专题图",
                    layer
                );
            }
        },
        $_getIconSizeByRadius(dataSource, radius) {
            let iconSize;
            if (dataSource.length > 0) {
                //这里规则仅支持小于，大于的话全会背第一个大鱼号的规则覆盖
                iconSize = ["case"];
                iconSize.push(["<", ["to-number", ["get", this.selectValue]], Number(this.startData)]);
                iconSize.push(0.1);
                for (let i = 0; i < dataSource.length; i++) {
                    iconSize.push(["<=", ["to-number", ["get", this.selectValue]], Number(dataSource[i])]);
                    iconSize.push(radius[i] / 10);
                }
                iconSize.push(0.1);
            } else {
                iconSize = 0.1;
            }
            return iconSize;
        },
        $_getIconSize(dataSource) {
            let iconSize;
            if (dataSource.length > 0) {
                //这里规则仅支持小于，大于的话全会背第一个大鱼号的规则覆盖
                iconSize = ["case"];
                iconSize.push(["<", ["to-number", ["get", this.selectValue]], Number(this.startData)]);
                iconSize.push(0.1);
                for (let i = 0; i < dataSource.length; i++) {
                    iconSize.push(["<=", ["to-number", ["get", this.selectValue]], Number(dataSource[i])]);
                    iconSize.push((i + 2) / 10);
                }
                iconSize.push(0.1);
            } else {
                iconSize = 0.1;
            }
            return iconSize;
        },
        //添加等级符号专题图图层
        $_addSymbolLayer(dataSource) {
            let vm = this, iconName;
            let img = new Image(128, 128);
            const {layerStyle} = this.themeOption;
            if (layerStyle.symbol) {
                vm.defaultIcon = layerStyle.symbol;
            }
            if (vm.defaultIcon === "useDefault") {
                iconName = "useDefault";
            } else {
                let iconFullName = vm.defaultIcon.split("/")[vm.defaultIcon.split("/").length - 1];
                iconName = iconFullName.split(".")[0];
            }
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-image", iconName);
            img.addEventListener("load", function () {
                let hasIcon = vm.map.hasImage(iconName), iconSize;
                if (!hasIcon) {
                    vm.map.addImage(iconName, img);
                }
                iconSize = vm.$_getIconSize(dataSource);
                //存储iconSize
                themeManager.vueId = vm.vueId;
                themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "icon-size", iconSize);
                if (vm.map.hasImage(iconName)) {
                    let layer = {
                        'id': vm.layerIdCopy + "_符号专题图",
                        'source': vm.source_Id,
                        'type': 'symbol',
                        'layout': {
                            'icon-image': iconName,
                            'icon-size': iconSize,
                            "text-field": '',
                            'text-size': 11,
                            'text-letter-spacing': 0,
                            'text-offset': [0, 0],
                            'text-font': ["宋体", "宋体"],
                            'text-rotate': 0,
                            'visibility': 'visible'
                        },
                        'paint': {
                            'icon-opacity': 1,
                            'text-color': '#000000',
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 0
                        }
                    };
                    layer = vm.$_editLayerByStyle(layer);
                    layer.layout["icon-image"] = iconName;
                    if (typeof layer.layout["icon-size"] === 'number') {
                        layer.layout["icon-size"] = layer.layout["icon-size"] / 10;
                    }
                    let newIconSize;
                    if (vm.themeOption.styleGroups && vm.themeOption.styleGroups.length > 0) {
                        newIconSize = vm.$_getIconSize(dataSource);
                        let size = 0.1 || vm.themeOption.layerStyle.symbolSize;
                        for (let i = 2; i < newIconSize.length; i += 2) {
                            newIconSize[i] = size;
                        }
                    }
                    if (vm.source_layer_Id) {
                        layer["source-layer"] = vm.source_layer_Id;
                    }
                    if (!vm.map.getLayer(vm.layerIdCopy + "_符号专题图")) {
                        vm.map.addLayer(layer, vm.upLayer);
                        vm.$_setLayerOrder([vm.layerIdCopy + "_符号专题图"]);
                        themeManager.setLayerProps(
                            vm.layerIdCopy,
                            vm.layerIdCopy + "_符号专题图",
                            layer
                        );
                    }
                }
            });
            if (vm.defaultIcon === "useDefault") {
                img.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjI5OTcyNzU0MDMwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyMzQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEwLjY5MTE5MSA2NC41Njc1NTFjLTI0Ni41NDgyMzIgMC00NDcuMTI1NDU3IDIwMC41NzgyNDgtNDQ3LjEyNTQ1NyA0NDcuMTI1NDU3IDAgMjQ2LjU0MzExNiAyMDAuNTc4MjQ4IDQ0Ny4xMjU0NTcgNDQ3LjEyNTQ1NyA0NDcuMTI1NDU3IDI0Ni41NDMxMTYgMCA0NDcuMTI1NDU3LTIwMC41ODIzNDEgNDQ3LjEyNTQ1Ny00NDcuMTI1NDU3Qzk1Ny44MTY2NDggMjY1LjE0NDc3NiA3NTcuMjM0MzA3IDY0LjU2NzU1MSA1MTAuNjkxMTkxIDY0LjU2NzU1MXpNNTEwLjY5MTE5MSA4NjMuNDg5MzA2Yy0xOTMuOTgyMDE2IDAtMzUxLjc5NjI5OC0xNTcuODE0MjgyLTM1MS43OTYyOTgtMzUxLjc5NjI5OHMxNTcuODE0MjgyLTM1MS43OTYyOTggMzUxLjc5NjI5OC0zNTEuNzk2Mjk4Uzg2Mi40ODc0ODkgMzE3LjcxMDk5MiA4NjIuNDg3NDg5IDUxMS42OTMwMDggNzA0LjY3MzIwOCA4NjMuNDg5MzA2IDUxMC42OTExOTEgODYzLjQ4OTMwNnoiIHAtaWQ9IjIyMzUiIGZpbGw9IiMxMjk2ZGIiPjwvcGF0aD48cGF0aCBkPSJNNTEwLjY5MTE5MSA1MTEuNjkzMDA4bS0yMTQuNDkxMTE5IDBhMjA5LjYwNiAyMDkuNjA2IDAgMSAwIDQyOC45ODIyMzggMCAyMDkuNjA2IDIwOS42MDYgMCAxIDAtNDI4Ljk4MjIzOCAwWiIgcC1pZD0iMjIzNiIgZmlsbD0iIzEyOTZkYiI+PC9wYXRoPjwvc3ZnPg==";
            } else {
                img.src = vm.defaultIcon;
            }
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-url", vm.defaultIcon);
        },
        //添加额外图层
        $_addExtraLayer() {
            let layerOrder = [this.layerIdCopy + this.$_getThemeName()];
            if (this.dataType === "fill") {
                this.$_addLineLayer();
                layerOrder.push(this.layerIdCopy + this.$_getThemeName() + "_线");
            }
            layerOrder.push(this.layerIdCopy + this.$_getThemeName() + "_注记");
            this.$_setLayerOrder(layerOrder);
            this.$_addTextLayer();
        },
        //添加注记图层
        $_addTextLayer() {
            let textLayer = {
                id: this.layerIdCopy + this.$_getThemeName() + "_注记",
                source: this.source_Id,
                type: "symbol",
                layout: {
                    "text-field": "",
                    "text-size": 12,
                    "text-letter-spacing": 0.05,
                    "text-offset": [0, 0],
                    "text-font": ["宋体", "宋体"],
                    "text-rotate": 0
                },
                paint: {
                    "text-color": "#000000",
                    "text-halo-color": "#000000",
                    "text-halo-width": 0
                }
            };
            let textStyle = this.themeOption.textStyle || {};
            const {enableTurf, enableIgs, baseUrl} = textStyle;
            let vm = this;
            if (this.source_layer_Id) {
                textLayer["source-layer"] = this.source_layer_Id;
            }
            if (this.dataType === "line") {
                textLayer.layout["symbol-placement"] = "line";
            }
            if (textStyle) {
                let newTextLayer = getLayerFromTextStyle(textStyle);
                textLayer = Object.assign(textLayer, newTextLayer);
            }
            if (enableIgs && baseUrl && this.dataType === "fill") {
                const {features} = this.dataSource;
                let featureLength = features.length;
                let textGeojson = {
                    "type": "FeatureCollection",
                    "features": []
                }
                let geometryStr = "";
                for (let i = 0; i < features.length; i++) {
                    if (features[i].geometry.type === "MultiPolygon") {
                        geometryStr = features[i].geometry.coordinates[0][0].toString();
                    } else {
                        geometryStr = features[i].geometry.coordinates[0].toString();
                    }
                    let url = baseUrl + "/igs/rest/mrfs/getLabel?geometryType=polygon&f=json&geometry=" + geometryStr;
                    FeatureService.get(url, function (result, properties) {
                        result = JSON.parse(result);
                        let feature = {
                            "type": "Feature",
                            "properties": properties,
                            "geometry": {
                                "type": "Point",
                                "coordinates": [result.X, result.Y]
                            }
                        }
                        textGeojson.features.push(feature);
                    }, function () {
                    }, features[i].properties);
                }
                let textInterval = setInterval(function () {
                    if (featureLength === textGeojson.features.length) {
                        let textSource = vm.layerIdCopy + "_textGeojson_" + parseInt(String(Math.random() * 10000));
                        vm.map.addSource(textSource, {
                            "type": "geojson",
                            "data": textGeojson
                        });
                        textLayer.source = textSource;
                        if (!vm.map.getLayer(vm.layerIdCopy + vm.$_getThemeName() + "_注记")) {
                            vm.map.addLayer(textLayer, vm.upLayer);
                            themeManager.setLayerProps(
                                vm.layerIdCopy,
                                vm.layerIdCopy + vm.$_getThemeName() + "_注记",
                                textLayer
                            );
                        }
                        clearInterval(textInterval);
                    }
                }, 30);
            } else {
                if (enableTurf && this.dataType === "fill") {
                    const {features} = this.dataSource;
                    let textGeojson = {
                        "type": "FeatureCollection",
                        "features": []
                    }
                    for (let i = 0; i < features.length; i++) {
                        let feature = {
                            "type": "Feature",
                            "properties": features[i].properties,
                            "geometry": {
                                "type": "Point",
                                "coordinates": this.$_getCenter(features[i])
                            }
                        }
                        textGeojson.features.push(feature);
                    }
                    let textSource = vm.layerIdCopy + "_textGeojson_" + parseInt(String(Math.random() * 10000));
                    this.map.addSource(textSource, {
                        "type": "geojson",
                        "data": textGeojson
                    });
                    textLayer.source = textSource;
                }
                if (typeof this.dataSource === "string" && this.dataType === "fill") {
                    textLayer.source = this.igsTextSourceId;
                }
                if (!this.map.getLayer(this.layerIdCopy + this.$_getThemeName() + "_注记")) {
                    this.map.addLayer(textLayer, this.upLayer);
                    themeManager.setLayerProps(
                        this.layerIdCopy,
                        this.layerIdCopy + this.$_getThemeName() + "_注记",
                        textLayer
                    );
                    emitMapAddLayer({
                        layer: textLayer
                    });
                }
            }
        },
        //添加线图层
        $_addLineLayer() {
            //如果有线宽、颜色、透明度则应用参数
            let outlineWidth = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                "line-width"
            );
            let outlineColor = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                "line-color"
            );
            let outlineOpacity = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                "line-opacity"
            );
            let lineLayer = {
                id: this.layerIdCopy + this.$_getThemeName() + "_线",
                source: this.source_Id,
                type: "line",
                paint: {
                    "line-color": "#000000",
                    "line-opacity": 1,
                    "line-width": 1
                },
                layout: {}
            };
            //如果有线宽、颜色、透明度则应用参数
            if (outlineWidth) {
                lineLayer.paint["line-width"] = outlineWidth;
            }
            if (outlineColor) {
                lineLayer.paint["line-color"] = outlineColor;
            }
            if (outlineOpacity) {
                lineLayer.paint["line-opacity"] = outlineOpacity;
            }
            if (this.source_layer_Id) {
                lineLayer["source-layer"] = this.source_layer_Id;
            }
            if (!this.map.getLayer(this.layerIdCopy + this.$_getThemeName() + "_线")) {
                this.map.addLayer(lineLayer, this.upLayer);
                themeManager.setLayerProps(
                    this.layerIdCopy,
                    this.layerIdCopy + this.$_getThemeName() + "_线",
                    lineLayer
                );
                emitMapAddLayer({
                    layer: lineLayer
                });
            }
        },
        //设置图层顺序数组
        $_setLayerOrder(order) {
            //所有的图层顺序数组
            let layerOrder = themeManager.getManagerProps("layerOrder");
            if (!layerOrder) {
                layerOrder = [];
            }
            //单个图层的专题图顺序数组
            let themeOrder = themeManager.getLayerProps(this.layerIdCopy, "layerOrder");
            if (!themeOrder) {
                themeOrder = [this.layerIdCopy];
            }
            themeOrder = themeOrder.concat(order);
            themeManager.setLayerProps(this.layerIdCopy, "layerOrder", themeOrder);
            if (layerOrder.indexOf(this.layerIdCopy) > -1) {
                let layerNameArr = this.$_getOriginLayerName(layerOrder);
                let index = layerNameArr.indexOf(this.layerIdCopy) + 1;
                if (index === layerNameArr.length) {
                    layerOrder = layerOrder.concat(order);
                } else {
                    for (let i = 0; i < order.length; i++) {
                        let newIndex = layerOrder.indexOf(layerNameArr[index]);
                        layerOrder.splice(newIndex, 0, order[i]);
                    }
                }
            } else {
                layerOrder = layerOrder.concat(themeOrder);
            }
            themeManager.setManagerProps("layerOrder", layerOrder);
        },
        /**
         * 根据dataSource取得checkBoxArr
         * @param dataSource 数据源
         * @return checkBoxArr 复选框数据
         * */
        $_setCheckBoxArr(dataSource) {
            let checkBoxArr = [];
            for (let i = 0; i < dataSource.length; i++) {
                checkBoxArr.push(true);
            }
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "checkBoxArr", checkBoxArr);
            return checkBoxArr;
        },
        /**
         * 取得图层的所有绘制信息
         * @param layerId 图层ID
         * @return layer 图层绘制信息
         * */
        $_getLayerStyle(layerId) {
            let layer = {},
                vm = this;
            let originLayer = this.map.getLayer(layerId);
            if (!originLayer) return layer;
            Object.keys(originLayer).forEach(function (key) {
                switch (key) {
                    case "paint":
                        let paint = {};
                        for (let pKey in originLayer.paint._values) {
                            if (
                                originLayer.paint._values.hasOwnProperty(pKey) &&
                                originLayer.paint._values[pKey]
                            ) {
                                try {
                                    paint[pKey] = vm.map.getPaintProperty(layerId, pKey);
                                } catch (e) {
                                }
                            }
                        }
                        layer[key] = paint;
                        break;
                    case "layout":
                        let layout = {};
                        for (let lKey in originLayer.layout._values) {
                            if (
                                originLayer.layout._values.hasOwnProperty(lKey) &&
                                originLayer.layout._values[lKey]
                            ) {
                                try {
                                    layout[lKey] = vm.map.getLayoutProperty(layerId, lKey);
                                } catch (e) {
                                }
                            }
                        }
                        layer[key] = layout;
                        break;
                    default:
                        if (originLayer[key] && !(originLayer[key] instanceof Function) && key.indexOf("_") < 0) {
                            layer[key] = originLayer[key];
                        }
                        break;
                }
            });
            return layer;
        },
        /**
         * 设置绘制属性，并保存
         * @param layerId 源图层id
         * @param themeId 专题图id
         * @param key 属性名
         * @param value 属性值
         * @param managerEdit 处理数据函数
         * @param mapboxEdit 处理数据函数
         * */
        $_setPaintProperty(layerId, themeId, key, value, managerEdit, mapboxEdit) {
            let managerValue;
            if (managerEdit) {
                managerValue = managerEdit(value);
            } else {
                managerValue = value;
            }
            themeManager.setPanelProps(layerId, this.themeType, key, managerValue);
            let mapboxValue;
            if (mapboxEdit) {
                mapboxValue = mapboxEdit(value);
            } else {
                mapboxValue = value;
            }
            themeManager.setLayerPaintProperty(layerId, themeId, key, mapboxValue);
            this.map.setPaintProperty(themeId, key, mapboxValue);
        },
        $_setPaintPropertyToExtra(layerId, themeId, key, value, managerEdit, mapboxEdit) {
            let managerValue;
            if (managerEdit) {
                managerValue = managerEdit(value);
            } else {
                managerValue = value;
            }
            themeManager.setExtraData(layerId, this.themeType, key, managerValue);
            let mapboxValue;
            if (mapboxEdit) {
                mapboxValue = mapboxEdit(value);
            } else {
                mapboxValue = value;
            }
            themeManager.setLayerPaintProperty(layerId, themeId, key, mapboxValue);
            this.map.setPaintProperty(themeId, key, mapboxValue);
        },
        /**
         * 设置布局属性，并保存
         * @param layerId 图层id
         * @param themeId 专题图id
         * @param key 属性名
         * @param value 属性值
         * @param managerEdit 处理数据函数
         * @param mapboxEdit 处理数据函数
         * */
        $_setLayOutProperty(layerId, themeId, key, value, managerEdit, mapboxEdit) {
            let managerValue;
            if (managerEdit) {
                managerValue = managerEdit(value);
            } else {
                managerValue = value;
            }
            if (key !== "visibility") {
                themeManager.setPanelProps(layerId, this.themeType, key, managerValue);
            }
            let mapboxValue;
            if (mapboxEdit) {
                mapboxValue = mapboxEdit(value);
            } else {
                mapboxValue = value;
            }
            themeManager.setLayerLayoutProperty(layerId, themeId, key, mapboxValue);
            this.map.setLayoutProperty(themeId, key, mapboxValue);
        },
        $_setLayOutPropertyToExtra(layerId, themeId, key, value, managerEdit, mapboxEdit) {
            let managerValue;
            if (managerEdit) {
                managerValue = managerEdit(value);
            } else {
                managerValue = value;
            }
            themeManager.setExtraData(layerId, this.themeType, key, managerValue);
            let mapboxValue;
            if (mapboxEdit) {
                mapboxValue = mapboxEdit(value);
            } else {
                mapboxValue = value;
            }
            themeManager.setLayerLayoutProperty(layerId, themeId, key, mapboxValue);
            this.map.setLayoutProperty(themeId, key, mapboxValue);
        },
        /**
         * 取得专题图名称
         * @param themeType 专题图类型，如果没有就用vue上的
         * @return theme 专题图名称
         * */
        $_getThemeName(themeType) {
            themeType = themeType || this.themeType;
            let theme = "";
            switch (themeType) {
                case "uniform":
                    theme = "_统一专题图";
                    break;
                case "unique":
                    theme = "_单值专题图";
                    break;
                case "range":
                    theme = "_分段专题图";
                    break;
                case "symbol":
                    theme = "_符号专题图";
                    break;
                case "heatmap":
                    theme = "_热力专题图";
                    break;
            }
            return theme;
        },
        //专题图变化
        $_themeTypeChanged(themeType) {
            //隐藏上一个专题图
            this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "visibility", "none");
            if (this.themeType !== "symbol" && this.themeType !== "heatmap") {
                this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_注记", "visibility", "none");
            }
            if (this.dataType === "fill") {
                this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_线", "visibility", "none");
            }
            this.themeType = themeType;
            //取得选中字段
            let selectValue = themeManager.getSelectField(this.layerIdCopy, this.themeType);
            //面板参数
            let props = themeManager.getPanelByField(this.layerIdCopy, this.themeType, selectValue), vm = this;
            if (selectValue) {
                this.selectValue = selectValue;
            }
            if (!props) {
                //取得数据
                this.$_getDataByLayer(this.layerIdCopy, function (features) {
                    //绑定数据
                    let fields, dataSource, checkBoxAr;
                    switch (themeType) {
                        case "uniform":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "fields");
                            vm.selectValue = fields[0];
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "unique");
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            //覆盖渐变颜色
                            vm.currentGradient = "#EE4C5A";
                            vm.$_setUniformColors(vm.currentGradient, vm.dataSourceCopy, vm.selectValue);
                            //可以复用单值专题图
                            vm.$_addUniqueLayer();
                            break;
                        case "unique":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "fields");
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "unique");
                            checkBoxAr = vm.$_setCheckBoxArr(dataSource);
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            vm.$refs.themePanel.$_setCheckBoxArr(checkBoxAr);
                            vm.$_setUniqueColors(gradients[0].key, vm.dataSourceCopy, vm.selectValue);
                            vm.$refs.themePanel.$_setColors(vm.colors);
                            vm.$_addUniqueLayer();
                            break;
                        case "range":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            vm.selectValue = fields[0];
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            vm.rangeLevel = gradients[0].key.split(",").length;
                            themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "rangeLevel", vm.rangeLevel);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "range");
                            checkBoxAr = vm.$_setCheckBoxArr(dataSource);
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            vm.$refs.themePanel.$_setCheckBoxArr(checkBoxAr);
                            vm.$refs.themePanel.rangeLevel = vm.rangeLevel;
                            vm.currentGradient = gradients[0].key;
                            vm.$_setRangeColors(gradients[0].key, vm.dataSourceCopy, vm.selectValue, features);
                            vm.$refs.themePanel.$_setColors(vm.colors);
                            vm.$_addRangeLayer();
                            break;
                        case "symbol":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            vm.selectValue = fields[0];
                            themeManager.field = vm.selectValue;
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                fields[0]
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, vm.selectValue, "range");
                            vm.$refs.themePanel.$_setIcons(vm.icons);
                            vm.$refs.themePanel.$_setDefaultIcon(vm.defaultIcon);
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            let radiusArr = [], radiusArrCopy = [];
                            for (let i = 0; i < dataSource.length; i++) {
                                radiusArr.push(i + 1);
                            }
                            themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "radiusArr", radiusArr);
                            vm.$refs.themePanel.$_setRadiusArr(radiusArr);
                            vm.$_addSymbolLayer(dataSource);
                            break;
                        case "heatmap":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            vm.selectValue = this.field || fields[0];
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                vm.selectValue
                            );
                            themeManager.initExtraData(vm.layerIdCopy, vm.themeType, vm.selectValue);
                            dataSource = vm.$_setDataSource(features, fields[0], "unique");
                            vm.$_addHeatmapLayer(dataSource);
                            break;
                    }
                    //保存选中字段
                    themeManager.setSelectField(vm.layerIdCopy, vm.themeType, vm.selectValue);
                    //设置面板参数
                    let textFields = themeManager.getLayerProps(vm.layerIdCopy, "fields");
                    vm.$refs.themePanel.$_setFields(fields);
                    vm.$refs.themePanel.$_setLabelFields(["未设置"].concat(textFields));
                    vm.$refs.themePanel.$_setField(fields[0]);
                    vm.$refs.themePanel.$_setDataType(vm.dataType);
                    vm.$refs.themePanel.$_reset();
                });
            } else {
                //设置管理器字段
                themeManager.field = vm.selectValue;
                let pattern = themeManager.getPanelProps(this.layerIdCopy, this.themeType, this.dataType + "-pattern");
                let patternUrl = themeManager.getPanelProps(this.layerIdCopy, this.themeType, this.dataType + "-pattern-url");
                if (pattern && !this.map.hasImage(pattern)) {
                    let img = new Image(16, 16);
                    img.addEventListener("load", function () {
                        vm.map.addImage(pattern, img);
                        //显示已存在的专题图
                        vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "visibility", "visible");
                        if (vm.themeType !== "symbol" && vm.themeType !== "heatmap") {
                            vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName() + "_注记", "visibility", "visible");
                        }
                        if (vm.dataType === "fill") {
                            vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName() + "_线", "visibility", "visible");
                        }
                    });
                    img.src = patternUrl;
                } else {
                    //显示已存在的专题图
                    this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "visibility", "visible");
                    if (this.themeType !== "symbol" && this.themeType !== "heatmap") {
                        this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_注记", "visibility", "visible");
                    }
                    if (this.dataType === "fill") {
                        this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_线", "visibility", "visible");
                    }
                }
                //还原设置面板参数
                let fields, dataSource;
                if (this.themeType === "unique" || this.themeType === "uniform") {
                    fields = themeManager.getLayerProps(this.layerIdCopy, "fields");
                } else {
                    fields = themeManager.getLayerProps(this.layerIdCopy, "numberFields");
                }
                if (this.themeType !== "heatmap") {
                    dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
                    this.$refs.themePanel.$_setDataSoure(dataSource);
                }
                this.$refs.themePanel.$_setPanel(props, this.selectValue, fields);
            }
            //保存专题图类型
            themeManager.setLayerProps(vm.layerIdCopy, "themeType", themeType);
            //抛出更新图例事件
            let legends = vm.$_getLegend(vm.layerIdCopy);
            vm.$emit("updateLegend", legends);
        },
        //字段变化
        $_fieldChanged(field) {
            //保存选中字段
            themeManager.setSelectField(this.layerIdCopy, this.themeType, field);
            //面板参数
            let props = themeManager.getPanelByField(this.layerIdCopy, this.themeType, field), vm = this;
            //设定选择字段
            this.selectValue = field;
            //专题图颜色
            let paintColor;
            //不存在面板参数，新增
            if (!props) {
                this.$refs.themePanel.$_reset();
                //初始化面板参数
                themeManager.initThemeProps(this.layerIdCopy, this.themeType, this.dataType, field);
                //初始化额外数据
                themeManager.initExtraData(this.layerIdCopy, this.themeType, field);
                //取得数据
                this.$_getDataByLayer(this.layerIdCopy, function (features) {
                    let dataSource;
                    switch (vm.themeType) {
                        case "uniform":
                            //重新取得数据
                            dataSource = vm.$_setDataSource(features, field, "unique");
                            //设置专题图颜色
                            vm.currentGradient = "#EE4C5A";
                            paintColor = vm.$_setUniformColors(vm.currentGradient, dataSource, field);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-color", paintColor);
                            break;
                        case "unique":
                            //重新取得数据
                            dataSource = vm.$_setDataSource(features, field, "unique");
                            //设置专题图颜色
                            vm.currentGradient = gradients[0].key;
                            paintColor = vm.$_setUniqueColors(vm.currentGradient, dataSource, field);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-color", paintColor);
                            break;
                        case "range":
                            //设置分段等级
                            vm.currentGradient = gradients[0].key;
                            let rangeLevel = vm.currentGradient.split(",").length;
                            themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "rangeLevel", rangeLevel);
                            vm.rangeLevel = rangeLevel;
                            //重新取得数据
                            dataSource = vm.$_setDataSource(features, field, "range");
                            //设置专题图颜色
                            paintColor = vm.$_setRangeColors(vm.currentGradient, dataSource, field, features);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-color", paintColor);
                            break;
                        case "symbol":
                            //重新取得数据
                            dataSource = vm.$_setDataSource(features, field, "range");
                            let iconSize = vm.$_getIconSize(dataSource);
                            vm.$_setLayOutPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "icon-size", iconSize);
                            vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "icon-image", "basic");
                            vm.$refs.themePanel.$_resetIcon(vm.defaultIcon);
                            themeManager.setPanelProps(vm.layerIdCopy, vm.themeType, "icon-image", "basic");
                            themeManager.setPanelProps(vm.layerIdCopy, vm.themeType, "icon-url", vm.defaultIcon);
                            let radiusArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                            themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "radiusArr", radiusArr);
                            break;
                        case "heatmap":
                            //重新取得数据
                            dataSource = vm.$_setDataSource(features, field, "unique");
                            //权重不会影响效果，仅会影响点的数量
                            let heatmapWeight = vm.$_getWeightArr(dataSource);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-weight", heatmapWeight);
                            //颜色仅需平均分配，但是初始颜色要是浅色系，颜色从浅到深
                            vm.currentGradient = gradientHeatColor[0].key;
                            let heatmapColor = vm.$_getHeatmapColors(vm.currentGradient);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-color", heatmapColor);
                            //半径比较重要，半径越大相对的渐变效果越宽，通视设置不同的缩放等级，会有模糊效果
                            let heatmapRadius = vm.$_getHeatmapRadius(40);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-radius", heatmapRadius);
                            break;
                    }
                    if (vm.themeType !== "uniform" && vm.themeType !== "heatmap") {
                        //设置面板的分段值
                        vm.$refs.themePanel.$_setDataSoure(dataSource);
                        if (vm.themeType !== "symbol") {
                            //设置面板的分段颜色
                            vm.$refs.themePanel.$_setColors(vm.colors);
                            //设置checkBoxArr
                            vm.$refs.themePanel.$_setCheckBoxArr(vm.checkBoxArr);
                        }
                    }
                    //取得初始化的面板参数
                    props = themeManager.getPanelByField(vm.layerIdCopy, vm.themeType, field);
                    //循环重置专题图
                    vm.$_setPropertyByPanel(props);
                    //抛出更新图例事件
                    let legends = vm.$_getLegend(vm.layerIdCopy);
                    vm.$emit("updateLegend", legends);
                });
            } else {
                //根据已存在的面板参数重置面板
                let fields;
                if (this.themeType === "uniform" || this.themeType === "unique") {
                    fields = themeManager.getLayerProps(this.layerIdCopy, "fields");
                } else {
                    fields = themeManager.getLayerProps(this.layerIdCopy, "numberFields");
                }
                this.$refs.themePanel.$_setPanel(props, field, fields);
                //重置管理器字段名
                themeManager.field = field;
                //如果有填充图案，则设置填充图案
                let hasPatternUrl = false;
                if (this.dataType === "fill" || this.dataType === "line") {
                    let patternUrl = themeManager.getPanelProps(this.layerIdCopy, this.themeType, this.dataType + "-pattern-url");
                    if (patternUrl) {
                        hasPatternUrl = true;
                        this.$refs.themePanel.$_setPattern(patternUrl);
                    }
                }
                //没有分段值，因此不取数据
                if (this.themeType === "uniform") {
                    if (!hasPatternUrl) {
                        //设置专题图颜色
                        paintColor = themeManager.getExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color");
                        this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColor);
                    }
                    //循环重置专题图，不重置标签
                    this.$_setPropertyByPanel(props);
                } else if (this.themeType === "symbol") {
                    //取得数据
                    this.$_getDataByLayer(this.layerIdCopy, function (features) {
                        let iconSize = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, "icon-size");
                        vm.$_setLayOutPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "icon-size", iconSize);
                        //重新取得数据
                        let dataSource = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, "dataSource");
                        vm.$refs.themePanel.$_setDataSoure(dataSource);
                        //设置radiusIndex值
                        let radiusIndex = themeManager.getPanelProps(vm.layerIdCopy, vm.themeType, "radiusIndex");
                        vm.$refs.themePanel.radiusIndex = radiusIndex;
                        //循环重置专题图
                        vm.$_setPropertyByPanel(props);
                        let iconUrl = themeManager.getPanelProps(vm.layerIdCopy, vm.themeType, "icon-url");
                        vm.$refs.themePanel.$_resetIcon(iconUrl);
                    });
                } else if (this.themeType === "heatmap") {
                    let opacity = props["heatmap-opacity"] / 100;
                    vm.map.setPaintProperty(vm.layerIdCopy + vm.$_getThemeName(), "heatmap-opacity", opacity);
                    themeManager.setLayerPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-opacity", opacity);
                    let heatmapWeight = themeManager.getExtraData(this.layerIdCopy, this.themeType, "heatmap-weight");
                    vm.map.setPaintProperty(vm.layerIdCopy + vm.$_getThemeName(), "heatmap-weight", heatmapWeight);
                    themeManager.setLayerPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-weight", heatmapWeight);
                    let heatmapColor = themeManager.getExtraData(this.layerIdCopy, this.themeType, "heatmap-color");
                    vm.map.setPaintProperty(vm.layerIdCopy + vm.$_getThemeName(), "heatmap-color", heatmapColor);
                    themeManager.setLayerPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-color", heatmapColor);
                    let heatmapRadius = themeManager.getExtraData(this.layerIdCopy, this.themeType, "heatmap-radius");
                    vm.map.setPaintProperty(vm.layerIdCopy + vm.$_getThemeName(), "heatmap-radius", heatmapRadius);
                    themeManager.setLayerPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "heatmap-radius", heatmapRadius);
                } else {
                    //取得数据
                    let dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
                    //设置面板的分段值
                    this.$refs.themePanel.$_setDataSoure(dataSource);
                    if (!hasPatternUrl) {
                        //设置专题图颜色
                        paintColor = themeManager.getExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color");
                        this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColor);
                    }
                    //循环重置专题图
                    this.$_setPropertyByPanel(props);
                }
                //抛出更新图例事件
                let legends = this.$_getLegend(this.layerIdCopy);
                this.$emit("updateLegend", legends);
            }
        },
        $_setPropertyByPanel(props) {
            let vm = this;
            switch (this.dataType) {
                case "fill":
                    Object.keys(props).forEach(function (key) {
                        let value = props[key];
                        //处理多边形
                        if (props.hasOwnProperty(key) && key.indexOf("fill-") > -1 && key.indexOf("fill-outline-") < 0 && key !== vm.dataType + "-color" && key !== "fill-pattern-url") {
                            //处理线偏移
                            if (key === "fill-translate") {
                                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName() + "_线", "line-translate", [Number(value[0]), Number(value[1]) * -1]);
                                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, [Number(value[0]), Number(value[1]) * -1]);
                            } else if (key === "fill-opacity") {
                                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, value, function (value) {
                                    return value;
                                }, function (value) {
                                    return value / 100;
                                });
                            } else if (key === "fill-pattern" && value) {
                                if (vm.map.hasImage(value)) {
                                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, value);
                                } else {
                                    let img = new Image(16, 16);
                                    let fillPatternUrl = themeManager.getPanelProps(vm.layerIdCopy, vm.themeType, "fill-pattern-url");
                                    img.addEventListener("load", function () {
                                        vm.map.addImage(value, img);
                                        vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, value);
                                    });
                                    img.src = fillPatternUrl;
                                }
                            } else {
                                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, value);
                            }
                        }
                        //处理线
                        if (props.hasOwnProperty(key) && key.indexOf("fill-outline-") > -1) {
                            //转换名称，去掉fill-out
                            let newKey = key.split("fill-out")[1];
                            let value = props[key];
                            if (newKey === "line-opacity") {
                                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName() + "_线", newKey, value, function (value) {
                                    return value;
                                }, function (value) {
                                    return value / 100;
                                });
                            } else {
                                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName() + "_线", newKey, value);
                            }
                        }
                        if (key.indexOf("text-") > -1) {
                            vm.$_setLayoutByKey(key, value, "_注记");
                        }
                    });
                    break;
                default:
                    if (vm.themeType === "symbol") {
                        Object.keys(props).forEach(function (key) {
                            if (props.hasOwnProperty(key) && key !== "icon-url" && (key.indexOf("text-") > -1 || key.indexOf("icon-") > -1)) {
                                let value = props[key];
                                if (key === "icon-image") {
                                    let iconName = themeManager.getPanelProps(vm.layerIdCopy, vm.themeType, "icon-image");
                                    if (vm.map.hasImage(iconName)) {
                                        vm.$_setLayoutByKey(key, value);
                                    } else {
                                        let img = new Image(128, 128);
                                        img.addEventListener("load", function () {
                                            vm.map.addImage(iconName, img);
                                            vm.$_setLayoutByKey(key, value);
                                        });
                                        img.src = themeManager.getPanelProps(vm.layerIdCopy, vm.themeType, "icon-url");
                                    }
                                } else {
                                    vm.$_setLayoutByKey(key, value);
                                }
                            }
                        });
                    } else if (vm.themeType === "heatmap") {
                        Object.keys(props).forEach(function (key) {
                            //处理热力图
                            vm.map.setPaintProperty(vm.layerIdCopy + vm.$_getThemeName(), "heatmap-opacity", 1);
                        });
                    } else {
                        Object.keys(props).forEach(function (key) {
                            let value = props[key];
                            //处理点或线
                            if (props.hasOwnProperty(key) && key.indexOf(vm.dataType + "-") > -1 && key !== vm.dataType + "-color") {
                                //处理偏移
                                if (key === vm.dataType + "-translate") {
                                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, [Number(value[0]), Number(value[1]) * -1]);
                                } else if (key === vm.dataType + "-opacity" || key === "circle-stroke-opacity") {
                                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, value, function (value) {
                                        return value;
                                    }, function (value) {
                                        return value / 100;
                                    });
                                } else {
                                    vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), key, value);
                                }
                            }
                            if (key.indexOf("text-") > -1) {
                                vm.$_setLayoutByKey(key, value, "_注记");
                            }
                        });
                    }
                    break;
            }
        },
        $_setLayoutByKey(key, value, extraName) {
            extraName = extraName || "";
            if (value !== "" && value !== undefined && value !== null) {
                //以下这些是paint参数
                if (key === "text-color" || key === "text-halo-color" || key === "text-halo-width" || key === "icon-opacity" || key === "icon-translate") {
                    if (key === "icon-translate") {
                        this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + extraName, key, [Number(value[0]), Number(value[1]) * -1]);
                    } else if (key === "icon-opacity") {
                        this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + extraName, key, value, function (value) {
                            return value;
                        }, function (value) {
                            return value / 100;
                        });
                    } else {
                        this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + extraName, key, value);
                    }
                } else {
                    //以下这些是layout参数
                    //如果是text-font，则要拼成数组["宋体","宋体"]
                    if (key === "text-font") {
                        if (value instanceof Array) {
                            value = value[0];
                        }
                        value = [value, value];
                    }
                    if (key === "text-offset") {
                        value = [Number(value[0]), Number(value[1]) * -1];
                    }
                    this.$_setLayOutProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + extraName, key, value);
                }
            }
        },
        //分段输入变化
        $_rangeInputChanged(index, data) {
            if (this.themeType === "symbol") {
                let radiusArr = themeManager.getExtraData(this.layerIdCopy, this.themeType, "radiusArr");
                this.$set(this.dataSourceCopy, index, Number(data));
                let extraData = [];
                for (let i = 0; i < this.dataSourceCopy.length; i++) {
                    extraData.push(this.dataSourceCopy[i]);
                }
                themeManager.setExtraData(this.layerIdCopy, this.themeType, "dataSource", extraData);
                this.$_setDataSourceCopyBack();
                this.$_setIconSize(this.dataSourceCopy, radiusArr);
            } else {
                let dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
                let colors = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "colors");
                let dataBack = dataSource[index];
                dataSource[index] = Number(data);
                themeManager.setExtraData(this.layerIdCopy, this.themeType, "dataSource", dataSource);
                if (index === 0) {
                    let startData = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "startData");
                    this.$_setRangeColor(colors[index], Number(startData), dataSource[index]);
                    this.$_setRangeColor(colors[index + 1], dataSource[index], dataSource[index + 1]);
                } else if (index === dataSource.length - 1) {
                    this.$_setRangeColor(colors[index], dataSource[index - 1], dataSource[index]);
                    this.$_setRangeColor("#FFFFFF", dataSource[index], Number(dataBack) + 10);
                } else {
                    this.$_setRangeColor(colors[index], dataSource[index - 1], dataSource[index]);
                    this.$_setRangeColor(colors[index + 1], dataSource[index], dataSource[index + 1]);
                }
            }
        },
        $_startDataChanged(startData) {
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "startData", startData);
        },
        $_addRange(dataSource, arr, index, startData, endData) {
            if (this.themeType === "symbol") {
                this.$_setRadiusArr(arr);
                this.$_setDataSourceCopy(dataSource);
                this.$_setDataSourceCopyBack();
                this.$_setIconSize(dataSource, arr);
            } else {
                let colors = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "colors");
                let newColors;
                if (index < colors.length - 1) {
                    newColors = this.$_gradientColor(colors[index], colors[index + 1], 2);
                } else {
                    newColors = [colors[index], colors[index]];
                }
                colors.splice(index + 1, 0, newColors[1]);
                this.$_setColors(colors, true);
                this.$_setCheckBox(arr);
                this.$_setRangeLevel(1);
                this.$_setRangeColor(newColors[1], startData, endData);
            }
            this.$_setRangeData(dataSource);
            this.$_returnLegend();
        },
        $_setRangeData(dataSource) {
            let newData = [];
            for (let i = 0; i < dataSource.length; i++) {
                newData.push(dataSource[i]);
            }
            themeManager.setExtraData(this.layerIdCopy, this.themeType, "dataSource", newData);
        },
        $_deleteRange(dataSource, arr, index, startData, endData) {
            if (this.themeType === "symbol") {
                this.$_setRadiusArr(arr);
                this.$_setDataSourceCopy(dataSource);
                this.$_setDataSourceCopyBack();
                this.$_setIconSize(dataSource, arr);
            } else {
                let colors = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "colors");
                colors.splice(index, 1);
                this.$_setColors(colors);
                this.$_setCheckBox(arr);
                this.$_setRangeLevel(-1);
                this.$_setRangeColor(colors[index - 1], startData, endData);
            }
            this.$_setRangeData(dataSource);
            this.$_returnLegend();
        },
        $_setRangeLevel(num) {
            let rangeLevel = themeManager.getExtraData(this.layerIdCopy, this.themeType, "rangeLevel");
            rangeLevel += num;
            themeManager.setExtraData(this.layerIdCopy, this.themeType, "rangeLevel", rangeLevel);
        },
        $_setCheckBox(checkBoxArr) {
            let newCheckBoxArr = [];
            for (let i = 0; i < checkBoxArr.length; i++) {
                newCheckBoxArr.push(checkBoxArr[i]);
            }
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "checkBoxArr", newCheckBoxArr);
        },
        $_setColors(colors, setColor) {
            let colorArr = [];
            for (let i = 0; i < colors.length; i++) {
                colorArr.push(colors[i]);
            }
            if (setColor) {
                this.$refs.themePanel.$_setColors(colorArr);
            }
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "colors", colorArr);
        },
        $_setRangeColor(color, startData, endData) {
            let paintColor = themeManager.getExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color");
            let length = (paintColor.length - 1) / 2;
            for (let i = 0; i < length; i++) {
                if (paintColor[2 + i * 2 + 1] >= startData && paintColor[2 + i * 2 + 1] <= endData) {
                    if (i === 0) {
                        paintColor.splice(2, 1, color);
                    }
                    paintColor.splice(2 + (i + 1) * 2, 1, color);
                }
            }
            this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColor);
        },
        $_setIconSize(dataSourceCopy, radiusArr) {
            let iconSize = ["case"];
            iconSize.push(["<", ["to-number", ["get", this.selectValue]], Number(this.startData)]);
            iconSize.push(0.1);
            for (let i = 0; i < dataSourceCopy.length; i++) {
                iconSize.push(["<=", ["to-number", ["get", this.selectValue]], Number(dataSourceCopy[i])]);
                iconSize.push(radiusArr[i] / 10);
            }
            iconSize.push(0.1);
            this.$_setLayOutPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "icon-size", iconSize);
        },
        $_setDataSourceCopy(dataSource) {
            let dataSourceCopy = [];
            for (let i = 0; i < dataSource.length; i++) {
                dataSourceCopy.push(dataSource[i]);
            }
            this.dataSourceCopy = dataSourceCopy;
        },
        $_setRadiusArr(radiusArr) {
            let radius = [];
            for (let i = 0; i < radiusArr.length; i++) {
                radius.push(radiusArr[i]);
            }
            themeManager.setExtraData(this.layerIdCopy, this.themeType, "radiusArr", radius);
        },
        $_setDataSourceCopyBack() {
            let dataSourceCopyBack = [];
            for (let i = 0; i < this.dataSourceCopy.length; i++) {
                dataSourceCopyBack.push(this.dataSourceCopy[i]);
            }
            this.dataSourceCopyBack = dataSourceCopyBack;
        },
        $_setOpacity(opacity) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-opacity", opacity, undefined, function (opacity) {
                return opacity / 100;
            });
        },
        /**
         *圆的透明度变化
         * @param opacity 透明度
         * */
        $_circleOpacityChanged(opacity) {
            this.$_setOpacity(opacity);
        },
        $_iconOpacityChanged(opacity) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "icon-opacity", opacity, undefined, function (opacity) {
                return opacity / 100;
            });
        },
        $_radiusChanged(radiusArr) {
            let vm = this, newRadiusArr = [];
            for (let i = 0; i < radiusArr.length; i++) {
                newRadiusArr.push(radiusArr[i]);
            }
            //先要取得数据
            this.$_getDataByLayer(vm.layerIdCopy, function (features) {
                //重新取得数据
                let dataSource = themeManager.getExtraData(vm.layerIdCopy, vm.themeType, "dataSource");
                let iconSize = ["case"];
                iconSize.push(["<", ["to-number", ["get", vm.selectValue]], Number(vm.startData)]);
                iconSize.push(0.1);
                for (let i = 0; i < dataSource.length; i++) {
                    iconSize.push(["<=", ["to-number", ["get", vm.selectValue]], Number(dataSource[i])]);
                    iconSize.push(radiusArr[i] / 10);
                }
                iconSize.push(0.1);
                themeManager.setExtraData(vm.layerIdCopy, vm.themeType, "radiusArr", newRadiusArr);
                vm.$_setLayOutPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "icon-size", iconSize);
            });
        },
        $_radiusIndexChanged(index) {
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "radiusIndex", index);
        },
        /**
         *线的透明度变化
         * @param opacity 透明度
         * */
        $_lineOpacityChanged(opacity) {
            this.$_setOpacity(opacity);
        },
        $_heatmapOpacityChanged(opacity) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "heatmap-opacity", opacity, undefined, function (opacity) {
                return opacity / 100;
            });
        },
        $_fillOutlineOpacityChanged(opacity) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_线", "line-opacity", opacity, undefined, function (opacity) {
                return opacity / 100;
            });
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "fill-outline-opacity", opacity);
        },
        $_fillOpacityChanged(opacity) {
            this.$_setOpacity(opacity);
        },
        /**
         *圆的半径变化
         * @param radius 半径
         * */
        $_circleRadiusChanged(radius) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "circle-radius", radius);
        },
        $_heatmapRadiusChanged(radius) {
            let heatmapRadius = this.$_getHeatmapRadius(radius);
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "heatmap-radius", radius);
            this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "heatmap-radius", heatmapRadius);
        },
        $_editTranslate(translate, index) {
            let translateArr;
            if (this.themeType === "symbol") {
                translateArr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "icon-translate");
            } else {
                translateArr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, this.dataType + "-translate");
            }
            if (index === 1) {
                return [translateArr[0], -translate];
            } else {
                return [translate, translateArr[1]];
            }
        },
        $_setTranslate(translate, index) {
            let vm = this;
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-translate", translate, function (translate) {
                return vm.$_editTranslate(translate, index);
            }, function (translate) {
                return vm.$_editTranslate(translate, index);
            });
        },
        $_setOutLineTranslate(translate, index) {
            let vm = this;
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_线", "line-translate", translate, function (translate) {
                return vm.$_editTranslate(translate, index);
            }, function (translate) {
                return vm.$_editTranslate(translate, index);
            });
        },
        $_xCircleTranslateChanged(translate) {
            this.$_setTranslate(translate, 0);
        },
        $_iconTranslateXChanged(translate) {
            let vm = this;
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "icon-translate", translate, function (translate) {
                return vm.$_editTranslate(translate, 0);
            }, function (translate) {
                let tArr = vm.$_editTranslate(translate, 0);
                return [tArr[0], tArr[1] * -1];
            });
        },
        $_lineTranslateXChanged(translate) {
            this.$_setTranslate(translate, 0);
        },
        $_fillTranslateXChanged(translate) {
            this.$_setTranslate(translate, 0);
            this.$_setOutLineTranslate(translate, 0);
        },
        $_yCircleTranslateChanged(translate) {
            this.$_setTranslate(translate, 1);
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "circle-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "circle-translate", [Number(arr[0]), Number(arr[1]) * -1]);
        },
        $_iconTranslateYChanged(translate) {
            let vm = this;
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "icon-translate", translate, function (translate) {
                return vm.$_editTranslate(translate, 1);
            }, function (translate) {
                return vm.$_editTranslate(translate, 1);
            });
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "icon-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-translate", [Number(arr[0]), Number(arr[1]) * -1]);
        },
        $_lineTranslateYChanged(translate) {
            this.$_setTranslate(translate, 1);
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "line-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "line-translate", [Number(arr[0]), Number(arr[1]) * -1]);
        },
        $_fillTranslateYChanged(translate) {
            this.$_setTranslate(translate, 1);
            this.$_setOutLineTranslate(translate, 1);
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "fill-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "fill-translate", [Number(arr[0]), Number(arr[1]) * -1]);
        },
        $_circleStrokeColorChanged(color) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "circle-stroke-color", color);
        },
        $_fillOutlineColorChanged(color) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_线", "line-color", color);
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "fill-outline-color", color);
        },
        $_circleStrokeWidthChanged(width) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "circle-stroke-width", width);
        },
        $_lineWidthChanged(width) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "line-width", width);
        },
        $_fillOutlineWidthChanged(width) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName() + "_线", "line-width", width);
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "fill-outline-width", width);
        },
        $_circleStrokeOpacityChanged(opacity) {
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "circle-stroke-opacity", opacity, undefined, function (opacity) {
                return opacity / 100;
            });
        },
        $_getSymbolId() {
            if (this.themeType === "symbol") {
                return this.layerIdCopy + this.$_getThemeName();
            } else {
                return this.layerIdCopy + this.$_getThemeName() + "_注记";
            }
        },
        $_textFieldChanged(field) {
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-field", field, function (field) {
                return "{" + field + "}";
            }, function (field) {
                return "{" + field + "}";
            });
        },
        $_textColorChanged(color) {
            this.$_setPaintProperty(this.layerIdCopy, this.$_getSymbolId(), "text-color", color);
        },
        $_textHaloColorChanged(color) {
            this.$_setPaintProperty(this.layerIdCopy, this.$_getSymbolId(), "text-halo-color", color);
        },
        $_textHaloWidthChanged(width) {
            this.$_setPaintProperty(this.layerIdCopy, this.$_getSymbolId(), "text-halo-width", width);
        },
        $_textFontChanged(font) {
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-font", font, undefined, function (font) {
                return [font, font];
            });
        },
        $_textSizeChanged(size) {
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-size", size);
        },
        $_textOffsetXChanged(offset) {
            let textOffset = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "text-offset");
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-offset", offset, function (offset) {
                return [offset, textOffset[1]];
            }, function (offset) {
                return [offset, textOffset[1]];
            });
        },
        $_textOffsetYChanged(offset) {
            let textOffset = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "text-offset");
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-offset", offset, function (offset) {
                return [textOffset[0], offset];
            }, function (offset) {
                return [textOffset[0], -offset];
            });
        },
        $_textLetterSpacingChanged(padding) {
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-letter-spacing", padding);
        },
        $_textRotateChanged(rotate) {
            this.$_setLayOutProperty(this.layerIdCopy, this.$_getSymbolId(), "text-rotate", rotate);
        },
        $_iconChanged(icon, url) {
            let vm = this;
            let img = new Image(128, 128);
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-image", icon);
            img.addEventListener("load", function () {
                let hasIcon = vm.map.hasImage(icon);
                if (!hasIcon) {
                    vm.map.addImage(icon, img);
                }
                vm.$_setLayOutProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), "icon-image", icon);
                vm.$_returnLegend();
            });
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-url", url);
            img.src = url;
        },
        $_returnLegend() {
            //抛出更新图例事件
            let legends = this.$_getLegend(this.layerIdCopy);
            this.$emit("updateLegend", legends);
        },
        $_wenliIconChanged(icon, url) {
            let img = new Image(16, 16), vm = this;
            img.addEventListener("load", function () {
                let hasIcon = vm.map.hasImage(icon);
                if (!hasIcon) {
                    vm.map.addImage(icon, img);
                }
                vm.$_setPaintProperty(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-pattern", icon);
                themeManager.setPanelProps(vm.layerIdCopy, vm.themeType, vm.dataType + "-pattern-url", url);
                vm.$_returnLegend();
            });
            img.src = url;
        },
        $_colorChanged(index, color) {
            let paintColors = themeManager.getExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color");
            if (paintColors instanceof Array) {
                switch (this.themeType) {
                    case "unique":
                        paintColors[(index + 1) * 2 + 1] = color;
                        this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColors);
                        break;
                    case "range":
                        this.$_setRangeColor(color, this.$_getStartEndData(index).startData, this.$_getStartEndData(index).endData);
                        break;
                }
            } else {
                paintColors.stops[index][1] = color;
                this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColors);
            }
            //更新面板分段颜色
            let colors = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "colors");
            colors[index] = color;
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "colors", colors);
            this.$_returnLegend();
        },
        $_checked(checkBoxArr, index, color) {
            let paintColors = themeManager.getExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color");
            if (paintColors instanceof Array) {
                switch (this.themeType) {
                    case "unique":
                        if (checkBoxArr[index]) {
                            paintColors[(index + 1) * 2 + 1] = color;
                        } else {
                            paintColors[(index + 1) * 2 + 1] = "#FFFFFF";
                        }
                        this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColors);
                        break;
                    case "range":
                        if (!checkBoxArr[index]) {
                            color = "#ffffff";
                        }
                        this.$_setRangeColor(color, this.$_getStartEndData(index).startData, this.$_getStartEndData(index).endData);
                        break;
                }
            } else {
                if (checkBoxArr[index]) {
                    paintColors.stops[index][1] = color;
                } else {
                    paintColors.stops[index][1] = "#FFFFFF";
                }
                this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColors);
            }
            //存储checkBoxArr
            let newCheckBoxArr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "checkBoxArr");
            newCheckBoxArr[index] = checkBoxArr[index];
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "checkBoxArr", newCheckBoxArr);
        },
        $_gradientChanged(color) {
            if (this.dataType === "fill") {
                this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-pattern", undefined);
            }
            let paintColor, vm = this;
            this.currentGradient = color;
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "gradient-color", color);
            switch (this.themeType) {
                case "unique":
                    //切换渐变颜色
                    paintColor = this.$_setUniqueColors(color, this.dataSourceCopy, this.selectValue);
                    this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColor);
                    //设置面板分段颜色
                    this.$refs.themePanel.$_setColors(this.colors);
                    //设置面板分段复选框
                    this.$refs.themePanel.$_setCheckBoxArr(this.checkBoxArr);
                    this.$_returnLegend();
                    break;
                case "range":
                    //先要取得数据
                    this.$_getDataByLayer(vm.layerIdCopy, function (features) {
                        vm.rangeLevel = color.split(",").length;
                        let dataSource = vm.$_setDataSource(features, vm.selectValue, "range");
                        //切换渐变颜色
                        paintColor = vm.$_setRangeColors(color, dataSource, vm.selectValue, features);
                        vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-color", paintColor);
                        //设置面板分段颜色
                        vm.$refs.themePanel.$_setColors(vm.colors);
                        //设置面板分段复选框
                        vm.$refs.themePanel.$_setCheckBoxArr(vm.checkBoxArr);
                        vm.$refs.themePanel.$_setColors(vm.colors);
                        //设置面板数据源
                        vm.$refs.themePanel.$_setDataSoure(dataSource);
                        vm.$_returnLegend();
                    });
                    break;
            }
        },
        $_getStartEndData(index) {
            let dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
            let startData, endData;
            if (index === 0) {
                startData = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "startData");
                endData = dataSource[index];
            } else if (index <= dataSource.length - 1) {
                startData = dataSource[index - 1];
                endData = dataSource[index];
            }
            return {
                startData: Number(startData),
                endData: Number(endData)
            }
        },
        $_uniformColorChanged(color) {
            let paintColors = themeManager.getExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color");
            if (paintColors instanceof Array) {
                for (let i = 3; i < paintColors.length; i += 2) {
                    paintColors[i] = color;
                }
            } else {
                for (let i = 0; i < paintColors.stops.length; i++) {
                    paintColors.stops[i][1] = color;
                }
            }
            themeManager.setExtraData(this.layerIdCopy, this.themeType, this.dataType + "-color", paintColors);
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "uniformColor", color);
            this.map.setPaintProperty(this.layerIdCopy + this.$_getThemeName(), this.dataType + "-color", paintColors);
            this.$_returnLegend();
        },
        $_getWeightArr(dataSource) {
            //过滤非数字值
            let datas = [];
            let regPos = new RegExp(/^\d+(\.\d+)?$/); //非负浮点数
            let regNeg = new RegExp(/^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/); //负浮点数
            for (let i = 0; i < dataSource.length; i++) {
                if (regPos.test(dataSource[i]) || regNeg.test(dataSource[i])) {
                    datas.push(dataSource[i]);
                }
            }
            datas = datas.sort(function (a, b) {
                return a - b;
            });
            let heatmapWeight = [
                "interpolate",
                ["linear"],
                ["get", this.selectValue]
            ];
            if (datas.length === 1) {
                if (Number(datas[0]) === 0) {
                    heatmapWeight.push(0, 0);
                    heatmapWeight.push(0.1, 1);
                } else {
                    heatmapWeight.push(0, 0);
                    heatmapWeight.push(Number(datas[0]), 1);
                }
            } else {
                heatmapWeight.push(Number(datas[0]), 0);
                heatmapWeight.push(Number(datas[datas.length - 1]), 1);
            }
            return heatmapWeight;
        },
        $_getHeatmapColors(gradientHeatColor) {
            let colors = gradientHeatColor.split(",");
            let step = Math.floor((1 / colors.length) * 100) / 100;
            let heatmapColor = [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(33,102,172,0)"
            ];
            for (let i = 0; i < colors.length - 2; i++) {
                heatmapColor.push(step * (i + 1), colors[i]);
            }
            heatmapColor.push(1, colors[colors.length - 1]);
            return heatmapColor;
        },
        $_getHeatmapRadius(radius) {
            return [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, radius,
                9, radius
            ];
        },
        $_addHeatmapLayer(dataSource) {
            themeManager.field = this.selectValue;
            //权重不会影响效果，仅会影响点的数量
            let heatmapWeight = this.$_getWeightArr(dataSource);
            //颜色仅需平均分配，但是初始颜色要是浅色系，颜色从浅到深
            let gradientColor;
            if (this.themeOption.layerStyle && this.themeOption.layerStyle.color) {
                gradientColor = this.themeOption.layerStyle.color;
            } else {
                gradientColor = gradientHeatColor[0].key;
            }
            let heatmapColor = this.$_getHeatmapColors(gradientColor);
            //半径比较重要，半径越大相对的渐变效果越宽，通视设置不同的缩放等级，会有模糊效果
            let gradientRadius;
            if (this.themeOption.layerStyle && this.themeOption.layerStyle.color) {
                gradientRadius = this.themeOption.layerStyle.radius;
            } else {
                gradientRadius = 40;
            }
            let heatmapRadius = this.$_getHeatmapRadius(gradientRadius);
            let paintValue = {
                paint: {
                    "heatmap-color": heatmapColor,
                    "heatmap-radius": heatmapRadius,
                    "heatmap-weight": heatmapWeight,
                    "heatmap-opacity": 1,
                }
            };
            let layer = {
                id: this.layerIdCopy + "_热力专题图",
                type: 'heatmap',
                source: this.source_Id,
                layout: {
                    'visibility': "visible"
                },
                paint: paintValue.paint,
            };
            if (this.source_layer_Id) {
                layer["source-layer"] = this.source_layer_Id;
            }
            themeManager.setExtraData(this.layerIdCopy, this.themeType, "heatmap-radius", heatmapRadius);
            themeManager.setExtraData(this.layerIdCopy, this.themeType, "heatmap-weight", heatmapWeight);
            themeManager.setExtraData(this.layerIdCopy, this.themeType, "heatmap-color", heatmapColor);
            if (!this.map.getLayer(this.layerIdCopy + "_热力专题图")) {
                this.map.addLayer(layer, this.upLayer);
                this.$_setLayerOrder([this.layerIdCopy + "_热力专题图"]);
                themeManager.setLayerProps(
                    this.layerIdCopy,
                    this.layerIdCopy + "_热力专题图",
                    layer
                );
            }
        },
        $_heatmapGradientChanged(gradientHeatColor, index) {
            let heatmapColor = this.$_getHeatmapColors(gradientHeatColor);
            let colorsArr = gradientHeatColor.split(",");
            let colors = [];
            for (let i = 0; i < colorsArr.length; i++) {
                colors.push({
                    key: i + "",
                    value: colorsArr[i]
                });
            }
            if (!isNaN(Number(index))) {
                themeManager.setPanelProps(this.layerIdCopy, this.themeType, "heatmap-gradient", index);
            }
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "heatmap-colors", colors);
            this.$_setPaintPropertyToExtra(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "heatmap-color", heatmapColor);
            this.$_returnLegend();
        },
        $_getAllLayer() {
            let allLayer = themeManager.getAllLayer(), layerNameArr = [];
            let layers = this.map.getStyle();
            for (let i = 0; i < layers.layers.length; i++) {
                if (layers.layers[i].id.indexOf("专题图") < 0) {
                    layerNameArr.push(layers.layers[i].id);
                }
            }
            allLayer[themeManager.vueId].layerNameArr = layerNameArr;
            return allLayer;
        },
        $_getOriginLayerName(layerOrder) {
            let layerNameArr = [];
            for (let i = 0; i < layerOrder.length; i++) {
                if (layerOrder[i] && layerOrder[i].indexOf("专题图") < 0) {
                    layerNameArr.push(layerOrder[i]);
                }
            }
            return layerNameArr;
        },
        $_setAllLayer(themes) {
            //保存从网上或本地取得的数据
            themeManager.setAllLayer(themes);
            //取得专题图顺序
            let layerOrder = themeManager.getLayerOrder();
            let layerNameArr = themeManager.getLayerNameArr();
            //取得所有专题图原图层ID
            let originLayerIds = [], vm = this;
            for (let i = 0; i < layerOrder.length; i++) {
                if (layerOrder[i].indexOf("专题图") < 0) {
                    originLayerIds.push(layerOrder[i]);
                }
            }
            //绘制专题图
            let interval = setInterval(function () {
                //确保所有source已经加载完毕，之后做下面的
                let initAllSource = true, originLayerId = undefined;
                for (let i = 0; i < originLayerIds.length; i++) {
                    let sourceId = themeManager.getSourceId(originLayerIds[i]);
                    if (!vm.map.getSource(sourceId)) {
                        initAllSource = false;
                    }
                }
                if (initAllSource) {
                    //隐藏专题图原图层
                    for (let j = 0; j < originLayerIds.length; j++) {
                        vm.$_setOriginPaint(originLayerIds[j]);
                        let dataType = themeManager.getLayerProps(originLayerIds[j], "dataType");
                        vm.map.setPaintProperty(originLayerIds[j], dataType + "-opacity", 0);
                    }
                    //屯换添加专题图，并确保顺序正常
                    for (let i = 0; i < layerOrder.length; i++) {
                        if (layerOrder[i].indexOf("专题图") < 0) {
                            originLayerId = layerOrder[i];
                        } else {
                            let beforeLayer = layerNameArr[layerNameArr.indexOf(originLayerId) + 1];
                            if (!vm.map.getLayer(layerOrder[i])) {
                                if (layerOrder[i].indexOf("_符号专题图") > -1) {
                                    let img = new Image(128, 128);
                                    let field = themeManager.getSelectField(originLayerId, "symbol");
                                    let iconUrl = themeManager.getPanelPropsByField(originLayerId, "symbol", "icon-url", field);
                                    let iconName = themeManager.getPanelPropsByField(originLayerId, "symbol", "icon-image", field);
                                    let symbolOriginId = originLayerId;
                                    let symbolId = layerOrder[i];
                                    vm.$refs.themePanel.$_setIcons(vm.icons);
                                    img.addEventListener("load", function () {
                                        vm.map.addImage(iconName, img);
                                        let hasIcon = vm.map.hasImage(iconName), iconSize;
                                        if (hasIcon) {
                                            vm.map.addLayer(themeManager.getLayer(symbolOriginId, symbolId), beforeLayer);
                                        }
                                    });
                                    img.src = iconUrl;
                                } else {
                                    let dataType = themeManager.getLayerProps(originLayerId, "dataType");
                                    if ((dataType === "fill" || dataType === "line") && layerOrder[i].indexOf('_注记') < 0 && layerOrder[i].indexOf('_线') < 0) {
                                        let themeType = themeManager.getLayerProps(originLayerId, "themeType");
                                        let field = themeManager.getSelectField(originLayerId, themeType);
                                        let pattern = themeManager.getPanelPropsByField(originLayerId, themeType, dataType + "-pattern", field);
                                        let patternUrl = themeManager.getPanelPropsByField(originLayerId, themeType, dataType + "-pattern-url", field);
                                        vm.$refs.themePanel.$_setIcons(vm.icons);
                                        if (pattern && !vm.map.hasImage(pattern)) {
                                            let img = new Image(16, 16);
                                            let patternLayerId = originLayerId;
                                            let patternId = layerOrder[i];
                                            img.addEventListener("load", function () {
                                                vm.map.addImage(pattern, img);
                                                vm.map.addLayer(themeManager.getLayer(patternLayerId, patternId), beforeLayer);
                                            });
                                            img.src = patternUrl;
                                        } else {
                                            vm.map.addLayer(themeManager.getLayer(originLayerId, layerOrder[i]), beforeLayer);
                                        }
                                    } else {
                                        vm.map.addLayer(themeManager.getLayer(originLayerId, layerOrder[i]), beforeLayer);
                                    }
                                }
                            }
                        }
                    }
                    clearInterval(interval);
                }
            }, 100);
        },
        $_resetAllLayer(layerId) {
            let layerOrder = themeManager.getLayerProps(layerId, "layerOrder"), vm = this;
            let allLayerOrder = themeManager.getLayerOrder();
            for (let i = 0; i < layerOrder.length; i++) {
                if (layerOrder[i] !== layerId) {
                    vm.map.removeLayer(layerOrder[i]);
                }
            }
            allLayerOrder.splice(allLayerOrder.indexOf(layerOrder[0]), layerOrder.length);
            let originLayer = themeManager.getLayerProps(layerId, layerId);
            let opacity = 1;
            let dataType = themeManager.getLayerProps(layerId, "dataType");
            if (originLayer.hasOwnProperty("paint") && originLayer.paint.hasOwnProperty(dataType + "-opacity")) {
                opacity = originLayer.paint[dataType + "-opacity"];
            }
            this.map.setPaintProperty(layerId, dataType + "-opacity", opacity);
            this.$refs.themePanel.$_close();
            themeManager.setManagerProps(layerId, undefined);
        },
        $_deleteThemeLayerByGeoJSON(layerId) {
            if (this.map.getLayer(layerId + this.$_getThemeName(this.type))) {
                let layerOrder = themeManager.getLayerProps(layerId, "layerOrder"), vm = this;
                let allLayerOrder = themeManager.getLayerOrder();
                for (let i = 0; i < layerOrder.length; i++) {
                    if (layerOrder[i] !== layerId) {
                        vm.map.removeLayer(layerOrder[i]);
                    }
                }
                allLayerOrder.splice(allLayerOrder.indexOf(layerOrder[0]), layerOrder.length);
                if (this.$refs.themePanel) {
                    this.$refs.themePanel.$_close();
                }
                themeManager.setManagerProps(layerId, undefined);
                this.$_removeHighlightLayerAll();
            }
        },
        $_removeHighlightLayerAll() {
            this.$_removePopup();
            this.$_removeTips();
            this.$_removeHighlightLayer("_tips");
            this.$_removeHighlightLayer("_popup");
            if (this.map.getSource(this.tipsSourceId)) {
                this.map.removeSource(this.tipsSourceId);
            }
            if (this.map.getSource(this.popupSourceId)) {
                this.map.removeSource(this.popupSourceId);
            }
        },
        $_removeHighlightLayer(name) {
            if (this.map.getLayer(this.layerIdCopy + this.$_getThemeName() + name + "_高亮_点")) {
                this.map.removeLayer(this.layerIdCopy + this.$_getThemeName() + name + "_高亮_点");
            }
            if (this.map.getLayer(this.layerIdCopy + this.$_getThemeName() + name + "_高亮_线")) {
                this.map.removeLayer(this.layerIdCopy + this.$_getThemeName() + name + "_高亮_线");
            }
            if (this.map.getLayer(this.layerIdCopy + this.$_getThemeName() + name + "_高亮_多边形")) {
                this.map.removeLayer(this.layerIdCopy + this.$_getThemeName() + name + "_高亮_多边形");
            }
        },
        $_hideCurrentLayer(layerId) {
            let layerOrder = themeManager.getLayerOrderById(layerId);
            let themeType = themeManager.getThemeTypeById(layerId);
            for (let i = 0; i < layerOrder.length; i++) {
                if (layerOrder[i].indexOf(layerId + this.$_getThemeName(themeType)) > -1) {
                    this.$_setLayOutProperty(layerId, layerOrder[i], "visibility", "none");
                }
            }
        },
        $_showCurrentLayer(layerId) {
            let layerOrder = themeManager.getLayerOrderById(layerId);
            let themeType = themeManager.getThemeTypeById(layerId);
            for (let i = 0; i < layerOrder.length; i++) {
                if (layerOrder[i].indexOf(layerId + this.$_getThemeName(themeType)) > -1) {
                    //当有符号专题图时，要确保所用的图标已经加载，因为图标有可能被外部删除
                    if (layerOrder[i].indexOf("_符号专题图") > -1) {
                        let selectField = themeManager.getSelectField(layerId, "symbol");
                        let iconName = themeManager.getPanelProps(layerId, "symbol", "icon-image");
                        if (this.map.hasImage(iconName)) {
                            this.$_setLayOutProperty(layerId, layerOrder[i], "visibility", "visible");
                        } else {
                            let img = new Image(128, 128);
                            img.addEventListener("load", function () {
                                vm.map.addImage(iconName, img);
                                vm.$_setLayOutProperty(layerId, layerOrder[i], "visibility", "visible");
                            });
                            img.src = themeManager.getPanelProps(layerId, "symbol", "icon-url", selectField);
                        }
                    } else {
                        this.$_setLayOutProperty(layerId, layerOrder[i], "visibility", "visible");
                    }
                }
            }
            let vm = this;
            setTimeout(function () {
                //隐藏原图层
                let dataType = themeManager.getLayerProps(layerId, "dataType");
                vm.map.setPaintProperty(layerId, dataType + "-opacity", 0);
            }, 100);
        },
        $_getNullFields(features, layerId) {
            let fields = [];
            for (let i = 0; i < features.length; i++) {
                Object.keys(features[i].properties).forEach(function (key) {
                    if (
                        (!features[i].properties[key] ||
                            features[i].properties[key] === "" ||
                            features[i].properties[key] === "undefined" ||
                            features[i].properties[key] === "null") &&
                        fields.indexOf(key) < 0
                    ) {
                        fields.push(key);
                    }
                });
            }
            if (fields.length > 0) {
                this.hasNullProperty.push(layerId);
            }
            this.$emit("hasNullProperty", fields);
        },
        $_setLayerZoomRange(layerId, minzoom, maxzoom) {
            let layerOrder = themeManager.getLayerOrderById(layerId);
            if (layerOrder) {
                for (let i = 0; i < layerOrder.length; i++) {
                    if (layerOrder[i] !== layerId) {
                        if (this.map.getLayer(layerOrder[i])) {
                            this.map.setLayerZoomRange(layerOrder[i], minzoom, maxzoom);
                        }
                    }
                }
            }
        },
        $_setOriginPaint(layerId, originLayerStyle) {
            //如果原图层没有paint属性则补上基本的绘制属性，这里必须保证paint不为空，否则后续部分操作mapbox会报错
            let originLayer = this.map.getLayer(layerId);
            if (originLayer) {
                let type = originLayer.type;
                let paint = originLayer.paint;
                if (JSON.stringify(paint["_values"]) === "{}") {
                    switch (type) {
                        case "fill":
                            this.map.setPaintProperty(layerId, "fill-color", "#EEEEEE");
                            this.map.setPaintProperty(layerId, "fill-outline-color", "#FFFFFF");
                            if (originLayerStyle) {
                                originLayerStyle.paint["fill-color"] = "#EEEEEE";
                                originLayerStyle.paint["fill-outline-color"] = "#FFFFFF";
                            }
                            break;
                        case "line":
                            this.map.setPaintProperty(layerId, "line-color", "#1890FF");
                            if (originLayerStyle) {
                                originLayerStyle.paint["line-color"] = "#1890FF";
                            }
                            break;
                        case "circle":
                            this.map.setPaintProperty(layerId, "circle-color", "#000000");
                            this.map.setPaintProperty(layerId, "circle-stroke-color", "#1890FF");
                            if (originLayerStyle) {
                                originLayerStyle.paint["circle-color"] = "#1890FF";
                                originLayerStyle.paint["circle-stroke-color"] = "#000000";
                            }
                            break;
                    }
                }
            }
        },
        $_getLegend(layerId) {
            let colors, returnColors, legends = [];
            switch (this.themeType) {
                case "uniform":
                    colors = themeManager.getExtraData(layerId, this.themeType, this.dataType + "-color");
                    if (colors instanceof Array) {
                        returnColors = colors.slice(2, colors.length - 1);
                    } else {
                        returnColors = colors.stops[0];
                    }
                    break;
                case "unique":
                    colors = themeManager.getExtraData(layerId, this.themeType, this.dataType + "-color");
                    if (colors instanceof Array) {
                        returnColors = colors.slice(2, colors.length - 1);
                    } else {
                        returnColors = colors.stops[0];
                    }
                    break;
                case "range":
                    colors = themeManager.getExtraData(layerId, this.themeType, this.dataType + "-color");
                    returnColors = colors.slice(3, colors.length);
                    break;
                case "heatmap":
                    colors = themeManager.getExtraData(layerId, this.themeType, "heatmap-color");
                    returnColors = colors.slice(3, colors.length - 1);
                    break;
                case "symbol":
                    colors = themeManager.getPanelProps(layerId, this.themeType, "icon-url");
                    returnColors = colors;
                    break;
            }
            if (returnColors) {
                if (this.themeType !== "symbol") {
                    let length = returnColors.length / 2;
                    for (let i = 0; i < length; i++) {
                        legends.push({
                            layerName: returnColors[i * 2],
                            layerType: this.dataType,
                            color: returnColors[i * 2 + 1]
                        });
                    }
                } else {
                    legends.push({
                        layerName: this.layerIdCopy + "_符号",
                        layerType: "symbol",
                        color: returnColors
                    });
                }
            }
            return legends;
        }
    }
};
