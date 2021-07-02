import MapgisUiTimeline from "../ui/src/components/timeline/Timeline.vue";

export default {
  title: "界面/时间轴",
  component: MapgisUiTimeline,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTimeline },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-timeline>
    <mapgis-ui-timeline-item>Create a services site 2015-09-01</mapgis-ui-timeline-item>
    <mapgis-ui-timeline-item>Solve initial network problems 2015-09-01</mapgis-ui-timeline-item>
    <mapgis-ui-timeline-item>Technical testing 2015-09-01</mapgis-ui-timeline-item>
    <mapgis-ui-timeline-item>Network problems being solved 2015-09-01</mapgis-ui-timeline-item>
  </mapgis-ui-timeline>
  `,
});

export const Timeline = Template.bind({});
Timeline.args = {};
