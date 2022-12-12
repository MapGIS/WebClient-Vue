import Mapgis3dDebug from "../../cesium/src/components/UI/Controls/Debug/Debug.vue";

export default {
    title: "三维/场景控制/控件",
    component: Mapgis3dDebug,
    argTypes: {

    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Mapgis3dDebug },
    template: `
      <mapgis-web-scene style="height:95vh">
        <mapgis-3d-debug />
      </mapgis-web-scene>
    `,
    data() {
        return {
        }
    },
});

export const 帧率 = Template.bind({});
帧率.args = {

};
