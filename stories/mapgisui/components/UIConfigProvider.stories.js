import MapgisUiConfigProvider from "../../../ui/src/components/config-provider/ConfigProvider.vue";
import enUS from '../../../ui/src/components/locale/en_US';
import zhCN from '../../../ui/src/components/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('en');

export default {
  title: "界面/其他/全局化配置（待完成）",
  component: MapgisUiConfigProvider,
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
  components: { MapgisUiConfigProvider },
  data() {
    return {
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          filters: [
            {
              text: 'filter1',
              value: 'filter1',
            },
          ],
        },
        {
          title: 'Age',
          dataIndex: 'age',
        },
      ],
      visible: false,
      localeTest: enUS,
      moment,
      enUS,
      zhCN,
    };
  },
  methods: {
    changeLocale(e) {
      const localeValue = e.target.value;
      this.localeTest = localeValue;
      if (!localeValue) {
        moment.locale('en');
      } else {
        moment.locale('zh-cn');
      }
    },
    info() {
      this.$info({
        title: 'some info',
        content: 'some info',
      });
    },
    confirm() {
      this.$confirm({
        title: 'some info',
        content: 'some info',
      });
    },
  },
  template: `
  <div>
    <div style="margin-bottom: 16px;">
      <span style="margin-right: 16px">Change locale of components: </span>
      <mapgis-ui-radio-group :value="localeTest" @change="changeLocale">
        <mapgis-ui-radio-button key="en" :value="enUS">
          English
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button key="cn" :value="zhCN">
          中文
        </mapgis-ui-radio-button>
      </mapgis-ui-radio-group>
    </div>
    <mapgis-ui-config-provider :locale="localeTest">
      <div :key="locale ? locale.locale : 'en'" class="locale-components" style="border-top: 1px solid #d9d9d9;padding-top: 16px;">
        <div class="example" style="margin: 16px 0;">
          <mapgis-ui-pagination :default-current="1" :total="50" show-size-changer />
        </div>
        <div class="example" style="margin: 16px 0;">
          <mapgis-ui-select show-search style="width: 200px">
            <mapgis-ui-select-option value="jack">
              jack
            </mapgis-ui-select-option>
            <mapgis-ui-select-option value="lucy">
              lucy
            </mapgis-ui-select-option>
          </mapgis-ui-select>
          <mapgis-ui-date-picker />
          <mapgis-ui-range-picker style="width: 200px" />
        </div>
        <div class="example" style="margin: 16px 0;">
          <mapgis-ui-button type="primary" @click="visible = true">
            Show Modal
          </mapgis-ui-button>
          <mapgis-ui-button @click="info">
            Show info
          </mapgis-ui-button>
          <mapgis-ui-button @click="confirm">
            Show confirm
          </mapgis-ui-button>
        </div>
        <div class="example" style="margin: 16px 0;">
          <mapgis-ui-transfer
            :datmapgis-ui-source="[]"
            show-search
            :target-keys="[]"
            :render="item => item.title"
          />
        </div>
        <div style="width: 319px; border: 1px solid #d9d9d9; border-radius: 4px">
          <mapgis-ui-calendar :fullscreen="false" :value="moment()" />
        </div>
        <div class="example">
          <mapgis-ui-table :datmapgis-ui-source="[]" :columns="columns" />
        </div>
        <mapgis-ui-modal v-model="visible" title="Locale Modal">
          <p>Locale Modal</p>
        </mapgis-ui-modal>
      </div>
    </mapgis-ui-config-provider>
  </div>
  `,
});

export const ConfigProvider = Template.bind({});
ConfigProvider.args = {};
