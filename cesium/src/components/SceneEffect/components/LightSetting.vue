<template>
  <div class="light-setting">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left" class="formStyle" :colon="false">

      <mapgis-ui-form-model-item label="太阳光照" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="sunlight" @change="enableSunlight">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      
<!--      <mapgis-ui-switch-panel layout="horizontal" label="太阳ceshi" :checked="sunlight" @changeChecked="enableSunlight">-->
<!--      </mapgis-ui-switch-panel>-->

      <div class="parameter" :style="{ maxHeight: sunlightParams }">

        <mapgis-ui-form-model-item label="光照颜色">
          <mapgis-ui-sketch-color-picker
              size="small"
              :color.sync="lightColor"
              :disableAlpha="false"
              :style="{padding:'8px 0'}"
              @input="
                val =>
                  (lightColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
              "
          />
        </mapgis-ui-form-model-item>

      </div>

    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "SceneEffect",
  mixins: [ServiceLayer],
  props:{
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data (){
    return {
      sunlight: false,
      sunlightParams:undefined,
      // 光照颜色
      lightColor: 'rgba(255,255,255,255)', 

    }
  },
  computed: {
    formItemLayout({ layout }) {
      return layout === "horizontal"
          ? {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
          }
          : {};
    }
  },
  watch:{
    lightColor:{
      handler:function(newColor){
        this.lightColorChange(newColor);
      },
      deep:true
    }
  },
  methods: {
    //太阳
    enableSunlight(e) {
      const { viewer } = this;
      this.sunlight = e;
      this.$emit('updateSpin',true);
      let vm = this;

      if(vm.sunlight){ this.sunlightParams = "40px" }else{ this.sunlightParams = "0px" }

      setTimeout(function () {
        viewer.scene.globe.enableLighting = vm.sunlight;
        // var sunLight = new Cesium.SunLight({color:Cesium.Color.RED});
        // viewer.scene.light = sunLight
        vm.$emit('updateSpin',false);
      },400)

    },
    //光照颜色
    lightColorChange(e){
      const {Cesium} = this;
      let color = Cesium.Color.fromCssColorString(e);
      let sunLight = new Cesium.SunLight({color:color});
      viewer.scene.light = sunLight;
    },
  },
}
</script>

<style scoped>

/* .light-setting {
} */

.mapgis-ui-form-item{
  margin: 0;
  padding: 0 10px;
}

::v-deep .mapgis-ui-form-item-control{
  text-align: right;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
}

::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label:before{
  content: url("titlew.png");
  margin-right: 6px;
}

/*::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label{*/
/*  padding-left: 11px!important;*/
/*}*/

.mapgis-ui-input-number{
  margin-right: 12px;
  width: 60px;
}

.mapgis-ui-slider{
  width: 110px;
}

::v-deep .mapgis-ui-slider-rail{
  background-color: #F0F0F0;
}

::v-deep .parameter .mapgis-ui-slider-rail{
  background-color: #FFFFFF;
}
::v-deep .mapgis-ui-slider-track{
  background-color: #91D5FF;
}
::v-deep .mapgis-ui-slider-handle{
  border: 2px solid #91D5FF;
}

.parameter{
  background: #F1F1F1;
  border-radius: 4px;
  /*margin-bottom: 10px;*/
  overflow: hidden;
  max-height: 0px;
  transition:max-height .5s;
  -moz-transition:max-height .5s; /* Firefox 4 */
  -webkit-transition:max-height .5s; /* Safari and Chrome */
  -o-transition:max-height .5s; /* Opera */
}

</style>