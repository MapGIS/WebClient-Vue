//单值专题图属性
let uniqueTheme = {
  //当前激活的专题图字段
  field: "",
  //专题图类型
  type: "unique",
  //是否开启高亮
  isHoverAble: false,
  //是否有开启弹窗
  isPopUpAble: false,
  //图层透明度0-100
  opacity: 100,
  //专题图是否显示或隐藏
  visible: true,
  //高亮样式
  highlightStyle: {
    //填充区域样式
    fillStyle: fillStyle,
    //外边线样式
    lineStyle: lineStyle
  },
  //专题图样式
  style: {
    //数据类型为点则对应点样式
    //点样式
    ...pointStyle,
    //标签样式
    ...textStyle,
    //数据类型为线则对应线样式
    //线样式
    ...lineStyle,
    //标签样式
    ...textStyle,
    //填充符号样式
    ...symbolStyle,
    //数据类型为几何则对应的样式
    //几何样式
    ...fillStyle,
    //标签样式
    ...textStyle,
    //填充符号样式
    ...symbolStyle
  },
  //field字段所对应的值得专题图样式，不写则默认用style的
  //假设field叫武汉区名称
  styleGroups: [
    {
      value: "武昌区",
      style: {
        //设定填充颜色
        color: "#FF0000"
      }
    },
    {
      value: "洪山区",
      style: {
        //设定填充颜色
        color: "#00FF00"
      }
    }
  ]
};

//分段专题图
let rangeTheme = {
  //当前激活的专题图字段
  field: "",
  //专题图类型
  type: "range",
  //是否开启高亮
  isHoverAble: false,
  //是否有开启弹窗
  isPopUpAble: false,
  //图层透明度0-100
  opacity: 100,
  //专题图是否显示或隐藏
  visible: true,
  //高亮样式
  highlightStyle: {
    //填充区域样式
    fillStyle: fillStyle,
    //外边线样式
    lineStyle: lineStyle
  },
  //专题图样式
  style: {
    //数据类型为点则对应点样式
    //点样式
    ...pointStyle,
    //标签样式
    ...textStyle,
    //数据类型为线则对应线样式
    //线样式
    ...lineStyle,
    //标签样式
    ...textStyle,
    //填充符号样式
    ...symbolStyle,
    //数据类型为几何则对应的样式
    //几何样式
    ...fillStyle,
    //标签样式
    ...textStyle,
    //填充符号样式
    ...symbolStyle
  },
  //field字段所对应的值得专题图样式，不写则默认用style的
  //假设field叫面积
  styleGroups: [
    {
      //起始值
      start: 0,
      //结束值
      end: 30,
      //分段样式
      style: {
        //设定填充颜色
        color: "#FF0000"
      }
    },
    {
      //起始值
      start: 31,
      //结束值
      end: 100,
      //分段样式
      style: {
        //设定填充颜色
        color: "#00FF00"
      }
    }
  ]
};

//统一专题图
let uniformTheme = {
  //当前激活的专题图字段
  field: "",
  //专题图类型
  type: "uniform",
  //是否开启高亮
  isHoverAble: false,
  //是否有开启弹窗
  isPopUpAble: false,
  //图层透明度0-100
  opacity: 100,
  //专题图是否显示或隐藏
  visible: true,
  //高亮样式
  highlightStyle: {
    //填充区域样式
    fillStyle: fillStyle,
    //外边线样式
    lineStyle: lineStyle
  },
  //专题图样式
  style: {
    //数据类型为点则对应点样式
    //点样式
    ...pointStyle,
    //标签样式
    ...textStyle,
    //数据类型为线则对应线样式
    //线样式
    ...lineStyle,
    //标签样式
    ...textStyle,
    //填充符号样式
    ...symbolStyle,
    //数据类型为几何则对应的样式
    //几何样式
    ...fillStyle,
    //标签样式
    ...textStyle,
    //填充符号样式
    ...symbolStyle
  }
};

//符号专题图，仅点有效
let symbolTheme = {
  //当前激活的专题图字段
  field: "",
  //专题图类型
  type: "symbol",
  //是否开启高亮
  isHoverAble: false,
  //是否有开启弹窗
  isPopUpAble: false,
  //图层透明度0-100
  opacity: 100,
  //专题图是否显示或隐藏
  visible: true,
  //高亮样式
  highlightStyle: {
    //填充区域样式
    fillStyle: fillStyle,
    //外边线样式
    lineStyle: lineStyle
  },
  //专题图样式
  style: {
    //是否启用文字标签
    idShowFont: false,
    //字体
    fontFamily: "",
    //字体颜色
    fontColor: "",
    //字体大小
    fontSize: "",
    //文字间距
    fontSpacing: "",
    //文字X轴偏移
    fontXOffset: "",
    //文字Y轴偏移
    fontYOffset: "",
    //是否启用图标或填充图案
    isShowSymbol: false,
    //符号Url或者名称
    symbol: "",
    //图标颜色
    symbolColor: "",
    //旋转角度
    symbolRotate: "",
    //符号大小
    symbolSize: "",
    //符号X轴偏移
    symbolXOffset: "",
    //符号Y轴偏移
    symbolYOffset: ""
  },
  //field字段所对应的值得专题图样式，不写则默认用style的
  //假设field叫单价
  styleGroups: [
    {
      //起始值
      start: 0,
      //结束值
      end: 30,
      //分段样式，注意不可更改符号
      style: {
        //设定符号大小
        symbolSize: 10
      }
    },
    {
      //起始值
      start: 31,
      //结束值
      end: 100,
      style: {
        //设定符号大小
        symbolSize: 20
      }
    }
  ]
};

//热力专题图，仅点有效
let heatmapTheme = {
  //当前激活的专题图字段
  field: "",
  //专题图类型
  type: "heatmap",
  //图层透明度0-100
  opacity: 100,
  //专题图是否显示或隐藏
  visible: true,
  //专题图样式
  style: {
    //热力图颜色，可不填，会用默认颜色#BED2EF,#86FD86,#ECFD43,#FEB028,#FF0000
    color: "",
    //热力半径
    radius: 40
  },
  //定义特定分段的热力权重
  styleGroups: [
    {
      //权重起始值
      start: 0,
      //权重结束值
      end: 30,
      //热力样式
      style: {
        //颜色
        color: ""
      }
    },
    {
      //权重起始值
      start: 0,
      //权重结束值
      end: 30,
      //热力样式
      style: {
        //颜色
        color: ""
      }
    }
  ]
};

//点样式

let pointStyle = {
  //半径，仅点、符号有用
  radius: 5,
  //外边线颜色
  outlineColor: "#FF0000",
  //外边线宽度
  outlineWidth: 1,
  //锚点，方向Top，。。8个方向
  anchor: "center"
};

//线样式
let lineStyle = {
  //线宽度
  width: "",
  //线样式，仅线有用
  dashArray: "",
  //线头样式
  cap: "",
  //拐角样式
  join: "",
  //是否启用阴影
  hasShadow: false,
  //阴影模糊度
  shadowBlur: "",
  //阴影颜色
  shadowColor: "",
  //阴影X轴偏移
  shadowOffsetX: "",
  //阴影Y周偏印
  shadowOffsetY: ""
};

//几何样式
let fillStyle = {
  //是否有外边线，仅点、多边形有用
  hasOutline: true,
  //外边线颜色
  outlineColor: "",
  //外边线宽度
  outlineWidth: "",
  //线样式，仅线有用
  outlineDashArray: "",
  //是否启用阴影
  hasShadow: false,
  //阴影模糊度
  shadowBlur: "",
  //阴影颜色
  shadowColor: "",
  //阴影X轴偏移
  shadowOffsetX: "",
  //阴影Y周偏印
  shadowOffsetY: "",
  symbol: symbolStyle,
  outlineSymbol: symbolStyle
};

//符号样式
let symbolStyle = {
  //符号Url或者名称(本地自带图片)
  symbol: "",
  //旋转角度
  rotate: "",
  //符号大小
  size: "",
  //符号X轴偏移
  xOffset: "",
  //符号Y轴偏移
  yOffset: "",
  //锚点，方向Top，。。8个方向
  anchor: ""
};

//注记或者标签样式
let textStyle = {
  //字体
  fontFamily: "",
  //字体颜色
  fontColor: "",
  //字体大小
  fontSize: "",
  //文字间距
  spacing: "",
  //文字旋转角度
  rotate: "",
  //文字X轴偏移
  xOffset: "",
  //文字Y轴偏移
  yOffset: "",
  //行高
  lineHeight: "",
  //行宽
  maxWidth: "",
  //对齐方式
  align: "",
  //描边
  halo: "",
  //是否沿着边线显示
  placement: ""
};

export default uniqueTheme;
