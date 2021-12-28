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
      value: "#000000"
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
      key: "height",
      value: 0
    },
    {
      type: "MapgisUiShowOutline",
      title: "是否显示边线",
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
      value: "#000000",
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
      title: "是否显示背景",
      key: "showBackground",
      value: false
    },
    {
      type: "MapgisUiColorPicker",
      title: "背景颜色",
      value: "#000000",
      key: "backgroundColor"
    },
    {
      type: "MapgisUiSlider",
      title: "背景明度",
      key: "backgroundOpacity",
      value: 20
    },
    {
      type: "MapgisUiInputNumber",
      title: "背景边距",
      key: "backgroundPadding",
      value: 5
    }
  ],
  billboard: [
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
      value: "https://img0.baidu.com/it/u=3119542616,1165410720&fm=26&fmt=auto"
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#FFFFFF"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "图片宽度",
      key: "width",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "图片高度",
      key: "height",
      value: 100
    }
  ],
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
      value: "#000000"
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
      key: "height",
      value: 0
    },
    {
      type: "MapgisUiShowOutline",
      title: "是否显示边线",
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
      value: "#000000"
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
          key: "实线",
          value: "Color"
        },
        {
          key: "虚线",
          value: "PolylineDash"
        },
        {
          key: "箭头",
          value: "PolylineArrow"
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
      value: "#000000"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "opacity",
      value: 100
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
      value: "#000000"
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
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "height",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#000000"
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
      value: "#000000"
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
      value: 500
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "height",
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
      dataSource: [
        {
          key: "纯色",
          value: "纯色"
        },
        {
          key: "网格",
          value: "网格"
        },
        {
          key: "条纹",
          value: "条纹"
        },
        {
          key: "图片",
          value: "图片"
        }
      ]
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#000000"
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
      key: "height",
      value: 0
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
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#000000"
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
      key: "height",
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
          key: "纯色",
          value: "Color"
        },
        {
          key: "雷达波",
          value: "RadarMaterial"
        },
        {
          key: "动态圆波",
          value: "CircleWaveMaterial"
        }
      ]
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "pureColor",
      value: "#000000"
    },
    {
      type: "MapgisUiSlider",
      title: "透明度",
      key: "pureOpacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "height",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "材质颜色",
      key: "materialColor",
      value: "#000000"
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
      title: "持续时间",
      key: "duration",
      value: 2000
    },
    {
      type: "MapgisUiInputNumber",
      title: "倾斜",
      key: "gradient",
      value: 0.5
    },
    {
      type: "MapgisUiInputNumber",
      title: "数量",
      key: "count",
      value: 4
    }
  ],
  cube: [
    {
      type: "MapgisUiInput",
      title: "标题"
    },
    {
      type: "MapgisUiInputNumber",
      title: "长度"
    },
    {
      type: "MapgisUiSelect",
      title: "填充类型",
      dataSource: [
        {
          key: "纯色",
          value: "纯色"
        },
        {
          key: "网格",
          value: "网格"
        },
        {
          key: "条纹",
          value: "条纹"
        },
        {
          key: "图片",
          value: "图片"
        }
      ]
    },
    {
      type: "MapgisUiColorPicker",
      title: "填充颜色"
    },
    {
      type: "MapgisUiSlider",
      title: "填充透明度"
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
      value: 500
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "height",
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
      key: "height",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#000000"
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
      type: "MapgisUiColorPicker",
      title: "颜色",
      key: "color",
      value: "#000000"
    },
    {
      type: "MapgisUiSlider",
      title: "填充透明度",
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
      key: "height",
      value: 0
    },
    {
      type: "MapgisUiColorPicker",
      title: "填充颜色",
      key: "color",
      value: "#000000"
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
      title: "标题"
    },
    {
      type: "MapgisUiInput",
      title: "URL"
    },
    {
      type: "MapgisUiInputNumber",
      title: "比例尺"
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
      type: "MapgisUiColorPicker",
      title: "填充颜色",
      key: "color",
      value: "#000000"
    },
    {
      type: "MapgisUiSlider",
      title: "填充透明度",
      key: "opacity",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "墙体高度",
      key: "extrudedHeight",
      value: 100
    },
    {
      type: "MapgisUiInputNumber",
      title: "离地高度",
      key: "height",
      value: 0
    }
  ]
};

export default editList;
