import StoryPanelLarge from "../../../ui/src/components/panel/StoryPanelLarge";
import MarkDown from "../../../ui/docs/api/panel/story_panel_large.md";

export default {
  title: "界面/通用/图文关联",
  component: StoryPanelLarge,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { StoryPanelLarge },
  data() {
    return {
    };
  },
  methods: {},
  template: `
  <template>
    <div style="height: 90vh">
      <mapgis-ui-story-panel-large v-bind="$props"/>
    </div>
  </template>
  `,
});

export const 图文关联 = Template.bind({});
图文关联.args = {
  dataSource: [{
    images: ["https://img0.baidu.com/it/u=3119542616,1165410720&fm=26&fmt=auto",
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642644831&t=31f1700ec31a177e919c5e42544fc770"],//图片数组
    title: "图文关联",//标题
    content: "图文关联内容"//内容
  }]
};

图文关联.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};