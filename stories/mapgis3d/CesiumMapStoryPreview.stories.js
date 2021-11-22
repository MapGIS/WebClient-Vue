export default {
    title: "三维/图层/预览时空漫游",
    argTypes:{
        dataSource: `http://${window.webclient.ip}:${window.webclient.port}/geojson/mapStory.json`
    }
}

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            showStory: false
        }
    },
    mounted() {
        let vm = this;
        setTimeout(function () {
            vm.showStory = true;
        }, 1000);
    },
    template: `
      <mapgis-web-scene style="height:95vh">
        <mapgis-3d-preview-map-story-layer v-if="showStory" v-bind="$props"/>
      </mapgis-web-scene>
    `
});

export const 预览时空漫游 = Template.bind({});
预览时空漫游.args = {
    dataSource: `http://${window.webclient.ip}:${window.webclient.port}/geojson/mapStory.json`
};