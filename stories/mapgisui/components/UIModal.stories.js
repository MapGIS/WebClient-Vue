import MapgisUiModal from "../../../ui/src/components/modal";

export default {
  title: "界面/反馈/对话框",
  component: MapgisUiModal,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiModal },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    }
  },
  template: `
  <div>
    <mapgis-ui-button type="primary" v-on:click="showModal">
      Open Modal
    </mapgis-ui-button>
    <mapgis-ui-modal v-model="visible" title="Basic Modal" v-on:ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </mapgis-ui-modal>
  </div>
  `,
});

export const Modal = Template.bind({});
Modal.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiModal },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    showConfirm() {
      this.$confirm({
        title: 'Do you Want to delete these items?',
        content: 'Some descriptions',
        class: 'test'
      });
    },
    showDeleteConfirm() {
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No'
      });
    },
    showPropsConfirm() {
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        okButtonProps: {
          props: {
            disabled: true
          }
        },
        cancelText: 'No'
      });
    }
  },
  template: `
  <div>
    <mapgis-ui-button v-on:click="showConfirm">
      Confirm
    </mapgis-ui-button>
    <mapgis-ui-button type="dashed" v-on:click="showDeleteConfirm">
      Delete
    </mapgis-ui-button>
    <mapgis-ui-button type="dashed" v-on:click="showPropsConfirm">
      With extra props
    </mapgis-ui-button>
  </div>
  `,
});

export const ConfirmModal = Template2.bind({});
ConfirmModal.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiModal },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    info() {
      this.$info({
        title: 'This is a notification message',
        content: 'some messages...some messages...'
      });
    },
    success() {
      this.$success({
        title: 'This is a success message',
        content: 'some messages...some messages...'
      });
    },
    error() {
      this.$error({
        title: 'This is an error message',
        content: 'some messages...some messages...'
      });
    },
    warning() {
      this.$warning({
        title: 'This is a warning message',
        content: 'some messages...some messages...'
      });
    }
  },
  template: `
  <div>
    <mapgis-ui-button v-on:click="info">
      Info
    </mapgis-ui-button>
    <mapgis-ui-button v-on:click="success">
      Success
    </mapgis-ui-button>
    <mapgis-ui-button v-on:click="error">
      Error
    </mapgis-ui-button>
    <mapgis-ui-button v-on:click="warning">
      Warning
    </mapgis-ui-button>
  </div>
  `,
});

export const MessagecModal = Template3.bind({});
MessagecModal.args = {};