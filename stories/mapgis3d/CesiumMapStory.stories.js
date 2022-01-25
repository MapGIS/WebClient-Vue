import Markdown from "../../cesium/docs/api/MapStory/MapStory.md";

export default {
    title: "三维/图层/地图故事",
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
        <mapgis-3d-map-story v-bind="$props"/>
      </mapgis-web-scene>
    `
});

export const 地图故事 = Template.bind({});
地图故事.args = {
    dataSource: [],
    height: 700,
    width: 300
};

地图故事.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};