class ZondyThemeManager {
    init(vueId) {
        this.vueId = vueId;
        if (!window.ZondyThemeManager) {
            window.ZondyThemeManager = {};
        }
        if (!window.ZondyThemeManager[this.vueId]) {
            window.ZondyThemeManager[this.vueId] = {};
        }
    }

    /**
     * 初始化一个layer存储对象
     * @param layerId 原始图层名称，不是专题图名称
     * */
    initLayerProps(layerId) {
        window.ZondyThemeManager[this.vueId][layerId] = {};
    }

    /**
     * 初始化一个专题图面板存储对象
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param dataType 数据几何类型
     * @param field 字段值
     * */
    initThemeProps(layerId, themeType, dataType, field) {
        this.field = field;
        if (!window.ZondyThemeManager[this.vueId][layerId].panelProps) {
            window.ZondyThemeManager[this.vueId][layerId].panelProps = {};
        }
        if (!window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType]) {
            window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType] = {};
        }
        if (
            !window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                field
                ]
        ) {
            window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                field
                ] = {};
        }
        if (themeType === "heatmap") {
            window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                field
                ] = {
                "heatmap-opacity": 100,
                "heatmap-radius": 40,
                "heatmap-gradient": 0,
                "heatmap-colors": [{
                    key: "0",
                    value: "#C1D2EF"
                }, {
                    key: "1",
                    value: "#86FD86"
                }, {
                    key: "2",
                    value: "#ECFD43"
                }, {
                    key: "3",
                    value: "#FEB028"
                }, {
                    key: "4",
                    value: "#FF0000"
                }]
            }
        } else if (themeType === "symbol") {
            window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                field
                ] = {
                "icon-image": "basic",
                "icon-opacity": 100,
                "icon-translate": [0, 0],
                "icon-url": "assets/svg/theme/basic/basic.svg",
                "text-field": "{未设置}",
                "text-size": 12,
                "text-letter-spacing": 0.05,
                "text-offset": [0, 0],
                "text-font": "宋体",
                "text-rotate": 0,
                "text-color": "#000000",
                "text-halo-color": "#FFFFFF",
                "text-halo-width": 0,
            }
        } else {
            switch (dataType) {
                case "circle":
                    window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                        field
                        ] = {
                        "gradient-color":
                            "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
                        "circle-radius": 6,
                        "circle-opacity": 100,
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#000000",
                        "circle-stroke-opacity": 100,
                        "circle-translate": [0, 0],
                        "icon-opacity": 100,
                        "icon-translate": [0, 0],
                        "text-field": "{未设置}",
                        "text-size": 12,
                        "text-letter-spacing": 0.05,
                        "text-offset": [0, 0],
                        "text-font": "宋体",
                        "text-rotate": 0,
                        "text-color": "#000000",
                        "text-halo-color": "#FFFFFF",
                        "text-halo-width": 0,
                    };
                    break;
                case "line":
                    window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                        field
                        ] = {
                        "gradient-color":
                            "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
                        "line-width": 3,
                        "line-opacity": 100,
                        "line-translate": [0, 0]
                    };
                    break;
                case "fill":
                    window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
                        field
                        ] = {
                        "gradient-color":
                            "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
                        "fill-color": "#FFFFFF",
                        "fill-pattern": undefined,
                        "fill-opacity": 100,
                        "fill-translate": [0, 0],
                        "fill-outline-color": "#000000",
                        "fill-outline-width": 3,
                        "fill-outline-opacity": 100,
                        "text-field": "{未设置}",
                        "text-size": 12,
                        "text-letter-spacing": 0.05,
                        "text-offset": [0, 0],
                        "text-font": "宋体",
                        "text-rotate": 0,
                        "text-color": "#000000",
                        "text-halo-color": "#FFFFFF",
                        "text-halo-width": 0,
                    };
                    break;
            }
        }
    }

    /**
     * 初始化一个专题图额外存储对象
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param field 字段值
     * */
    initExtraData(layerId, themeType, field) {
        if (!window.ZondyThemeManager[this.vueId][layerId].extraData) {
            window.ZondyThemeManager[this.vueId][layerId].extraData = {};
        }
        if (!window.ZondyThemeManager[this.vueId][layerId].extraData[themeType]) {
            window.ZondyThemeManager[this.vueId][layerId].extraData[themeType] = {};
        }
        if (
            !window.ZondyThemeManager[this.vueId][layerId].extraData[themeType][
                field
                ]
        ) {
            window.ZondyThemeManager[this.vueId][layerId].extraData[themeType][
                field
                ] = {};
        }
    }

    /**
     * 设置专题图额外存储数据
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param key 变量名
     * @param value 变量值
     * */
    setExtraData(layerId, themeType, key, value) {
        window.ZondyThemeManager[this.vueId][layerId].extraData[themeType][
            this.field
            ][key] = value;
    }

    /**
     * 取得专题图额外存储数据
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param key 变量名
     * @return value 变量值
     * */
    getExtraData(layerId, themeType, key) {
        return window.ZondyThemeManager[this.vueId][layerId].extraData[themeType][this.field][key];
    }

    getExtraDataByField(layerId, themeType, key, field) {
        return window.ZondyThemeManager[this.vueId][layerId].extraData[themeType][field][key];
    }

    /**
     * 设置图层级别的参数
     * @param layerId 原始图层名称，不是专题图名称
     * @param key 变量名
     * @param value 变量值
     * */
    setLayerProps(layerId, key, value) {
        window.ZondyThemeManager[this.vueId][layerId][key] = value;
    }

    /**
     * 设置管理器级别的参数
     * @param key 变量名
     * @param value 变量值
     * */
    setManagerProps(key, value) {
        window.ZondyThemeManager[this.vueId][key] = value;
    }

    getManagerProps(key) {
        return window.ZondyThemeManager[this.vueId][key];
    }

    /**
     * 取得图层级别的参数
     * @param layerId 原始图层名称，不是专题图名称
     * @param key 变量名
     * @return layerProps 取得的变量
     * */
    getLayerProps(layerId, key) {
        return window.ZondyThemeManager[this.vueId][layerId][key];
    }

    /**
     * 保存图层参数
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param key 变量名
     * @param value 变量值
     * */
    setPanelProps(layerId, themeType, key, value) {
        window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
            this.field
            ][key] = value;
    }

    /**
     * 取得图层参数
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param key 变量名
     * @return props 图层参数
     * */
    getPanelProps(layerId, themeType, key) {
        return window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
            this.field
            ][key];
    }

    getPanelPropsByField(layerId, themeType, key, field) {
        return window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType][
            field
            ][key];
    }

    getSelectField(layerId, themeType) {
        return window.ZondyThemeManager[this.vueId][layerId].extraData[themeType] ? window.ZondyThemeManager[this.vueId][layerId].extraData[themeType]["selectField"] : undefined;
    }

    setSelectField(layerId, themeType, value) {
        return window.ZondyThemeManager[this.vueId][layerId].extraData[themeType]["selectField"] = value;
    }

    /**
     * 取得所有面板参数
     * @param layerId 原始图层名称，不是专题图名称
     * @param themeType 专题图类型
     * @param field 变量名
     * @return props 所有图层参数
     * */
    getPanelByField(layerId, themeType, field) {
        let values = window.ZondyThemeManager[this.vueId][layerId].panelProps[themeType];
        if (values) {
            return values[field];
        } else {
            return undefined;
        }
    }

    /**
     * 取得所有的layerId，无序的ID
     * @return ids 所有的无序ID数组
     * */
    getAllLayerId() {
        let ids = [],
            that = this;
        Object.keys(window.ZondyThemeManager[that.vueId]).forEach(function (key) {
            if (window.ZondyThemeManager[that.vueId].hasOwnProperty(key)) {
                ids = ids.concat(window.ZondyThemeManager[that.vueId][key].layerOrder);
            }
        });
        return ids;
    }

    setLayerPaintProperty(layerId, themeId, key, value) {
        window.ZondyThemeManager[this.vueId][layerId][themeId].paint[key] = value;
    }

    setLayerLayoutProperty(layerId, themeId, key, value) {
        window.ZondyThemeManager[this.vueId][layerId][themeId].layout[key] = value;
    }

    getAllLayer() {
        return window.ZondyThemeManager;
    }

    setAllLayer(manager) {
        window.ZondyThemeManager = manager;
        this.vueId = Object.keys(manager)[0];
    }

    getLayerOrder() {
        return window.ZondyThemeManager[this.vueId]["layerOrder"];
    }

    getLayerOrderById(layerId) {
        try {
            return window.ZondyThemeManager[this.vueId][layerId]["layerOrder"];
        }catch (e){
            return undefined;
        }
    }

    getThemeTypeById(layerId) {
        try {
            return window.ZondyThemeManager[this.vueId][layerId]["themeType"];
        }catch (e){
            return undefined;
        }
    }

    getLayerNameArr() {
        return window.ZondyThemeManager[this.vueId]["layerNameArr"];
    }

    getSourceId(layerId) {
        return window.ZondyThemeManager[this.vueId][layerId][layerId].source;
    }

    getLayer(layerId, themeId) {
        return window.ZondyThemeManager[this.vueId][layerId][themeId];
    }

    hasManager(layerId) {
        if (window.ZondyThemeManager[this.vueId][layerId]) {
            return true;
        }
        return false;
    }

    constructor() {
        this.vueId = undefined;
    }
}

export default ZondyThemeManager;
