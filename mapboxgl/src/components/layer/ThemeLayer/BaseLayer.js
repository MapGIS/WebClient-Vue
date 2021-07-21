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
        }
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
                if (!this.useOriginLayer) {
                    throw new Error("请将useOriginLayer设为true！");
                } else {
                    this.$_getFromSource(this.layerId);
                }
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
        };
    },
    methods: {
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
            this.$set(this.layerVector.paint, "line-width", lineWidth);
        },
        $_radiusChanged(radius) {
            this.$set(this.layerVector.paint, "circle-radius", radius);
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
        $_getFromSource(layerId) {
            let features = this.map.queryRenderedFeatures({layers: [layerId]});
            if (features.length === 0) {
                return;
            }
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
            startColor = startColor || "#FFFFFF";
            endColor = endColor || "#FF0000";
            this.sourceVector.data = geojson;
            this.dataCopy = geojson;
            this.showVector = true;
            this.fields = this.$_getFields(geojson.features[0]);
            this.selectKey = this.fields[0];
            this.selectText = this.fields[0];
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
            this.$emit("loaded", this, layer);
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
            if(this.$_editData){
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
                    this.layerVector.paint["fill-outline-color"] = e;
                    break
                case "circle":
                    this.layerVector.paint["circle-stroke-color"] = e;
                    break
            }
            this.$_changeOriginLayer();
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
                    }else {
                        stops.push([this.originColors.colors.stops[i][0],"#FFFFFF"]);
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
    }
};
