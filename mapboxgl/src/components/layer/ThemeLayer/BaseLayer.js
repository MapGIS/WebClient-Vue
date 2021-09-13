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

const {FeatureService} = MRFS;

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
        /**
         * 默认图标
         * */
        defaultIcon: {
            type: String
        }
    },
    watch: {},
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
            hasNullProperty: []
        };
    },
    mounted() {
        if (!window.layerManager) {
            window.layerManager = {};
        }
        //初始化专题图管理对象
        themeManager.init(this.vueId);
        this.$emit("loaded", this);
    },
    methods: {
        $_addThemeLayer(themeType, layerId) {
            this.$refs.themePanel.$_show();
            let vm = this;
            if (themeType) {
                //初始化专题图存储对象
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
                            vm.selectValue = fields[0];
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
                            vm.selectValue = fields[0];
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
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$refs.themePanel.rangeLevel = vm.rangeLevel;
                            vm.$_setRangeColors(gradients[0].key, vm.dataSourceCopy, vm.selectValue, features);
                            vm.$refs.themePanel.$_setColors(vm.colors);
                            vm.$_addRangeLayer();
                            break;
                        case "symbol":
                            fields = themeManager.getLayerProps(vm.layerIdCopy, "numberFields");
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                fields[0]
                            );
                            dataSource = vm.$_setDataSource(features, fields[0], "range");
                            vm.$refs.themePanel.currentThemeType = vm.themeType;
                            vm.$refs.themePanel.$_setIcons(vm.icons);
                            vm.$refs.themePanel.$_setDefaultIcon(vm.defaultIcon);
                            vm.$refs.themePanel.$_setDataSoure(dataSource);
                            vm.selectValue = fields[0];
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
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                fields[0]
                            );
                            dataSource = vm.$_setDataSource(features, fields[0], "unique");
                            vm.selectValue = fields[0];
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
                    vm.$refs.themePanel.$_setField(fields[0]);
                    vm.$refs.themePanel.$_setDataType(vm.dataType);
                });
            }
            //将原图层opacity设置为0，而不是设置原图层的visibility，因为隐藏了某些时候queryRenderFeature会取不到数据
            this.map.setPaintProperty(this.layerIdCopy, this.dataType + "-opacity", 0);
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
            if (!this.map.getLayer(layerId)) {
                throw new Error(
                    "未找到该图层，请确认layerId：" +
                    layerId +
                    "是否正确，或图层是否存在！"
                );
            }
            let features;
            //从图层取得数据
            features = this.map.querySourceFeatures(this.source_Id);
            if (features.length === 0) {
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
            let layer = this.map.getLayer(layerId);
            this.source_Id = layer.source;
            this.source_layer_Id = layer.sourceLayer;
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
            } else {
                newColors = {
                    property: key,
                    stops: []
                };
                for (let i = 0; i < dataSourceCopy.length; i++) {
                    newColors.stops.push([dataSourceCopy[i], colors[i]]);
                    checkBoxArr.push(true);
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
        $_setRangeColors(color, dataSourceCopy, key, features) {
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
            let startRGB = this.$_colorRgb(startColor); //转换为rgb数组模式
            let startR = startRGB[0];
            let startG = startRGB[1];
            let startB = startRGB[2];

            let endRGB = this.$_colorRgb(endColor);
            let endR = endRGB[0];
            let endG = endRGB[1];
            let endB = endRGB[2];

            let sR = (endR - startR) / step; //总差值
            let sG = (endG - startG) / step;
            let sB = (endB - startB) / step;

            let colorArr = [];
            for (let i = 0; i < step; i++) {
                //计算每一步的hex值
                let hex = this.$_colorHex(
                    "rgb(" +
                    parseInt(sR * i + startR) +
                    "," +
                    parseInt(sG * i + startG) +
                    "," +
                    parseInt(sB * i + startB) +
                    ")"
                );
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
                    hex = hex < 10 ? 0 + "" + hex : hex; // 保证每个rgb的值为2位
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
                        numHex += aNum[i] + aNum[i];
                    }
                    return numHex;
                }
            } else {
                return _this;
            }
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
                        this.endData = dataSourceCopy[0] + 1;
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
        //添加专题图图层
        $_addUniqueLayer() {
            let paintColors = themeManager.getExtraData(
                this.layerIdCopy,
                this.themeType,
                this.dataType + "-color"
            );
            let layer;
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
                            "circle-stroke-width": 2,
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
                            "line-width": 2
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
            if (!this.map.getLayer(this.layerIdCopy + this.$_getThemeName())) {
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
                            "circle-stroke-width": 2,
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
                            "line-width": 2
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
            let vm = this;
            let img = new Image(128, 128);
            let iconFullName = vm.defaultIcon.split("/")[vm.defaultIcon.split("/").length - 1];
            let iconName = iconFullName.split(".")[0];
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-image", iconName);
            img.addEventListener("load", function () {
                let hasIcon = vm.map.hasImage(iconName), iconSize;
                if (!hasIcon) {
                    vm.map.addImage(iconName, img);
                }
                iconSize = vm.$_getIconSize(dataSource);
                //存储iconSize
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
            img.src = vm.defaultIcon;
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
            if (this.source_layer_Id) {
                textLayer["source-layer"] = this.source_layer_Id;
            }
            if (this.dataType === "line") {
                textLayer.layout["symbol-placement"] = "line";
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
        },
        //添加线图层
        $_addLineLayer() {
            let lineLayer = {
                id: this.layerIdCopy + this.$_getThemeName() + "_线",
                source: this.source_Id,
                type: "line",
                paint: {
                    "line-color": "#000000",
                    "line-opacity": 1,
                    "line-width": 2
                },
                layout: {}
            };
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
                            vm.selectValue = fields[0];
                            themeManager.initThemeProps(
                                vm.layerIdCopy,
                                vm.themeType,
                                vm.dataType,
                                fields[0]
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
                            paintColor = vm.$_setUniformColors("#EE4C5A", dataSource, field);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-color", paintColor);
                            break;
                        case "unique":
                            //重新取得数据
                            dataSource = vm.$_setDataSource(features, field, "unique");
                            //设置专题图颜色
                            paintColor = vm.$_setUniqueColors(vm.currentGradient, dataSource, field);
                            vm.$_setPaintPropertyToExtra(vm.layerIdCopy, vm.layerIdCopy + vm.$_getThemeName(), vm.dataType + "-color", paintColor);
                            break;
                        case "range":
                            //设置分段等级
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
                            let heatmapColor = vm.$_getHeatmapColors(gradientHeatColor[0].key);
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
                if (paintColor[2 + i * 2 + 1] >= startData && paintColor[2 + i * 2 + 1] < endData) {
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
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "circle-translate", [arr[0], -arr[1]]);
        },
        $_iconTranslateYChanged(translate) {
            let vm = this;
            this.$_setPaintProperty(this.layerIdCopy, this.layerIdCopy + this.$_getThemeName(), "icon-translate", translate, function (translate) {
                return vm.$_editTranslate(translate, 1);
            }, function (translate) {
                return vm.$_editTranslate(translate, 1);
            });
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "icon-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-translate", [arr[0], -arr[1]]);
        },
        $_lineTranslateYChanged(translate) {
            this.$_setTranslate(translate, 1);
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "line-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "line-translate", [arr[0], -arr[1]]);
        },
        $_fillTranslateYChanged(translate) {
            this.$_setTranslate(translate, 1);
            this.$_setOutLineTranslate(translate, 1);
            let arr = themeManager.getPanelProps(this.layerIdCopy, this.themeType, "fill-translate");
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "fill-translate", [arr[0], -arr[1]]);
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
            });
            themeManager.setPanelProps(this.layerIdCopy, this.themeType, "icon-url", url);
            img.src = url;
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
                    });
                    break;
            }
        },
        $_getStartEndData(index) {
            let dataSource = themeManager.getExtraData(this.layerIdCopy, this.themeType, "dataSource");
            let startData, endData;
            if (index === 0) {
                startData = themeManager.getExtraData(this.layerIdCopy, this.themeType, "startData");
                ;
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
            heatmapWeight.push(Number(datas[0]), 0);
            heatmapWeight.push(Number(datas[datas.length - 1]), 1);
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
            //权重不会影响效果，仅会影响点的数量
            let heatmapWeight = this.$_getWeightArr(dataSource);
            //颜色仅需平均分配，但是初始颜色要是浅色系，颜色从浅到深
            let heatmapColor = this.$_getHeatmapColors(gradientHeatColor[0].key);
            //半径比较重要，半径越大相对的渐变效果越宽，通视设置不同的缩放等级，会有模糊效果
            let heatmapRadius = this.$_getHeatmapRadius(40);
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
            if(originLayer.hasOwnProperty("paint") && originLayer.paint.hasOwnProperty(this.dataType + "-opacity")){
                opacity = originLayer.paint[this.dataType + "-opacity"];
            }
            this.map.setPaintProperty(layerId, this.dataType + "-opacity", opacity);
            this.$refs.themePanel.$_close();
            themeManager.setManagerProps(layerId, undefined);
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
        }
    }
};
