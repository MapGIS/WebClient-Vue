<template>
  <div>
    <mapgis-ui-custom-panel
        ref="custom"
        style="width: 50%"
        :options="options"
        @formChanged="$_formChanged"
    />
  </div>
</template>

<script>
import gradients from "./gradient"
export default {
  name: "mapgis-igs-theme-panel-custom",
  data() {
    return {
      options: {
        title: "标题一",
        //div,card,collapse
        type: "MapgisUiCard",
        rects: [
          {
            title: "符号",
            className: "",
            style: {},
            rows: [
              {
                title: "渐变颜色",
                type: "MapgisUiGrediantSelect",
                dataSource: gradients,
                value: gradients[0].key,
                key: "gradientColor",
                props: {
                  titleCol: 3,
                  selectCol: 21
                }
              },
              {
                title: "透明度",
                type: "MapgisUiSlider",
                value: 100,
                id: "fillOpacity",
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                }
              },
              {
                title: "x轴偏移",
                type: "MapgisUiSlider",
                value: 0,
                id: "fillTranslateX",
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 20,
                  sliderMin: -20
                }
              },
              {
                title: "y轴偏移",
                type: "MapgisUiSlider",
                value: 0,
                id: "fillTranslateY",
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 20,
                  sliderMin: -20
                }
              },
              {
                title: "边线颜色",
                type: "MapgisUiColorPicker",
                id: "fillOutlineColor",
                props: {
                  titleCol: 3,
                  colorCol: 21
                }
              },
              {
                title: "边线透明度",
                type: "MapgisUiSlider",
                value: 100,
                id: "fillOutlineOpacity",
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                }
              },
              {
                title: "边线宽度",
                type: "MapgisUiSlider",
                value: 1,
                id: "fillOutlineWidth",
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 20,
                  sliderStep: 0.1
                }
              }
            ]
          },
          {
            title: "标签",
            className: "",
            style: {},
            rows: [
              {
                title: "显示字段",
                type: "MapgisUiSelect",
                id: "textField",
                value: 1,
                dataSource: [{
                  key: "第一个",
                  value: 1
                },{
                  key: "第二个",
                  value: 2
                }],
                props: {
                  titleCol: 3,
                  selectCol: 21
                }
              },
              {
                title: "字体颜色",
                id: "textColor",
                type: "MapgisUiColorPicker",
                props: {
                  titleCol: 3,
                  colorCol: 21
                }
              },
              {
                title: "描边颜色",
                type: "MapgisUiColorPicker",
                id: "textHaloColor",
                props: {
                  titleCol: 3,
                  colorCol: 21
                }
              },
              {
                title: "描边宽度",
                type: "MapgisUiSlider",
                id: "textHaloWidth",
                value: 0,
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 20,
                  sliderStep: 0.1
                }
              },
              {
                title: "字体",
                type: "MapgisUiSelect",
                id: "textFont",
                value: "宋体",
                dataSource: [{
                  key: "宋体",
                  value: "宋体"
                },{
                  key: "微软雅黑",
                  value: "微软雅黑"
                }],
                props: {
                  titleCol: 3,
                  selectCol: 21
                }
              },
              {
                title: "字体大小",
                type: "MapgisUiSlider",
                id: "textSize",
                value: 11,
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3
                }
              },
              {
                title: "x轴偏移",
                type: "MapgisUiSlider",
                id: "textOffsetX",
                value: 0,
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 20,
                  sliderMin: -20,
                  sliderStep: 0.1
                }
              },
              {
                title: "y轴偏移",
                type: "MapgisUiSlider",
                id: "textOffsetY",
                value: 0,
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 20,
                  sliderMin: -20,
                  sliderStep: 0.1
                }
              },
              {
                title: "文字间距",
                type: "MapgisUiSlider",
                id: "textLetterSpacing",
                value: 0.05,
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 1,
                  sliderStep: 0.01
                }
              },
              {
                title: "旋转角度",
                type: "MapgisUiSlider",
                id: "textRotate",
                value: 0,
                props: {
                  titleCol: 3,
                  sliderCol: 18,
                  inputCol: 3,
                  sliderMax: 360,
                }
              },
            ]
          }
        ]
      }
    }
  },
  methods: {
    $_formChanged(id, value){
      console.log("id=----",id)
      console.log("value=----",value)
    }
  }
}
</script>

<style scoped>

</style>