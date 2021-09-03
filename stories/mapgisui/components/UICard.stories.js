import MapgisUiCard from "../../../ui/src/components/card/Card.vue";

export default {
  title: "界面/卡片",
  component: MapgisUiCard,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCard },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-card title="Default size card" style="width: 300px">
      <a slot="extra" >more</a>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </mapgis-ui-card>
    <br />
    <mapgis-ui-card size="small" title="Small size card" style="width: 300px">
      <a slot="extra" >more</a>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </mapgis-ui-card>
  </div>
  `,
});

export const Card = Template.bind({});
Card.args = {};


const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCard },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-card hoverable style="width: 240px">
    <img
    slot="cover"
    alt="example"
    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
    />
    <mapgis-ui-card-meta title="Europe Street beat">
    <template slot="description">
        www.instagram.com
    </template>
    </mapgis-ui-card-meta>
  </mapgis-ui-card>
  `,
});

export const CustomizedContentCard = Template2.bind({});
CustomizedContentCard.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCard },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-card title="Card Title">
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center" :hoverable="false">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
    <mapgis-ui-card-grid style="width:25%;text-align:center">
      Content
    </mapgis-ui-card-grid>
  </mapgis-ui-card>
  `,
});

export const GridCard = Template3.bind({});
GridCard.args = {};