let switchOptions = [{
    type: "switch",
    title: "是否贴地",
    key: "enableClampToGround",
    value: false,
    fields: []
}, {
    type: "switch",
    title: "是否启用阴影",
    key: "enableShadows",
    value: false,
    fields: []
}];
let polygonOptions = [{
    type: "select",
    title: "表面材质",
    key: "materials",
    value: ["纯色","纯色1"]
},{
    type: "color",
    title: "颜色",
    key: "color",
    value: "#000000"
},{
    type: "slider",
    title: "透明度",
    key: "opacity",
    value: 1,
    min: 0,
    max: 1,
    step: 0.01
},{
    type: "inputNumber",
    title: "边线宽度",
    key: "outlineWidth",
    value: 1
},{
    type: "color",
    title: "边线颜色",
    key: "outlineColor",
    value: "#000000"
},{
    type: "slider",
    title: "边线透明度",
    key: "outlineOpacity",
    value: 1,
    min: 0,
    max: 1,
    step: 0.01
},...switchOptions];

let cubeOptions = [{
    type: "inputNumber",
    title: "长",
    key: "length",
    value: 100,
},{
    type: "inputNumber",
    title: "宽",
    key: "width",
    value: 100,
},{
    type: "inputNumber",
    title: "高",
    key: "height",
    value: 100,
},...polygonOptions]

let cylinderOptions = [{
    type: "inputNumber",
    title: "半径",
    key: "radius",
    value: 6,
},{
    type: "inputNumber",
    title: "高度",
    key: "height",
    value: 6,
},{
    type: "select",
    title: "表面材质",
    key: "materials",
    value: ["纯色","纯色1"]
},{
    type: "color",
    title: "颜色",
    key: "color",
    value: "#000000",
},{
    type: "inputNumber",
    title: "边线宽度",
    key: "outlineWidth",
    value: 1
},{
    type: "color",
    title: "边线颜色",
    key: "outlineColor",
    value: "#000000"
},...switchOptions];

let editOptions = {
    point: {
        type: "点",
        options: [{
            type: "inputNumber",
            title: "半径",
            key: "radius",
            value: 12
        }, {
            type: "color",
            title: "颜色",
            key: "color",
            value: "#d51b1b"
        }, {
            type: "slider",
            title: "透明度",
            key: "opacity",
            value: 1,
            min: 0,
            max: 1,
            step: 0.01
        }, {
            type: "inputNumber",
            title: "边线宽度",
            key: "outlineWidth",
            value: 3
        }, {
            type: "color",
            title: "边线颜色",
            key: "outlineColor",
            value: "#576aef"
        }, {
            type: "slider",
            title: "边线透明度",
            key: "outlineOpacity",
            value: 1,
            min: 0,
            max: 1,
            step: 0.01
        }]
    },
    marker: {
        type: "图标",
        options: [{
            type: "input",
            title: "图标路径",
            key: "url",
            value: "www.baidu.com"
        }, {
            type: "inputNumber",
            title: "图标比例",
            key: "scale",
            value: 1
        }, {
            type: "inputNumber",
            title: "图标宽度",
            key: "width",
            value: 30
        }, {
            type: "inputNumber",
            title: "图标高度",
            key: "height",
            value: 30
        }, {
            type: "collapse",
            title: "启用背景颜色",
            key: "enableBackgroundColor",
            value: false,
            fields: ["背景颜色"],
            height: 0,
            maxHeight: 50,
            options: [{
                type: "color",
                title: "背景颜色",
                key: "backgroundColor",
                value: "#FFFFFF"
            }]
        }, {
            type: "collapse",
            title: "启用文字",
            key: "enableText",
            value: false,
            fields: ["文字", "字体颜色", "字体大小", "x轴偏移", "Y轴偏移", "描边颜色", "描边宽度"],
            height: 0,
            maxHeight: 300,
            options: [ {
                type: "input",
                title: "文字",
                key: "text",
                value: "测试",
                show: "hide"
            }, {
                type: "color",
                title: "字体颜色",
                key: "fontColor",
                value: "#000000",
                show: "hide"
            }, {
                type: "inputNumber",
                title: "字体大小",
                key: "fontSize",
                value: 14,
                show: "hide"
            }, {
                type: "inputNumber",
                title: "x轴偏移",
                key: "offsetX",
                value: 0,
                show: "hide"
            }, {
                type: "inputNumber",
                title: "Y轴偏移",
                key: "offsetY",
                value: 0,
                show: "hide"
            }, {
                type: "color",
                title: "描边颜色",
                key: "outlineColor",
                value: "#FFFFFF",
                show: "hide"
            }, {
                type: "inputNumber",
                title: "描边宽度",
                key: "outlineWidth",
                value: 0,
                show: "hide"
            }]
        }]
    },
    text: {
        type: "文字",
        options: [
            {
                type: "input",
                title: "文字",
                key: "text",
                value: "测试",
            }, {
                type: "color",
                title: "字体颜色",
                key: "fontColor",
                value: "#000000",
            }, {
                type: "inputNumber",
                title: "字体大小",
                key: "fontSize",
                value: 14,
            }, {
                type: "inputNumber",
                title: "x轴偏移",
                key: "offsetX",
                value: 0,
            }, {
                type: "inputNumber",
                title: "Y轴偏移",
                key: "offsetY",
                value: 0,
            }, {
                type: "color",
                title: "描边颜色",
                key: "outlineColor",
                value: "#FFFFFF",
            }, {
                type: "inputNumber",
                title: "描边宽度",
                key: "outlineWidth",
                value: 0,
            }
        ]
    },
    line: {
        type: "直线",
        options: [{
            type: "inputNumber",
            title: "宽度",
            key: "width",
            value: 1
        },{
            type: "select",
            title: "表面材质",
            key: "materials",
            value: ["纯色","纯色1"]
        },{
            type: "color",
            title: "颜色",
            key: "color",
            value: "#000000"
        },...switchOptions]
    },
    curve: {
        type: "曲线",
        options: [{
            type: "inputNumber",
            title: "宽度",
            key: "width",
            value: 1
        },{
            type: "select",
            title: "表面材质",
            key: "materials",
            value: ["纯色","纯色1"]
        },{
            type: "color",
            title: "颜色",
            key: "color",
            value: "#000000"
        },...switchOptions]
    },
    polygon: {
        type: "多边形",
        options: polygonOptions
    },
    rectangle: {
        type: "矩形",
        options: polygonOptions
    },
    circle: {
        type: "圆",
        options: polygonOptions
    },
    cube: {
        type: "正方体",
        options: cubeOptions
    },
    cuboid: {
        type: "长方体",
        options: cubeOptions
    },
    polygonCube:  {
        type: "立体多边形",
        options: [{
            type: "inputNumber",
            title: "高",
            key: "height",
            value: 100,
        },...polygonOptions]
    },
    cylinder: {
        type: "圆柱体",
        options: cylinderOptions
    },
    cone: {
        type: "圆锥体",
        options: cylinderOptions
    },
    ellipsoid: {
        type: "球体",
        options: [{
            type: "inputNumber",
            title: "半径",
            key: "height",
            value: 100,
        },...polygonOptions]
    },
    model: {
        type: "模型",
        options: [{
            type: "input",
            title: "模型资源",
            key: "url",
            value: "www.baidu.com",
        },{
            type: "inputNumber",
            title: "模型大小",
            key: "scale",
            value: 1,
        },...switchOptions]
    }
}

export default editOptions;