export default {
    title: "三维/图层/时空漫游",
    argTypes:{
    }
}

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
        }
    },
    template: `
      <mapgis-web-scene style="height:95vh">
        <mapgis-3d-map-story-layer v-bind="$props"/>
      </mapgis-web-scene>
    `
});

export const 时空漫游 = Template.bind({});
时空漫游.args = {
    dataSource: [{
        title: "国家地理",
        description: "",
        url: `http://${window.webclient.ip}:${window.webclient.port}/geojson/mapStory.json`,
        type: "normal",
        show: true,
        uuid: "1"
    }]
};