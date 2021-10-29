import Mapgis3dSetting from "../../cesium/src/components/SceneEffect/Setting.vue";

export default {
    title: "三维/场景子组件/场景设置",
    component: Mapgis3dSetting,
    argTypes: {
        layout: {
            description: "场景设置组件的布局方式",
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
    components: { "mapgis-3d-setting": Mapgis3dSetting },
    template: `
      <mapgis-web-scene
          :timeline="true"
      >
      <mapgis-3d-igs-m3d
          :auto-reset="autoReset"
          :maximum-screen-space-error="maximumScreenSpaceError"
          :url="m3dUrl"
      >
      </mapgis-3d-igs-m3d>
      <mapgis-3d-setting v-bind="$props" class="sceneSetting" style="position: absolute;top: 10px;left: 10px"></mapgis-3d-setting ref="setting">
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
    layout:'horizontal'
};
