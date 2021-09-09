import MapgisUiSkeleton from "../../../ui/src/components/skeleton/Skeleton.vue";

export default {
  title: "界面/反馈/骨架屏",
  component: MapgisUiSkeleton,
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
  components: { MapgisUiSkeleton },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-skeleton avatar :paragraph="{ rows: 4 }" />
  `,
});

export const Skeleton = Template.bind({});
Skeleton.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSkeleton },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-skeleton active />
  `,
});

export const SkeletonAnimation = Template2.bind({});
SkeletonAnimation.args = {};
