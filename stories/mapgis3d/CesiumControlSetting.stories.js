import Mapgis3dSeneSetting from "../../cesium/src/components/SceneEffect/SceneSetting";

export default {
    title: "三维/场景子组件/场景设置",
    component: Mapgis3dSeneSetting,
    argTypes: {
        layout: {
            description: "场景设置组件的布局方式，有'horizontal' 'vertical' 'inline'三种选项",
            table: {
                defaultValue: {
                    summary:'horizontal'
                },
            },
            control:{
                type:"select",
                options:['horizontal','vertical','inline']
            } ,
        },
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { "mapgis-3d-scene-setting": Mapgis3dSeneSetting },
    template: `
      <mapgis-web-scene
          style="height:95vh"
          :timeline="true"
      >
      <mapgis-3d-igs-m3d
          :auto-reset="autoReset"
          :maximum-screen-space-error="maximumScreenSpaceError"
          :url="m3dUrl"
      >
      </mapgis-3d-igs-m3d>
      <mapgis-3d-scene-setting v-bind="$props" class="sceneSetting"></mapgis-3d-scene-setting>
      </mapgis-web-scene>
    `,
    data() {
        return {
            m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
            autoReset: true,
            maximumScreenSpaceError: 8,
        }
    },
});

export const 场景设置 = Template.bind({});
场景设置.args = {
    layout:'horizontal',
    panelStyle:{
        position:"absolute",
        top:"10px",
        left:"10px",
        width:"320px"
    }
};
