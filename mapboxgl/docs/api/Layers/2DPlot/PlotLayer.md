# PlotLayer

> mapgis-2d-plot-layer <br>
> 行业标绘图层组件，标绘图元的容器 <br> > [点此跳转到示例](#example)

## 属性

| 名称                      | 类型             | 默认值    | 描述                                                                  | 是否监听 |
| ------------------------- | ---------------- | --------- | --------------------------------------------------------------------- | -------- |
| [dataSource](#dataSource) | String or Object | []        | 行业标绘图层数据源，url 或数据对象                                    | 是       |
| vueIndex                  | String or Number | 随机数    | plotLayer 的唯一标识，随机生成的数字或字符串，不传则自动生成          | 否       |
| vueKey                    | String           | 'default' | cesium 球体的唯一标识，默认值 default，当分屏时使用此对象标识多个球体 | 否       |

### <span id="dataSource">`dataSource（标绘图层数据源）`</span>

```javascript
let dataSource = {
  //一个GeoJSON格式的数据
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      //符号属性
      properties: {
        //符号ID
        symbolId: 13,
        //符号名称
        symbolName: "",
        //是否显示符号
        show: true,
        //标绘图元唯一标识符（标绘图元ID）
        featureId: "d1a27f94-51b6-44e9-9bbf-02e607d963e9",
        //是否显示衬线，仅二维有效，0：不启用，1：启用
        compareLine: 0,
        //衬线宽度，仅二维有效
        compareLineWidth: 6,
        //衬线颜色
        compareLineColor: "#099563",
        //符号样式，根据部件ID来设置样式，可单独设置，也可分开设置
        symbolNodes: {
          //文字样式，tspan3918为部件ID，从SVG上读取
          tspan3918: {
            //文字颜色，rgb或16进制颜色
            fillStyle: "rgba(0,0,0,1)",
            //canvas属性，可忽略
            fillRule: "nonzero",
            //字体样式，normal:标准，italic：斜体，仅二维有效，canvas属性
            fontStyle: "normal",
            //定义小型大写字母文本，normal：标准，small-caps：浏览器会显示小型大写字母的字体，仅二维有效，canvas属性
            fontVariant: "normal",
            //字体粗细，normal，bold，bolder，lighter，100~900，仅二维有效，canvas属性
            fontWeight: "normal",
            //字体大小，单位px
            fontSize: "15.86400509px",
            //文字字体
            fontFamily: '"Arial"',
            //笔触的颜色、渐变或模式，color：纯色，gradient：渐变，pattern：指定方向重复，仅二维有效，canvas属性
            strokeStyle: "none",
            //线条末端线帽的样式，butt：向线条的每个末端添加平直的边缘，round：向线条的每个末端添加圆形线帽，square：向线条的每个末端添加正方形线帽，仅二维有效，canvas属性
            lineCap: "butt",
            //当两条线交汇时，边角的类型，bevel：斜角，round：圆角，miter：尖角，仅二维有效，canvas属性
            lineJoin: "miter",
            //最大斜接长度，指的是在两条线交汇处内角和外角之间的距离，边角的角度越小，斜接长度就会越大，仅二维有效，canvas属性
            miterLimit: 4,
            //当前线条的宽度，以像素计，仅二维有效，canvas属性
            lineWidth: 1,
          },
          //线样式，path3000-17为部件ID，从SVG上读取
          "path3000-17": {
            //线颜色，rgb或16进制颜色
            strokeStyle: "rgba(255,0,0,1)",
            //线条末端线帽的样式，butt：向线条的每个末端添加平直的边缘，round：向线条的每个末端添加圆形线帽，square：向线条的每个末端添加正方形线帽，仅二维有效，canvas属性
            lineCap: "butt",
            //当两条线交汇时，边角的类型，bevel：斜角，round：圆角，miter：尖角，仅二维有效，canvas属性
            lineJoin: "miter",
            //最大斜接长度，指的是在两条线交汇处内角和外角之间的距离，边角的角度越小，斜接长度就会越大，仅二维有效，canvas属性
            miterLimit: 4,
            //当前线条的宽度
            lineWidth: 10,
            //canvas属性，可忽略
            fillRule: "nonzero",
          },
          //区样式，rect4184为部件ID，从SVG上读取
          rect4184: {
            //线颜色，rgb或16进制颜色
            strokeStyle: "rgba(255,0,0,1)",
            //线条末端线帽的样式，butt：向线条的每个末端添加平直的边缘，round：向线条的每个末端添加圆形线帽，square：向线条的每个末端添加正方形线帽，仅二维有效，canvas属性
            lineCap: "square",
            //当两条线交汇时，边角的类型，bevel：斜角，round：圆角，miter：尖角，仅二维有效，canvas属性
            lineJoin: "miter",
            //最大斜接长度，指的是在两条线交汇处内角和外角之间的距离，边角的角度越小，斜接长度就会越大，仅二维有效，canvas属性
            miterLimit: 4,
            //当前线条的宽度
            lineWidth: 10,
            //填充颜色
            fillStyle: "rgba(255,255,255,0.5)",
            //canvas属性，可忽略
            fillRule: "nonzero",
          },
        },
        //墙体样式，仅三维有效
        domModAttributes: {
          //墙体高度
          dimModHeight: 500,
          //是否开启墙
          isOpenWall: true,
          //墙体颜色
          wallColor: "rgba(255,0,0,0.3)",
        },
      },
      //标绘图元的几何点信息
      geometry: {
        type: "MultiPoint",
        coordinates: [
          [116.29478737656527, 39.87687015815399],
          [116.43403310415489, 39.87391866055694],
          [116.42826935935004, 39.80668466725203],
          [116.42820990939124, 39.80726621070691],
        ],
      },
    },
  ],
};
```

## 事件

| 事件名称 | 参数          | 默认值 | 描述             |
| -------- | ------------- | ------ | ---------------- |
| loaded   | [data](#data) | {}     | 图层加载完毕事件 |

### <span id="data">`data`</span>

| 名称     | 类型             | 默认值    | 描述                                                                  |
| -------- | ---------------- | --------- | --------------------------------------------------------------------- |
| vueIndex | String or Number | 随机数    | plotLayer 的唯一标识，随机生成的数字或字符串，不传则自动生成          |
| vueKey   | String           | 'default' | cesium 球体的唯一标识，默认值 default，当分屏时使用此对象标识多个球体 |

## <span id="example">示例</span>

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-plot-layer
      @loaded="handleLoaded"
      :dataSource="dataSource"
      :vueIndex="vueIndex"
      :vueKey="vueKey"
    ></mapgis-3d-plot-layer>
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      //行业标绘图层数据源
      dataSource: "",
      //vueIndex，用来标识图层
      vueIndex: undefined,
      //vueKey，用来标识图层
      vueKey: undefined,
    };
  },
  methods: {
    //图层加载完毕事件
    handleLoaded(e) {
      //返回vueIndex以及vueKey
      this.vueIndex = e.vueIndex;
      this.vueKey = e.vueKey;
    },
  },
};
</script>
<style lang="css"></style>
```
