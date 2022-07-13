export default {
  title: "二维/图层/专题图/专题图添加标签/多边形数据-使用IGS生成标签(10.5.5以后可用)",
  argTypes: {
    dataSource: {
      description: "使用IGS服务时，请传入一个IGS获取要素的服务地址，例如：'http://localhost:6163/igs/rest/mrfs/layer/query?f=json&gdbp=gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市&structs={IncludeAttribute:true,IncludeGeometry:true,IncludeWebGraphic:false}&pageCount=200&page=0&cursorType=forward&rtnLabel=true'<br>" +
          "使用此服务是需要注意以下几点：<br>" +
          "1、IGS服务的版本号应在10.5.5.10以上<br>" +
          "2、将localhost:6163替换为相应的服务地址<br>" +
          "3、将gdbp=gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市替换为对应的gdbp地址",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    type: {
      description: "<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    field: {
      description: "<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    themeOptions: {
      description: "专题图样式，包含专题图图层样式、分段样式以及标签样式，其中标签样式如下：<br>" +
          "1、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式<br>" +
          "2、<span class='storybook-span'>styleGroups</span>(选填)：分段样式(略)<br>" +
          "3、<span class='storybook-span'>textStyle</span>(选填)：标签样式<br>" +
          "3.1、<span class='storybook-span'>field</span>(选填)：标签字段，即以要素中某一个字段的内容生成标签<br>" +
          "3.2、<span class='storybook-span'>fontColor</span>(选填)：字体颜色，默认#000000，十六进制或rgb颜色<br>" +
          "3.3、<span class='storybook-span'>fontFamily</span>(选填)：字体，默认微软雅黑<br>" +
          "3.4、<span class='storybook-span'>fontSize</span>(选填)：字体大小，默认12<br>" +
          "3.5、<span class='storybook-span'>spacing</span>(选填)：文字间距，默认0.05<br>" +
          "3.6、<span class='storybook-span'>rotate</span>(选填)：文字的旋转角度，默认0<br>" +
          "3.7、<span class='storybook-span'>haloColor</span>(选填)：文字光晕颜色，默认#FFFFFF<br>" +
          "3.8、<span class='storybook-span'>haloWidth</span>(选填)：文字光晕宽度，默认0<br>" +
          "3.9、<span class='storybook-span'>haloBlur</span>(选填)：文字光晕模糊度，默认0<br>" +
          "3.10、<span class='storybook-span'>lineHeight</span>(选填)：文字行高，默认1.2<br>" +
          "3.11、<span class='storybook-span'>maxWidth</span>(选填)：文字最大宽度，默认10<br>" +
          "3.12、<span class='storybook-span'>xOffset</span>(选填)：文字X轴偏移，默认0<br>" +
          "3.13、<span class='storybook-span'>yOffset</span>(选填)：文字Y轴偏移，默认0<br>" +
          "3.14、<span class='storybook-span'>align</span>(选填)：文字对其方式，默认'center'，可选值'left','center','right'<br>" +
          "3.15、<span class='storybook-span'>enableTurf</span>(选填)：是否启用turf计算多边形中心，仅多边形有效，默认false，当启用turf时，会在前端计算所有要素的中心点<br>" +
          "3.16、<span class='storybook-span'>enableIgs</span>(选填)：是否启用IGS服务计算多边形中心，仅多边形有效，默认不启用，必须填写baseUrl，会逐个计算要素的中心点，每个要素发一个请求，因此对网络有一定的要求而<br>" +
          "3.17、<span class='storybook-span'>baseUrl</span>(选填)：IGS服务的ip和端口号，例如'http://localhost:6163'<br>" +
          "",
      defaultValue: { summary: 'null' },
    }
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :mapStyle="mapStyle" :zoom="8" style="height:96vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
  data(){
    return {
      mapStyle: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "背景",
            type: "background",
            paint: {
              "background-color": "rgba(0, 0, 0, 1)"
            }
          }
        ],
        // glyphs: "http://localhost:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
         // glyphs: "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf"
        glyphs: `http://${window.webclient.ip}:${window.webclient.port}/${window.glyphs}/{fontstack}/{range}.pbf`
      },
    }
  }
});

export const  标签 = Template.bind({});
标签.args = {
  dataSource: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrfs/layer/query?f=json&gdbp=gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市&structs={IncludeAttribute:true,IncludeGeometry:true,IncludeWebGraphic:false}&pageCount=200&page=0&cursorType=forward&rtnLabel=true`,
  type: "uniform",
  field: "Name",
  themeOptions: {
    textStyle: {
      field: "Name",
      fontColor: "#FFFFFF",
      fontFamily: "宋体",
      fontSize: 14,
      spacing: 0.05,
      rotate: 0,
      haloColor: "#FFFF00",
      haloWidth: 1,
      haloBlur: 1,
      lineHeight: 2,
      maxWidth: 10,
      xOffset: 0,
      yOffset: 0,
      align: "center",
    }
  }
}
