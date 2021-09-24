import MapgisUiList from "../../../ui/src/components/list/List.vue";

export default {
  title: "界面/数据显示/列表",
  component: MapgisUiList,
  argTypes: {
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
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

const Template1 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {},
  data() {
    return {
      dataSource: [
        {"gender":"female","name":{"title":"Miss","first":"Marlene","last":"Dorner"},"email":"marlene.dorner@example.com","nat":"DE"},
        {"gender":"male","name":{"title":"Mr","first":"Rémy","last":"Riviere"},"email":"remy.riviere@example.com","nat":"FR"},
        {"gender":"male","name":{"title":"Mr","first":"Mikael","last":"Kalm"},"email":"mikael.kalm@example.com","nat":"FI"},
        {"gender":"male","name":{"title":"Mr","first":"Julian","last":"Williams"},"email":"julian.williams@example.com","nat":"AU"},
        {"gender":"female","name":{"title":"Mademoiselle","first":"Louise","last":"Chevalier"},"email":"louise.chevalier@example.com","nat":"CH"}
      ]
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-infinite-list :dataSource="dataSource">
    <!-- <template slot-scope="{item, index}"> -->
    <template v-slot="{item, index}">
      <mapgis-ui-list-item-meta :description="item.email">
        <a slot="title" :href="item.href">{{ item.name.last }}</a>
        <mapgis-ui-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </mapgis-ui-list-item-meta>
      <div>Content{{index}}</div>
    </template>
  </mapgis-ui-infinite-list>
  `,
});

export const 无限列表 = Template1.bind({});
无限列表.args = {};