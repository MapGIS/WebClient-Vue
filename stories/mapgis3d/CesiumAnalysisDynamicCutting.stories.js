export default {
    title: "三维/分析/动态剖切",
    argTypes: {
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s',
            url2: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent',
            vueIndex2: 2
        }
    },
    template: `
      <mapgis-web-scene>
      <mapgis-3d-igs-m3d :vueIndex="vueIndex2" :url="url"> </mapgis-3d-igs-m3d>
      <mapgis-3d-igs-m3d :vueIndex="vueIndex" :url="url2"> </mapgis-3d-igs-m3d>
      <mapgis-3d-dynamic-cutting v-bind="$props"> </mapgis-3d-dynamic-cutting>
      </mapgis-web-scene>
    `,
    mounted() {
        console.log("props",this.$props)
    }
});

export const DynamicCutting = Template.bind({});
DynamicCutting.args = {
    vueIndex: 1,
    startDistance: -1000,
    direction: "right",
    color: "#ff0000",
    opacity: 0.3,
    currentDistance: 3000
}