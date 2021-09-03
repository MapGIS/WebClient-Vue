import MapgisUiList from "../../../ui/src/components/list/List.vue";

export default {
  title: "界面/列表",
  component: MapgisUiList,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiList },
  data() {
    return {
      data: [
        {
          title: 'Ant Design Title 1',
        },
        {
          title: 'Ant Design Title 2',
        },
        {
          title: 'Ant Design Title 3',
        },
        {
          title: 'Ant Design Title 4',
        },
      ]
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-list item-layout="horizontal" :data-source="data">
    <mapgis-ui-list-item slot="renderItem" slot-scope="item, index">
      <mapgis-ui-list-item-meta
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      >
        <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
        <mapgis-ui-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </mapgis-ui-list-item-meta>
    </mapgis-ui-list-item>
  </mapgis-ui-list>
  `,
});

export const List = Template.bind({});
List.args = {};
