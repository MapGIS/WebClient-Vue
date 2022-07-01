export const styleAttributes = {
  symbolId: {
    title: "符号ID",
    type: "number", //number,text,color,select,boolean,nodes
    groupId: 0,
    range: [0, 100000],
    disabled: true,
  },
  symbolName: {
    title: "符号名称",
    type: "text",
    groupId: 0,
    disabled: true,
  },
  show: {
    title: "显示",
    groupId: 1,
    type: "boolean",
  },
  featureId: {
    title: "图元ID",
    type: "text",
    groupId: 1,
    disabled: true,
  },
  compareLine: {
    title: "开启衬线",
    type: "select",
    groupId: 3,
    options: {
      0: "不开启衬线",
      1: "开启衬线",
    },
  },
  compareLineWidth: {
    title: "衬线宽度",
    type: "number",
    groupId: 3,
    range: [0, 1000],
  },
  compareLineColor: {
    title: "衬线颜色",
    type: "color",
    groupId: 3,
  },
  isOpenWall: {
    title: "开启墙体",
    type: "boolean",
    groupId: 2,
  },
  dimModHeight: {
    title: "墙体高度",
    type: "number",
    groupId: 2,
  },
  dimModAttitude: {
    title: "三维姿态",
    type: "select",
    groupId: 2,
    options: {
      0: "平躺",
      1: "直立",
    },
  },
  wallColor: {
    title: "墙体颜色",
    type: "color",
    groupId: 2,
  },
  nodeStyles: {
    // title:"符号部件",
    type: "nodes", //符号部件
    groupId: 4,
  },
  fillStyle: {
    title: "填充颜色",
    type: "color",
    groupId: 6,
  },
  // fillRule: {
  //   title: "填充规则",
  //   type: "text",
  //   groupId: 6
  // },
  text: {
    title: "文字内容",
    type: "text",
    groupId: 7,
  },
  fontStyle: {
    title: "字体样式",
    type: "select",
    groupId: 7,
    options: ["normal", "italic"],
  },
  fontVariant: {
    title: "字体变体",
    type: "select",
    groupId: 7,
    options: ["normal", "small-caps"],
  },
  fontWeight: {
    title: "字体粗细",
    type: "select",
    groupId: 7,
    options: ["normal", "bold", "bolder", "lighter"],
  },
  fontSize: {
    title: "字体大小",
    type: "number",
    groupId: 7,
  },
  fontFamily: {
    title: "字体",
    type: "text",
    groupId: 7,
  },
  strokeStyle: {
    title: "笔触类型",
    type: "select",
    groupId: 5,
    options: {
      none: "无",
      color: "纯色",
      gradient: "渐变",
      pattern: "指定方向重复",
    },
  },
  strokeColor: {
    //线区的strokeStyle
    title: "笔画颜色",
    type: "color",
    groupId: 5,
  },
  lineCap: {
    title: "线端类型",
    type: "select",
    groupId: 5,
    options: {
      butt: "平直",
      round: "圆形",
      square: "正方形",
    },
  },
  lineJoin: {
    title: "拐角类型",
    type: "select",
    groupId: 5,
    options: {
      bevel: "斜角",
      round: "圆角",
      miter: "尖角",
    },
  },
  miterLimit: {
    title: "最大斜接长度",
    type: "number",
    groupId: 5,
  },
  lineWidth: {
    title: "笔画宽",
    type: "number",
    groupId: 5,
    range: [0, 1000],
  },
};

export const groupArr = [
  {
    id: 0,
    label: "符号信息",
    // key:"symbol"
  },
  {
    id: 1,
    label: "基本属性",
    // key:"properties"
  },
  {
    id: 2,
    label: "墙体",
    // key:"wallStyle"
  },
  {
    id: 3,
    label: "衬线",
    // key: "compareLineStyle"
  },
  {
    id: 4,
    label: "切换部件",
    // key: "nodeStyles"
  },
  {
    id: 5,
    label: "笔画样式",
    // key: "lineStyle"
  },
  {
    id: 6,
    label: "填充样式",
    // key: "fillStyle"
  },
  {
    id: 7,
    label: "文字样式",
    // key: "textStyle"
  },
];
