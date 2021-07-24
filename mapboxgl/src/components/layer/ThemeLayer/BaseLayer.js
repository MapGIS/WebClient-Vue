import {MRFS} from "@mapgis/webclient-es6-service";

const {FeatureService} = MRFS;

export default {
    inject: ["mapbox", "map"],
    props: {
        baseUrl: {
            type: String
        },
        sourceId: {
            type: String
        },
        layerId: {
            type: String
        },
        sourceLayer: {
            type: String
        },
        useOriginLayer: {
            type: Boolean,
            default: true
        },
        icons: {
            type: Array
        },
    },
    watch: {
        baseUrl: {
            handler: function () {
                this.$_removeLayer();
                this.$_getFromGeoJSON();
            }
        },
        sourceId: {
            handler: function () {
                if (!this.sourceLayer) {
                    throw new Error("sourceLayer不能为空！");
                } else if (this.useOriginLayer) {
                    throw new Error("请将useOriginLayer设为false！");
                } else {
                    this.$_removeLayer();
                    this.$_getFromSource(this.sourceLayer);
                }
            }
        },
        layerId: {
            handler: function () {
                // if (!this.useOriginLayer) {
                //     throw new Error("请将useOriginLayer设为true！");
                // } else {
                //     this.$_getFromSource(this.layerId);
                // }
                this.$_getFromSource(this.layerId);
            }
        },
        panelProps: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            colors: [],
            originColors: [],
            startColor: "#FFFFFF",
            endColor: "#FF0000",
            showLayer: true,
            showPanel: true,
            sourceVector: {
                type: 'geojson',
                data: undefined
            },
            dataCopy: undefined,
            showVector: false,
            fields: [],
            selectKey: undefined,
            selectText: undefined,
            dataSource: [],
            checkBoxArr: [],
            sourceVectorId: 'theme_source',
            layerVectorId: 'theme_layer',
            allOriginColors: {},
            layerVector: {},
            dataType: "",
            textLayer: undefined,
            offsetText: [0, 0],
            offset: [0, 0],
            themeType: "range",
            opacity: 1,
            lineWidth: 2,
            fontColor: "#000000",
            haloColor: "#FFFFFF",
            haloWidth: 0,
            textRotation: 0,
            textPadding: 0.05,
            fontSize: 11,
            radius: 6,
            outerLineOpacity: 1,
            outerLineColor: "#000000",
            lineLayer: undefined,
            textFonts: ["黑体", "宋体", "楷体", "微软雅黑", "Arial", "Calibri", "Times New Roman"],
            textFont: undefined,
            source_vector_Id: undefined,
            source_vector_layer_Id: undefined,
            originLayer: undefined,
            changeLayerProp: false,
            changeLayerId: undefined,
        };
    },
    methods: {
        resetLayer(){
            this.$_resetLayer();
        },
        $_resetLayer(){
            if(this.layerId){
                this.map.setLayoutProperty("text_layer_id","visibility","none");
                this.map.setLayoutProperty("line_layer_id","visibility","none");
                let paint = window.originLayer.paint;
                let layout = window.originLayer.layout;
                for (let key in paint){
                    if(paint.hasOwnProperty(key) && key.indexOf("_") < 0 && paint[key]){
                        this.$_setPaintProperty(key,paint[key]);
                    }
                }
                for (let key in layout){
                    if(layout.hasOwnProperty(key) && key.indexOf("_") < 0 && layout[key]){
                        this.$_setPaintProperty(key,paint[layout]);
                    }
                }
                this.$emit("resetLayer");
            }
        },
        $_formatProps() {
            let formatArr = [
                {
                    before: "icon-size",
                    after: "radius"
                }, {
                    before: "icon-size-max",
                    after: "radiusMax"
                }, {
                    before: "icon-size-step",
                    after: "radiusStep"
                }, {
                    before: "icon-offset-x",
                    after: "xOffset"
                }, {
                    before: "icon-offset-x-min",
                    after: "xOffsetMin"
                }, {
                    before: "icon-offset-x-max",
                    after: "xOffsetMax"
                }, {
                    before: "icon-offset-x-step",
                    after: "xOffsetStep"
                }, {
                    before: "icon-offset-y",
                    after: "yOffset"
                }, {
                    before: "icon-offset-y-min",
                    after: "yOffsetMin"
                }, {
                    before: "icon-offset-y-max",
                    after: "yOffsetMax"
                }, {
                    before: "icon-offset-y-step",
                    after: "yOffsetStep"
                }, {
                    before: "icon-rotate",
                    after: "rotation"
                }, {
                    before: "icon-rotate-step",
                    after: "rotationStep"
                }, {
                    before: "text-color",
                    after: "fontColor"
                }, {
                    before: "text-halo-color",
                    after: "haloColor"
                }, {
                    before: "text-halo-width",
                    after: "haloWidth"
                }, {
                    before: "text-halo-width-step",
                    after: "haloWidthStep"
                }, {
                    before: "text-halo-width-max",
                    after: "haloWidthMax"
                }, {
                    before: "text-offset-x",
                    after: "xOffsetText"
                }, {
                    before: "text-offset-x-min",
                    after: "xOffsetTextMin"
                }, {
                    before: "text-offset-x-max",
                    after: "xOffsetTextMax"
                }, {
                    before: "text-offset-x-step",
                    after: "xOffsetTextStep"
                }, {
                    before: "text-offset-y",
                    after: "yOffsetText"
                }, {
                    before: "text-offset-y-min",
                    after: "yOffsetTextMin"
                }, {
                    before: "text-offset-y-max",
                    after: "yOffsetTextMax"
                }, {
                    before: "text-offset-y-step",
                    after: "yOffsetTextStep"
                }, {
                    before: "text-padding",
                    after: "textPadding"
                }, {
                    before: "text-padding-Step",
                    after: "textPaddingStep"
                }, {
                    before: "text-padding-max",
                    after: "textPaddingMax"
                }, {
                    before: "text-rotate",
                    after: "textRotation"
                }, {
                    before: "text-rotate-step",
                    after: "textRotationStep"
                }, {
                    before: "text-size",
                    after: "fontSize"
                }, {
                    before: "icon-opacity",
                    after: "opacity"
                }, {
                    before: "line-width",
                    after: "lineWidth"
                }, {
                    before: "circle-stroke-width",
                    after: "lineWidth"
                }, {
                    before: "line-width-max",
                    after: "lineWidthMax"
                }, {
                    before: "line-width-step",
                    after: "lineWidthStep"
                }, {
                    before: "line-opacity",
                    after: "opacity"
                }, {
                    before: "text-letter-spacing",
                    after: "textPadding"
                }, {
                    before: "circle-opacity",
                    after: "opacity"
                }, {
                    before: "circle-stroke-opacity",
                    after: "outerLineOpacity"
                }, {
                    before: "circle-translate",
                    after: "offset"
                }, {
                    before: "circle-stroke-color",
                    after: "outerLineColor"
                }, {
                    before: "fill-opacity",
                    after: "opacity"
                }
            ];
            this.panelPropsDefault = Object.assign(this.panelPropsDefault, this.panelProps);
            let vm = this;
            for (let i = 0; i < formatArr.length; i++) {
                if (this.panelPropsDefault.hasOwnProperty(formatArr[i].before)) {
                    this.panelPropsDefault[formatArr[i].after] = this.panelPropsDefault[formatArr[i].before];
                }
            }
            Object.keys(this.$data).forEach(function (key) {
                if (vm.panelPropsDefault.hasOwnProperty(key)) {
                    vm.$data[key] = vm.panelPropsDefault[key];
                }
            });
        },
        $_gradientColor(startColor, endColor, step) {
            let startRGB = this.$_colorRgb(startColor);//转换为rgb数组模式
            let startR = startRGB[0];
            let startG = startRGB[1];
            let startB = startRGB[2];

            let endRGB = this.$_colorRgb(endColor);
            let endR = endRGB[0];
            let endG = endRGB[1];
            let endB = endRGB[2];

            let sR = (endR - startR) / step;//总差值
            let sG = (endG - startG) / step;
            let sB = (endB - startB) / step;

            let colorArr = [];
            for (let i = 0; i < step; i++) {
                //计算每一步的hex值
                let hex = this.$_colorHex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');
                colorArr.push(hex);
            }
            return colorArr;
        },
        $_colorRgb(sColor) {
            let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            sColor = sColor.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    let sColorNew = "#";
                    for (let i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                let sColorChange = [];
                for (let i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return sColorChange;
            } else {
                return sColor;
            }
        },
        $_colorHex(rgb) {
            let _this = rgb;
            let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            if (/^(rgb|RGB)/.test(_this)) {
                let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                let strHex = "#";
                for (let i = 0; i < aColor.length; i++) {
                    let hex = Number(aColor[i]).toString(16);
                    hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = _this;
                }
                return strHex;
            } else if (reg.test(_this)) {
                let aNum = _this.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return _this;
                } else if (aNum.length === 3) {
                    let numHex = "#";
                    for (let i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return _this;
            }
        },
        $_toggleLayer() {
            let show = this.showLayer ? "none" : "visible";
            this.showLayer = !this.showLayer;
            this.map.setLayoutProperty(this.layerVectorId, 'visibility', show);
        },
        $_closePanel() {
            this.showPanel = false;
            this.$_toggleLayer();
        },
        $_removeLayer() {
            let layer = this.map.getLayer(this.layerVectorId);
            if (layer) {
                this.map.removeLayer(this.layerVectorId);
            }
        },
        $_mount() {
            if (this.panelPropsDefault.hasOwnProperty("xOffset") && this.panelPropsDefault.xOffset) {
                this.$set(this.offset, 0, this.panelPropsDefault.xOffset);
            }
            if (this.panelPropsDefault.hasOwnProperty("yOffset") && this.panelPropsDefault.yOffset) {
                this.$set(this.offset, 1, this.panelPropsDefault.yOffset * -1);
            }
            if (this.panelPropsDefault.hasOwnProperty("xOffsetText") && this.panelPropsDefault.xOffsetText) {
                this.$set(this.offsetText, 0, this.panelPropsDefault.xOffsetText);
            }
            if (this.panelPropsDefault.hasOwnProperty("yOffsetText") && this.panelPropsDefault.yOffsetText) {
                this.$set(this.offsetText, 1, this.panelPropsDefault.yOffsetText * -1);
            }
            if (this.panelPropsDefault.hasOwnProperty("opacity") && this.panelPropsDefault.opacity) {
                this.opacity = this.panelPropsDefault.opacity / 100;
            }
            if (this.sourceId && this.sourceLayer) {
                if (this.useOriginLayer) {
                    throw new Error("请将useOriginLayer设为false！");
                } else {
                    this.$_getFromSource(this.sourceLayer);
                }
            } else if (this.layerId) {
                if (!this.useOriginLayer) {
                    throw new Error("请将useOriginLayer设为true！");
                } else {
                    this.$_getFromSource(this.layerId);
                }
            } else if (this.baseUrl) {
                this.$_getFromGeoJSON();
            }
        },
        $_lineWidthChanged(lineWidth) {
            switch (this.dataType) {
                case "line":
                    this.$_setPaintProperty("line-width", lineWidth);
                    break;
                case "circle":
                    this.$_setPaintProperty("circle-stroke-width", lineWidth);
                    break;
            }
        },
        $_selectTextChanged(value) {
            if (!this.textLayer) {
                if (!this.textFont) {
                    this.textFont = this.textFonts[0];
                }
                this.textLayer = {
                    'id': 'text_layer_id',
                    'source': this.source_vector_Id,
                    'type': 'symbol',
                    'layout': {
                        "text-field": '{' + value + '}',
                        'text-size': this.fontSize,
                        'text-letter-spacing': this.textPadding,
                        'text-offset': this.offsetText,
                        'text-font': [this.textFont],
                        'text-rotate': this.textRotation
                    },
                    'paint': {
                        'text-color': this.fontColor,
                        "text-halo-color": this.haloColor,
                        "text-halo-width": this.haloWidth
                    },
                };
                if (this.source_vector_layer_Id) {
                    this.textLayer["source-layer"] = this.source_vector_layer_Id;
                }
                this.map.addLayer(this.textLayer);
            } else {
                this.$_setLayOutProperty("text-field", '{' + value + '}', "text_layer_id", this.textLayer);
            }
        },
        $_setLayOutProperty(key, value, layerId, layerVector) {
            layerId = layerId || this.layerId;
            layerVector = layerVector || this.layerVector;
            layerVector.layout[key] = value;
            this.map.setLayoutProperty(layerId, key, layerVector.layout[key]);
            this.changeLayerProp = true;
            this.changeLayerId = layerId;
        },
        $_radiusChanged(radius) {
            this.$_setPaintProperty("circle-radius", radius);
        },
        $_outerLineColorChanged(color) {
            this.$_setPaintProperty("circle-stroke-color", color);
        },
        $_singleChanged(startColor, endColor) {
            this.$_gradientChange(startColor, endColor);
        },
        $_fontColorChanged(color) {
            this.$_setPaintProperty("text-color", color, "text_layer_id", this.textLayer);
        },
        $_haloColorChanged(color) {
            this.$_setPaintProperty("text-halo-color", color, "text_layer_id", this.textLayer);
        },
        $_haloWidthChanged(color) {
            this.$_setPaintProperty("text-halo-width", color, "text_layer_id", this.textLayer);
        },
        $_fontSizeChanged(fontSize) {
            this.$_setLayOutProperty("text-size", fontSize, "text_layer_id", this.textLayer);
        },
        $_xOffsetChanged(xOffset) {
            this.offset[0] = xOffset;
            this.$_setPaintProperty("circle-translate", this.offset);
        },
        $_yOffsetChanged(yOffset) {
            this.offset[1] = yOffset;
            this.$_setPaintProperty("circle-translate", this.offset);
        },
        $_yOffsetTextChanged(offset) {
            this.offsetText[1] = offset;
            this.$_setLayOutProperty("text-offset", this.offsetText, "text_layer_id", this.textLayer);
        },
        $_xOffsetTextChanged(offset) {
            this.offsetText[0] = offset;
            this.$_setLayOutProperty("text-offset", this.offsetText, "text_layer_id", this.textLayer);
        },
        $_textPaddingChanged(textPadding) {
            this.$_setLayOutProperty("text-letter-spacing", textPadding, "text_layer_id", this.textLayer);
        },
        $_textRotationChanged(textRotation) {
            this.$_setLayOutProperty("text-rotate", textRotation, "text_layer_id", this.textLayer);
        },
        $_outerLineOpacityChanged(opacity) {
            this.$_setPaintProperty("circle-stroke-opacity", opacity);
        },
        $_lineStyleChanged(lineStyle) {
            this.$_setPaintProperty("line-dasharray", lineStyle.value);
        },
        $_getFields(features) {
            let fields = [];
            Object.keys(features.properties).forEach(function (key) {
                fields.push(key);
            });
            return fields;
        },
        $_changeOriginLayer() {
            let vm = this;
            if (this.useOriginLayer) {
                Object.keys(this.layerVector.paint).forEach(function (key) {
                    vm.map.setPaintProperty(vm.layerId, key, vm.layerVector.paint[key]);
                });
            }
        },
        $_getLayerStyle(layerId) {
            let layer = {}, vm = this;
            let originLayer = this.map.getLayer(layerId);
            Object.keys(originLayer).forEach(function (key) {
                switch (key) {
                    case "paint":
                        let paint = {};
                        for (let pKey in originLayer.paint._values){
                            if(originLayer.paint._values.hasOwnProperty(pKey) && originLayer.paint._values[pKey]){
                                paint[pKey] = vm.map.getPaintProperty(layerId, pKey);
                            }
                        }
                        layer[key] = paint;
                        break;
                    case "layout":
                        let layout = {};
                        for (let lKey in originLayer.layout._values){
                            if(originLayer.layout._values.hasOwnProperty(lKey) && originLayer.layout._values[lKey]){
                                layout[lKey] = vm.map.getLayoutProperty(layerId, lKey);
                            }
                        }
                        layer[key] = layout;
                        break;
                    default:
                        layer[key] = originLayer[key];
                        break;
                }
            });
            return layer;
        },
        $_getFromSource(layerId) {
            let features = this.map.queryRenderedFeatures({layers: [layerId]});
            if (features.length === 0) {
                return;
            }
            let originLayer = this.map.getLayer(layerId);
            window.originLayer = this.$_getLayerStyle(layerId);
            this.source_vector_Id = originLayer.source;
            this.source_vector_layer_Id = originLayer.sourceLayer;
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
            this.$_initTheme(featureCollection);
        },
        $_getFromGeoJSON() {
            let vm = this;
            FeatureService.get(this.baseUrl, function (result) {
                result = JSON.parse(result);
                vm.$_initTheme(result);
            }, function (e) {
                console.log(e);
            });
        },
        $_initTheme(geojson, startColor, endColor) {
            if (this.$_editGeoJSON) {
                geojson = this.$_editGeoJSON(geojson);
            }
            let vm = this;
            this.map.on('data', function (e) {
                if (vm.changeLayerProp) {
                    let layer = {};
                    if(vm.changeLayerId === "line_layer_id"){
                        layer = vm.lineLayer;
                    }else if(vm.changeLayerId === "text_layer_id"){
                        layer = vm.textLayer;
                    } else {
                        layer = vm.$_getLayerStyle(vm.changeLayerId);
                    }
                    vm.$emit("layerChanged", layer);
                    vm.changeLayerProp = false;
                }
            });
            startColor = startColor || "#FFFFFF";
            endColor = endColor || "#FF0000";
            this.sourceVector.data = geojson;
            this.dataCopy = geojson;
            this.showVector = true;
            this.fields = this.$_getFields(geojson.features[0]);
            this.selectKey = this.fields[0];
            this.dataSource = this.$_getData(geojson.features, this.selectKey);
            let fillColors = this.$_getColors(this.dataSource, startColor, endColor, this.selectKey);
            this.checkBoxArr = this.originColors.checkArr;
            if (this.$_initThemeCallBack) {
                this.$_initThemeCallBack(geojson, fillColors, this.dataSource);
            } else {
                throw new Error("请设置$_initTheme方法的回到函数！");
            }
            let layer = {...this.layerVector, ...this.$props};
            this.$_changeOriginLayer();
            this.$_loadedLayer();
            this.$emit("loaded", this, layer);
        },
        $_getAllLayerStyle() {
            let layers = [];
            if (this.dataType === 'fill') {
                layers.push({
                    action: "add",
                    layer: this.lineLayer
                });
            }

            layers.push({
                action: "add",
                layer: this.textLayer
            });

            let replaceLayer = this.$_getLayerStyle(this.layerId);

            layers.push({
                action: "replace",
                originLayer: window.originLayer,
                replaceLayer: replaceLayer
            });

            return layers;
        },
        $_loadedLayer() {
            let layers = this.$_getAllLayerStyle();
            this.$emit("themeLoaded", layers);
        },
        $_getColors(dataSource, startColor, endColor, key, noColor, clearColor) {
            let colors;
            if (this.allOriginColors.hasOwnProperty(key) && !clearColor) {
                this.originColors = this.allOriginColors[key];
                colors = this.$_getColorsFromOrigin();
            } else {
                let originColors;
                if (this.$_getColorsCallBack) {
                    originColors = this.$_getColorsCallBack(colors, dataSource, startColor, endColor, key);
                } else {
                    throw new Error("请设置$_getColors方法的回到函数！");
                }

                if (!originColors) {
                    throw new Error("请返回一个originColor对象，该对象包含checkArr、colors以及colorList三个属性！");
                }
                this.originColors = originColors;
                colors = originColors.colors;
                this.allOriginColors[key] = this.originColors;
            }
            if (!noColor) {
                this.colors = this.originColors.colorList;
            }
            return colors;
        },
        $_getData(features, value) {
            let datas = [], isSort = true;
            for (let i = 0; i < features.length; i++) {
                if (datas.indexOf(features[i].properties[value]) < 0) {
                    if (typeof features[i].properties[value] !== 'number') {
                        isSort = false;
                    }
                    if ((features[i].properties[value] || typeof features[i].properties[value] === 'number') && features[i].properties[value] !== "") {
                        datas.push(features[i].properties[value]);
                    }
                }
            }
            if (isSort) {
                datas.sort(function (a, b) {
                    return a - b;
                });
            }

            this.dataBack = datas;

            if (this.themeType === "range") {
                datas = this.$_editData(datas);
            }
            return datas;
        },
        $_selectChange(value) {
            if (value !== "") {
                let datas = this.$_getData(this.dataCopy.features, value);
                this.dataSource = datas;
                let colors = this.$_getColors(this.dataSource, this.startColor, this.endColor, value);
                this.checkBoxArr = this.originColors.checkArr;
                this.selectKey = value;
                if (this.checkBoxArr.indexOf(true) < 0) {
                    this.showVector = false;
                } else {
                    this.showVector = false;
                    if (this.$_selectChangeCallBack) {
                        this.$_selectChangeCallBack(colors);
                    } else {
                        throw new Error("请设置$_selectChange方法的回到函数！");
                    }
                    this.$_changeOriginLayer();
                    this.showVector = true;
                }
            }
        },
        $_gradientChange(startColor, endColor) {
            this.showVector = false;
            this.startColor = startColor;
            this.endColor = endColor;
            let colors = this.$_getColors(this.dataSource, startColor, endColor, this.selectKey, false, true);
            switch (this.dataType) {
                case "fill":
                    this.layerVector.paint["fill-color"] = colors;
                    break;
                case "circle":
                    this.layerVector.paint["circle-color"] = colors;
                    break;
                case "line":
                    this.layerVector.paint["line-color"] = colors;
                    break;
            }
            this.$_changeOriginLayer();
            this.showVector = true;
        },
        $_lineColorChanged(e) {
            this.showVector = false;
            switch (this.dataType) {
                case "fill":
                    this.$_setPaintProperty("fill-outline-color", e);
                    break
                case "circle":
                    this.$_setPaintProperty("circle-outline-color", e);
                    break
            }
            this.showVector = true;
        },
        $_opacityChanged(e) {
            this.showVector = false;
            if (this.$_opacityChangedCallBack) {
                this.$_opacityChangedCallBack(e);
            } else {
                throw new Error("请设置$_opacityChanged方法的回到函数！");
            }
            this.$_changeOriginLayer();
            this.showVector = true;
        },
        $_oneColorChanged(index, color) {
            let colors = this.$_getColorsFromOrigin(index, color);
            if (this.$_oneColorChangedCallBack) {
                this.$_oneColorChangedCallBack(colors);
            } else {
                throw new Error("请设置$_oneColorChanged方法的回到函数！");
            }
        },
        /*
        * 修改单一属性的颜色的回调方法
        * @param colors 颜色信息
        * **/
        $_oneColorChangedCallBack(colors) {
            colors = this.$_editColor(colors);
            switch (this.dataType) {
                case "fill":
                    this.$_setPaintProperty("fill-color", colors);
                    break;
                case "circle":
                    this.$_setPaintProperty("circle-color", colors);
                    break;
                case "line":
                    this.$_setPaintProperty("line-color", colors);
                    break;
            }
        },
        $_editData(dataSource) {
            let length = dataSource.length, newDataSource = [], rangeLevel = 10;
            let range = dataSource[length - 1] - dataSource[0];
            if (range === 0) {
                newDataSource.push(dataSource[0]);
                this.endData = dataSource[0] + 1;
                this.endDataCopy = this.endData;
                return newDataSource;
            } else {
                let rangeSect = range / rangeLevel;
                if (dataSource[0] < 0) {
                    this.startData = dataSource[0] - 1;
                } else {
                    this.startData = 0;
                }
                this.startDataCopy = this.startData;
                for (let i = 0; i < rangeLevel; i++) {
                    newDataSource.push(dataSource[0] + (i + 1) * rangeSect + 1);
                }
                this.endData = newDataSource[rangeLevel - 1] + rangeSect;
                this.endDataCopy = this.endData;
                return newDataSource;
            }
        },
        /*
        * 改变透明度的回调方法
        * @param opacity 透明度
        * **/
        $_opacityChangedCallBack(opacity) {
            switch (this.dataType) {
                case "fill":
                    this.layerVector.paint["fill-opacity"] = opacity;
                    break;
                case "circle":
                    this.layerVector.paint["circle-opacity"] = opacity;
                    break;
                case "line":
                    this.layerVector.paint["line-opacity"] = opacity;
                    break;
            }
        },
        $_editColor(colors) {
            let newStops = [], stopIndex = 0, newColor = {};
            if (this.themeType === "range") {
                for (let i = 0; i < this.dataBack.length; i++) {
                    if (this.dataBack[i] <= colors.stops[stopIndex][0]) {
                        newStops.push([this.dataBack[i], colors.stops[stopIndex][1]]);
                    } else {
                        stopIndex++;
                        for (let j = stopIndex; j < colors.stops.length; j++) {
                            if (this.dataBack[i] < colors.stops[j][0]) {
                                stopIndex = j;
                                newStops.push([this.dataBack[i], colors.stops[j][1]]);
                                break;
                            }
                        }
                    }
                }
                newColor = {
                    "property": colors.property,
                    "stops": newStops
                }
            } else {
                newColor = colors;
            }

            return newColor;
        },
        $_clickIcon(icon) {
            let hasIcon = this.map.hasImage(icon.name), vm = this;
            let partten;
            switch (this.dataType) {
                case "fill":
                    partten = "fill-pattern";
                    break;
                case "line":
                    partten = "line-pattern";
                    break;
            }
            if (!hasIcon) {
                this.map.loadImage(icon.url, function (error, image) {
                    if (error) throw error;
                    vm.map.addImage(icon.name, image, {'sdf': true});
                    vm.$_setPaintProperty(partten, icon.name);
                });
            } else {
                vm.$_setPaintProperty(partten, icon.name);
            }
        },
        $_setPaintProperty(key, value, layerId, layerVector) {
            layerId = layerId || this.layerId;
            layerVector = layerVector || this.layerVector;
            layerVector.paint[key] = value;
            this.map.setPaintProperty(layerId, key, layerVector.paint[key]);
            this.changeLayerProp = true;
            this.changeLayerId = layerId;
        },
        $_getColorsFromOrigin(index, color, num) {
            let colors;
            let fillName = "";
            switch (this.dataType) {
                case "fill":
                    fillName = "fill-color";
                    break;
                case "circle":
                    fillName = "circle-color";
                    break;
                case "line":
                    fillName = "line-color";
                    break;
            }
            if (this.originColors.colors.hasOwnProperty("stops")) {
                colors = {};
                if (index !== null && index !== undefined) {
                    if (color) {
                        this.$set(this.originColors.colors.stops[index], 1, color);
                    }
                    if (num) {
                        this.$set(this.originColors.colors.stops[index], 0, num);
                    }
                }
                let stops = [];
                for (let i = 0; i < this.originColors.checkArr.length; i++) {
                    if (this.originColors.checkArr[i]) {
                        stops.push(this.originColors.colors.stops[i]);
                    } else {
                        stops.push([this.originColors.colors.stops[i][0], "#FFFFFF"]);
                    }
                }
                colors.stops = stops;
                colors.property = this.originColors.colors.property;
            } else if (this.originColors.colors.indexOf("match") === 0) {
                if (index !== null && index !== undefined) {
                    this.$set(this.originColors.colors, (index + 1) * 2 + 1, color);
                }
                this.$set(this.originColors.colors, (index + 1) * 2 + 1, color);
                colors = []
                colors.push(this.originColors.colors[0], this.originColors.colors[1]);
                for (let i = 0; i < this.originColors.checkArr.length; i++) {
                    if (this.originColors.checkArr[i]) {
                        colors.push(this.originColors.colors[(i + 1) * 2], this.originColors.colors[(i + 1) * 2 + 1]);
                    }
                }
                colors.push("#FFF");
            }
            return colors;
        },
        $_addLineLayer() {
            if (!this.lineLayer) {
                this.lineLayer = {
                    'id': 'line_layer_id',
                    'source': this.source_vector_Id,
                    'type': 'line',
                    'paint': {
                        'line-color': "#FF0000",
                        'line-opacity': this.outerLineOpacity, //透明度
                        'line-width': this.lineWidth,
                    },
                };
                if (this.source_vector_layer_Id) {
                    this.lineLayer["source-layer"] = this.source_vector_layer_Id;
                }
                this.map.addLayer(this.lineLayer);
            }
        },
        $_addTextLayer() {
            if (!this.textFont) {
                this.textFont = this.textFonts[0];
            }
            this.textLayer = {
                'id': 'text_layer_id',
                'source': this.source_vector_Id,
                'type': 'symbol',
                'layout': {
                    "text-field": '',
                    'text-size': this.fontSize,
                    'text-letter-spacing': this.textPadding,
                    'text-offset': this.offsetText,
                    'text-font': [this.textFont],
                    'text-rotate': this.textRotation
                },
                'paint': {
                    'text-color': this.fontColor,
                    "text-halo-color": this.haloColor,
                    "text-halo-width": this.haloWidth
                },
            };
            if (this.source_vector_layer_Id) {
                this.textLayer["source-layer"] = this.source_vector_layer_Id;
            }
            this.map.addLayer(this.textLayer);
        }
    }
};
