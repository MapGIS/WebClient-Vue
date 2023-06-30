let editList = {
  label: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInput",
      title: "文本",
      key: "text",
      value: "无标题"
    },
    {
      type: "MapgisUiSelect",
      title: "字体",
      key: "fontFamily",
      value: "微软雅黑",
      dataSource: [
        {
          key: "微软雅黑",
          value: "微软雅黑"
        },
        {
          key: "宋体",
          value: "宋体"
        },
        {
          key: "楷体",
          value: "楷体"
        },
        {
          key: "隶书",
          value: "隶书"
        },
        {
          key: "黑体",
          value: "黑体"
        },
        {
          key: "新宋体",
          value: "新宋体"
        },
        {
          key: "华文行楷",
          value: "华文行楷"
        },
        {
          key: "sans-serif",
          value: "sans-serif"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "字体大小",
      key: "fontSize",
      value: 30
    },
    {
      type: "MapgisUiColorPicker",
      title: "字体颜色",
      key: "fontColor",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiShowOutline",
      title: "边线设置",
      key: "showOutline",
      value: false
    },
    {
      type: "MapgisUiInputNumber",
      title: "边线宽度",
      key: "outlineWidth",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "边线颜色",
      value: "#F04155",
      key: "outlineColor"
    },
    {
      type: "MapgisUiSlider",
      title: "边线透明度",
      key: "outlineOpacity",
      value: 100
    },
    {
      type: "MapgisUiShowBackground",
      title: "背景设置",
      key: "showBackground",
      value: true
    },
    {
      type: "MapgisUiColorPicker",
      title: "背景颜色",
      value: "#F04155",
      key: "backgroundColor"
    },
    {
      type: "MapgisUiSlider",
      title: "背景明度",
      key: "backgroundOpacity",
      value: 0
    },
    {
      type: "MapgisUiInputNumber",
      title: "背景边距",
      key: "backgroundPadding",
      value: 5
    },
    {
      type: "MapgisUiSelect",
      title: "水平位置",
      key: "horizontalOrigin",
      value: 0,
      dataSource: [
        {
          key: 1,
          value: "靠左"
        },
        {
          key: 0,
          value: "居中"
        },
        {
          key: -1,
          value: "靠右"
        }
      ]
    },
    {
      type: "MapgisUiSelect",
      title: "垂直位置",
      key: "verticalOrigin",
      value: 1,
      dataSource: [
        {
          key: -1,
          value: "居上"
        },
        {
          key: 0,
          value: "居中"
        },
        {
          key: 1,
          value: "居下"
        }
      ]
    }
  ],
  // billboard: [
  //   {
  //     type: "MapgisUiInput",
  //     title: "标题",
  //     key: "title",
  //     value: "无标题",
  //   },
  //   {
  //     type: "MapgisUiInput",
  //     title: "图片",
  //     key: "image",
  //     value:
  //       "data:image/png;base64,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",
  //   },
  //   {
  //     type: "MapgisUiColorPicker",
  //     title: "颜色",
  //     key: "color",
  //     value: "#FFFFFF",
  //   },
  //   {
  //     type: "MapgisUiSlider",
  //     title: "透明度",
  //     key: "opacity",
  //     value: 100,
  //   },
  //   {
  //     type: "MapgisUiInputNumber",
  //     title: "图片宽度",
  //     key: "width",
  //     value: 40,
  //   },
  //   {
  //     type: "MapgisUiInputNumber",
  //     title: "图片高度",
  //     key: "height",
  //     value: 40,
  //   },
  //   {
  //     type: "MapgisUiInputNumber",
  //     title: "离地高度",
  //     key: "offsetHeight",
  //     value: 0,
  //   },
  // ],
  point: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "半径",
      key: "pixelSize",
      value: 20
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiShowOutline",
      title: "边线设置",
      key: "showOutline",
      value: false
    },
    {
      type: "MapgisUiInputNumber",
      title: "边线宽度",
      key: "outlineWidth",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "边线颜色",
      key: "outlineColor",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "边线透明度",
      key: "outlineOpacity",
      value: 100
    }
  ],
  polyline: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiSelect",
      title: "填充类型",
      key: "materialType",
      value: "Color",
      dataSource: [
        {
          key: "Color",
          value: "实线"
        },
        {
          key: "PolylineDash",
          value: "虚线"
        },
        {
          key: "PolylineArrow",
          value: "箭头"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "线宽",
      key: "width",
      value: 10
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiSwitch",
      title: "是否为曲线",
      key: "isHermiteSpline",
      value: false
    },
    {
      type: "MapgisUiLoop",
      title: "是否闭环",
      key: "loop",
      value: false
    },
    // elevationMode表示Cesium.ClassificationType的值
    // 2:Cesium.ClassificationType.BOTH,贴地形/模型表面
    // 0:Cesium.ClassificationType.TERRAIN,贴地形表面
    // 1:Cesium.ClassificationType.CESIUM_3D_TILE,贴模型表面
    // -1:undefined,绝对高度
    {
      type: "MapgisUiSelect",
      title: "高程类型",
      key: "elevationMode",
      value: 2,
      dataSource: [
        {
          key: 2,
          value: "贴地形/模型表面"
        },
        {
          key: 0,
          value: "贴地形表面"
        },
        {
          key: 1,
          value: "贴模型表面"
        },
        {
          key: -1,
          value: "绝对高度"
        }
      ]
    }
  ],
  polylineVolume: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "半径",
      key: "width",
      value: 10
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiSelect",
      title: "拐角类型",
      key: "cornerType",
      value: 0,
      dataSource: [
        {
          key: 0,
          value: "圆角"
        },
        {
          key: 1,
          value: "方角"
        },
        {
          key: 2,
          value: "斜边角"
        }
      ]
    }
  ],
  corridor: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "宽度",
      key: "width",
      value: 10
    },
    {
      type: "MapgisUiInputNumber",
      title: "墙体高度",
      key: "extrudedHeight",
      value: 100
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiSelect",
      title: "拐角类型",
      key: "cornerType",
      value: 0,
      dataSource: [
        {
          key: "圆角",
          value: 0
        },
        {
          key: "方角",
          value: 1
        },
        {
          key: "斜边角",
          value: 2
        }
      ]
    }
  ],
  curve: [
    {
      type: "MapgisUiInput",
      title: "标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "线宽"
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度"
    },
    {
      type: "MapgisUiColorPicker",
      title: "背景颜色"
    },
    {
      type: "MapgisUiSelect",
      title: "类型",
      dataSource: [
        {
          key: "实线",
          value: "实线"
        },
        {
          key: "虚线",
          value: "虚线"
        },
        {
          key: "箭头",
          value: "箭头"
        }
      ]
    }
  ],
  polygonCube: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "高度",
      key: "extrudedHeight",
      value: 40
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    }
  ],
  polygon: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiSelect",
      title: "填充类型",
      key: "materialType",
      value: "Color",
      dataSource: [
        {
          key: "Color",
          value: "纯色"
        },
        {
          key: "Image",
          value: "图片"
        },
        {
          key: "flash",
          value: "闪烁"
        }
      ]
    },
    {
      type: "MapgisUiInput",
      title: "图片",
      key: "image",
      value: ""
    },
    {
      type: "MapgisUiInputNumber",
      title: "X轴重复",
      key: "repeatX",
      value: 1
    },
    {
      type: "MapgisUiInputNumber",
      title: "Y轴重复",
      key: "repeatY",
      value: 1
    },
    {
      type: "MapgisUiInputNumber",
      title: "纹理旋转角",
      key: "stRotation",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiSelect",
      title: "高程类型",
      key: "elevationMode",
      value: 2,
      dataSource: [
        {
          key: 2,
          value: "贴地形/模型表面"
        },
        {
          key: 0,
          value: "贴地形表面"
        },
        {
          key: 1,
          value: "贴模型表面"
        },
        {
          key: -1,
          value: "绝对高度"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiInputNumber",
      title: "透明度",
      key: "flashAlpha",
      value: 0.5
    },
    {
      type: "MapgisUiInputNumber",
      title: "闪烁步长",
      key: "alphaSpace",
      value: 0.05
    },
    {
      type: "MapgisUiInputNumber",
      title: "闪烁时间",
      key: "flashTime",
      value: 4000
    }
  ],
  rectangle: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInput",
      title: "文本",
      key: "rectangleText",
      value: "无标题"
    },
    {
      type: "MapgisUiSelect",
      title: "填充类型",
      key: "materialType",
      value: "Color",
      dataSource: [
        {
          key: "Color",
          value: "纯色"
        },
        {
          key: "Image",
          value: "图片"
        },
        {
          key: "text",
          value: "文字"
        }
      ]
    },
    {
      type: "MapgisUiInput",
      title: "图片",
      key: "image",
      value: ""
    },
    {
      type: "MapgisUiInputNumber",
      title: "X轴重复",
      key: "repeatX",
      value: 1
    },
    {
      type: "MapgisUiInputNumber",
      title: "Y轴重复",
      key: "repeatY",
      value: 1
    },
    {
      type: "MapgisUiInputNumber",
      title: "纹理旋转角",
      key: "stRotation",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiSelect",
      title: "高程类型",
      key: "elevationMode",
      value: 2,
      dataSource: [
        {
          key: 2,
          value: "贴地形/模型表面"
        },
        {
          key: 0,
          value: "贴地形表面"
        },
        {
          key: 1,
          value: "贴模型表面"
        },
        {
          key: -1,
          value: "绝对高度"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiSelect",
      title: "字体",
      key: "rtFontFamily",
      value: "微软雅黑",
      dataSource: [
        {
          key: "微软雅黑",
          value: "微软雅黑"
        },
        {
          key: "宋体",
          value: "宋体"
        },
        {
          key: "楷体",
          value: "楷体"
        },
        {
          key: "隶书",
          value: "隶书"
        },
        {
          key: "黑体",
          value: "黑体"
        },
        {
          key: "sans-serif",
          value: "sans-serif"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "字体大小",
      key: "rtFontSize",
      value: 30
    },
    {
      type: "MapgisUiColorPicker",
      title: "背景颜色",
      key: "rtBackgroundColor",
      value: "#FFFFFF"
    },
    {
      type: "MapgisUiSlider",
      title: "背景明度",
      key: "rtBackgroundOpacity",
      value: 0
    }
  ],
  circle: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "半径",
      key: "radius",
      value: 20
    },
    {
      type: "MapgisUiSelect",
      title: "填充类型",
      key: "materialType",
      value: "Color",
      dataSource: [
        {
          key: "Color",
          value: "纯色"
        },
        {
          key: "RadarMaterial",
          value: "雷达波"
        },
        {
          key: "CircleWaveMaterial",
          value: "动态圆波"
        }
      ]
    },
    {
      type: "MapgisUiSelect",
      title: "高程类型",
      key: "elevationMode",
      value: 2,
      dataSource: [
        {
          key: 2,
          value: "贴地形/模型表面"
        },
        {
          key: 0,
          value: "贴地形表面"
        },
        {
          key: 1,
          value: "贴模型表面"
        },
        {
          key: -1,
          value: "绝对高度"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "材质颜色",
      key: "materialColor",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "材质透明度",
      key: "materialOpacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "速度",
      key: "speed",
      value: 1
    },
    {
      type: "MapgisUiInputNumber",
      title: "动画时间",
      key: "duration",
      value: 2000
    },
    {
      type: "MapgisUiInputNumber",
      title: "倾斜度",
      key: "gradient",
      value: 0.5
    },
    {
      type: "MapgisUiInputNumber",
      title: "圆波数量",
      key: "count",
      value: 4
    }
  ],
  square: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "高度",
      key: "extrudedHeight",
      value: 100
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    }
  ],
  box: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "盒子模型"
    },
    {
      type: "MapgisUiInputNumber",
      title: "盒子高度",
      key: "extrudedHeight",
      value: 40
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "填充颜色",
      key: "color",
      value: "#FF0000"
    },
    {
      type: "MapgisUiSlider",
      title: "填充透明度",
      key: "opacity",
      value: 100
    }
  ],
  cylinder: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "顶部半径",
      key: "topRadius",
      value: 0
    },
    {
      type: "MapgisUiInputNumber",
      title: "底部半径",
      key: "bottomRadius",
      value: 0
    },
    {
      type: "MapgisUiInputNumber",
      title: "圆锥高度",
      key: "extrudedHeight",
      value: 0
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    }
  ],
  cone: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "半径",
      key: "radius",
      value: 20
    },
    {
      type: "MapgisUiInputNumber",
      title: "圆柱高度",
      key: "extrudedHeight",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    }
  ],
  ellipsoid: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "X半径",
      key: "radiusX",
      value: 20
    },
    {
      type: "MapgisUiInputNumber",
      title: "Y半径",
      key: "radiusY",
      value: 20
    },
    {
      type: "MapgisUiInputNumber",
      title: "Z半径",
      key: "radiusZ",
      value: 20
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "填充颜色",
      key: "color",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "填充透明度",
      key: "opacity",
      value: 100
    }
  ],
  model: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInput",
      title: "URL",
      key: "url",
      value: "http://localhost:8080/assets/glb/tree4.glb"
    },
    {
      type: "MapgisUiInputNumber",
      title: "比例尺",
      key: "scale",
      value: 1
    }
  ],
  wall: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiSelect",
      title: "填充类型",
      key: "materialType",
      value: "Color",
      dataSource: [
        {
          key: "Color",
          value: "纯色"
        },
        {
          key: "PolylineTrailLink",
          value: "流动纹理"
        }
      ]
    },
    {
      type: "MapgisUiColorPicker",
      title: "材质颜色",
      key: "linkColor",
      value: "#FFFFFF"
    },
    {
      type: "MapgisUiColorPicker",
      title: "材质颜色",
      key: "materialColor",
      value: "#F04155"
    },
    {
      type: "MapgisUiSlider",
      title: "材质透明度",
      key: "materialOpacity",
      value: 100
    },
    {
      type: "MapgisUiInput",
      title: "材质贴图",
      key: "image",
      value: ""
    },
    {
      type: "MapgisUiInputNumber",
      title: "动画时间",
      key: "duration",
      value: 2000
    },
    {
      type: "MapgisUiSelect",
      title: "流动方向",
      key: "direction",
      value: 1,
      dataSource: [
        {
          key: 1,
          value: "从左到右"
        },
        {
          key: 2,
          value: "从右到左"
        },
        {
          key: 3,
          value: "从上到下"
        },
        {
          key: 4,
          value: "从下到上"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "墙体高度",
      key: "extrudedHeight",
      value: 100
    },
    {
      type: "MapgisUiLoop",
      title: "是否闭环",
      key: "loop",
      value: false
    }
  ],
  marker: [
    {
      type: "MapgisUiInput",
      title: "标题",
      key: "title",
      value: "无标题"
    },
    {
      type: "MapgisUiInput",
      title: "图片",
      key: "image",
      value:
        "data:image/png;base64,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"
    },
    {
      type: "MapgisUiInputNumber",
      title: "图片宽度",
      key: "width",
      value: 40
    },
    {
      type: "MapgisUiInputNumber",
      title: "图片高度",
      key: "height",
      value: 40
    },
    {
      type: "MapgisUiInput",
      title: "文本",
      key: "text",
      value: ""
    },
    {
      type: "MapgisUiSelect",
      title: "字体",
      key: "fontFamily",
      value: "微软雅黑",
      dataSource: [
        {
          key: "微软雅黑",
          value: "微软雅黑"
        },
        {
          key: "宋体",
          value: "宋体"
        },
        {
          key: "楷体",
          value: "楷体"
        },
        {
          key: "隶书",
          value: "隶书"
        },
        {
          key: "黑体",
          value: "黑体"
        },
        {
          key: "sans-serif",
          value: "sans-serif"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "字体大小",
      key: "fontSize",
      value: 30
    },
    {
      type: "MapgisUiColorPicker",
      title: "字体颜色",
      key: "fontColor",
      value: "#F04155"
    },
    {
      type: "MapgisUiSelect",
      title: "文字相对图片位置",
      key: "labelPlaceType",
      value: "topCenter",
      dataSource: [
        {
          key: "topLeft",
          value: "靠上靠左"
        },
        {
          key: "topCenter",
          value: "靠上居中"
        },
        {
          key: "topRight",
          value: "靠上靠右"
        },

        {
          key: "centerLeft",
          value: "垂直居中靠左"
        },
        {
          key: "center",
          value: "垂直水平居中"
        },
        {
          key: "centerRight",
          value: "垂直居中靠右"
        },

        {
          key: "bottomLeft",
          value: "底部靠左"
        },
        {
          key: "bottomCenter",
          value: "底部居中"
        },
        {
          key: "bottomRight",
          value: "底部靠右"
        },

        {
          key: "leftTop",
          value: "左边靠上"
        },
        {
          key: "leftCenter",
          value: "左边居中"
        },
        {
          key: "leftBottom",
          value: "左边靠下"
        },

        {
          key: "rightTop",
          value: "右边靠上"
        },
        {
          key: "rightCenter",
          value: "右边居中"
        },
        {
          key: "rightBottom",
          value: "右边靠下"
        }
      ]
    },
    {
      type: "MapgisUiInputNumber",
      title: "文字相对图片间隔",
      key: "labelPadding",
      value: 20
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "offsetHeight",
      value: 10
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    }
  ]
};

export default editList;
