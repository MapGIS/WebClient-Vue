import {
    pointPaintList,
    linePaintList,
    lineLayoutList,
    fillPaintList,
    fillLayoutList,
    outlinePaintList,
    textPaintList,
    textLayoutList,
    symbolPaintList,
    symbolLayoutList
} from "./mappingList"

export function formatStyleToLayer(style, themeType, dataType, layerId) {
    let layers = {};
    switch (themeType) {
        case "unique":
            layers = getLayerFromStyle(style, dataType, layerId);
            break;
        case "range":
            layers = getLayerFromStyle(style, dataType, layerId);
            break;
        case "symbol":
            layers = getLayerFromSymbolStyle(style, layerId);
            break;
    }
    return layers;
}

export function getLayerFromSymbolStyle(style, layerId) {
    let layers = {}
    let themeLayer = {
        paint: {
            "icon-translate": [0, 0]
        },
        layout: {}
    };
    themeLayer.id = layerId || "test";
    Object.keys(style).forEach(function (key) {
        if (symbolPaintList.hasOwnProperty(key)) {
            if (key === "xOffset") {
                themeLayer.paint["icon-translate"][0] = style[key];
            } else if (key === "yOffset") {
                themeLayer.paint["icon-translate"][1] = style[key] * -1;
            } else {
                themeLayer.paint[symbolPaintList[key]] = style[key];
            }
        }
        if (symbolLayoutList.hasOwnProperty(key)) {
            themeLayer.layout[symbolLayoutList[key]] = style[key];
        }
    });
    layers.themeLayer = themeLayer;
    return layers;
}

export function getLayerFromTextStyle(style) {
    let textLayer = {
        paint: {},
        layout: {
            "text-offset": [0, 0]
        }
    };
    Object.keys(style).forEach(function (key) {
        if (textPaintList.hasOwnProperty(key)) {
            textLayer.paint[textPaintList[key]] = style[key];
        }
        if (textLayoutList.hasOwnProperty(key)) {
            if (key === "field") {
                textLayer.layout[textLayoutList[key]] = "{" + style[key] + "}";
            } else if (key === "fontFamily") {
                textLayer.layout[textLayoutList[key]] = [style[key], style[key]];
            } else if (key === "xOffset") {
                textLayer.layout["text-offset"][0] = style[key];
            } else if (key === "yOffset") {
                textLayer.layout["text-offset"][1] = style[key] * -1;
            } else {
                textLayer.layout[textLayoutList[key]] = style[key];
            }
        }
    });
    return textLayer;
}

export function getLayerFromStyle(style, dataType, layerId) {
    let layers = {}
    let themeLayer = {
        paint: {},
        layout: {}
    }, symbolLayer = {
        paint: {
            "icon-translate": [0, 0],
            "text-translate": [0, 0],
        },
        layout: {}
    };
    themeLayer.id = layerId || "test";
    switch (dataType) {
        case "circle":
            Object.keys(style).forEach(function (key) {
                if (pointPaintList.hasOwnProperty(key)) {
                    if (key === "color") {
                        if (typeof pointPaintList[key] === "string") {
                            let colors = style[key].split(",");
                            if (colors.length === 1) {
                                themeLayer.paint[pointPaintList[key]] = style[key];
                            }
                        }
                    } else {
                        themeLayer.paint[pointPaintList[key]] = style[key];
                    }
                }
                if (symbolPaintList.hasOwnProperty(key)) {
                    if (key === "xOffset") {
                        symbolLayer.paint[symbolPaintList[key]] = [style[key], symbolLayer.paint[symbolPaintList[key]][1]];
                    } else if (key === "yOffset") {
                        symbolLayer.paint[symbolPaintList[key]] = [symbolLayer.paint[symbolPaintList[key]][1], -style[key]];
                    } else {
                        symbolLayer.paint[symbolPaintList[key]] = symbolLayer.paint[symbolPaintList[key]];
                    }
                }
                if (symbolLayoutList.hasOwnProperty(key)) {
                    symbolLayer.layout[symbolLayoutList[key]] = style[key];
                }
            });
            break;
        case "line":
            Object.keys(style).forEach(function (key) {
                if (linePaintList.hasOwnProperty(key)) {
                    if (key === "color") {
                        if (typeof linePaintList[key] === "string") {
                            let colors = style[key].split(",");
                            if (colors.length === 1) {
                                themeLayer.paint[linePaintList[key]] = style[key];
                            }
                        }
                    } else {
                        themeLayer.paint[linePaintList[key]] = style[key];
                    }
                }
                if (lineLayoutList.hasOwnProperty(key)) {
                    themeLayer.layout[lineLayoutList[key]] = style[key];
                }
                if (symbolPaintList.hasOwnProperty(key)) {
                    if (key === "xOffset") {
                        symbolLayer.paint[symbolPaintList[key]] = [style[key], symbolLayer.paint[symbolPaintList[key]][1]];
                    } else if (key === "yOffset") {
                        symbolLayer.paint[symbolPaintList[key]] = [symbolLayer.paint[symbolPaintList[key]][1], -style[key]];
                    } else {
                        symbolLayer.paint[symbolPaintList[key]] = symbolLayer.paint[symbolPaintList[key]];
                    }
                }
                if (symbolLayoutList.hasOwnProperty(key)) {
                    symbolLayer.layout[symbolLayoutList[key]] = style[key];
                }
            });
            break;
        case "fill":
            let outlineLayer = {
                paint: {},
                layout: {}
            };
            Object.keys(style).forEach(function (key) {
                if (fillPaintList.hasOwnProperty(key)) {
                    if (key === "color") {
                        if (typeof fillPaintList[key] === "string") {
                            let colors = style[key].split(",");
                            if (colors.length === 1) {
                                themeLayer.paint[fillPaintList[key]] = style[key];
                            }
                        }
                    } else {
                        themeLayer.paint[fillPaintList[key]] = style[key];
                    }
                }
                if (fillLayoutList.hasOwnProperty(key)) {
                    themeLayer.layout[fillLayoutList[key]] = style[key];
                }
                if (outlinePaintList.hasOwnProperty(key)) {
                    outlineLayer.paint[outlinePaintList[key]] = style[key];
                }
                if (outlinePaintList.hasOwnProperty(key)) {
                    outlineLayer.layout[outlinePaintList[key]] = style[key];
                }
                if (symbolPaintList.hasOwnProperty(key)) {
                    if (key === "xOffset") {
                        symbolLayer.paint[symbolPaintList[key]] = [style[key], symbolLayer.paint[symbolPaintList[key]][1]];
                    } else if (key === "yOffset") {
                        symbolLayer.paint[symbolPaintList[key]] = [symbolLayer.paint[symbolPaintList[key]][1], -style[key]];
                    } else {
                        symbolLayer.paint[symbolPaintList[key]] = symbolLayer.paint[symbolPaintList[key]];
                    }
                }
                if (symbolLayoutList.hasOwnProperty(key)) {
                    symbolLayer.layout[symbolLayoutList[key]] = style[key];
                }
                if (textPaintList.hasOwnProperty(key)) {
                    if (key === "xOffset") {
                        symbolLayer.paint[textPaintList[key]] = [style[key], symbolLayer.paint[textPaintList[key]][1]];
                    } else if (key === "yOffset") {
                        symbolLayer.paint[textPaintList[key]] = [symbolLayer.paint[textPaintList[key]][1], -style[key]];
                    } else {
                        symbolLayer.paint[textPaintList[key]] = symbolLayer.paint[textPaintList[key]];
                    }
                }
                if (textLayoutList.hasOwnProperty(key)) {
                    symbolLayer.layout[textLayoutList[key]] = style[key];
                }
            });
            layers.outlineLayer = outlineLayer;
            break;
    }
    layers.themeLayer = themeLayer;
    layers.symbolLayer = symbolLayer;
    return layers;
}

export function formatInterpolate(isString, dataSource, key, value) {
    let interpolate;
    if (isString) {
        interpolate = ["match", ["get", key]];
        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i] !== "") {
                interpolate.push(dataSource[i]);
                interpolate.push(value);
            }
        }
        interpolate.push(value);
    }
    return interpolate;
}



