import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/单值",
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{
    load(data) {
    },
    unload(data) {
    },
    handlebbox(data) {
    },
    handleClick(data) {
    },
    handleHover(data) {
    }
  },
  template:`
    <mapgis-web-scene :style="{height: '95vh'}">
      <mapgis-3d-theme-layer-custom 
        v-bind="$props"
        @load="load"
        @unload="unload"
        @bbox="handlebbox"
        @themeClick="handleClick" 
        @themeHover="handleHover"
      />
    </mapgis-web-scene>`,
});

export const 点数据 = Template.bind({});
点数据.args = {
  baseUrl: `http://develop.smaryun.com/static/data/geojson/省会城市.geojson`,

  visible: true,
  type: "unique",
  field: "name",
  themeOptions: {
    styleGroups:
    [
      {
        value: ["乌鲁木齐", "拉萨",],
        style: {
          radius: 90000,
          color: "#00ff00",
          outlineColor: "#0000ff",
          outlineWidth: 10,
          opacity: 0.5
        }
      },
      {
        value: "拉萨",
        style: {
          radius: 90000,
          color: "#00ff00",
        }
      },
      {
        value: "西宁",
        style: {
          radius: 90000,
          color: "#00ff00",
        }
      },
      {
        value: "兰州",
        style: {
          radius: 90000,
          color: "#0000ff",
        }
      },
      {
        value: "成都",
        style: {
          radius: 90000,
          color: "#0000ff",
        }
      },
      {
        value: "重庆",
        style: {
          radius: 90000,
          color: "#0000ff",
        }
      },
      {
        value: "贵阳",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "昆明",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "银川",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "西安",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "南宁",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "海口",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "广州",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "长沙",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "南昌",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "福州",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "台北",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "杭州",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "上海",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "武汉",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "合肥",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "南京",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "郑州",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "济南",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "石家庄",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "太原",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "呼和浩特",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "天津",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "沈阳",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "长春",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "哈尔滨",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "北京",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "香港",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      },
      {
        value: "澳门",
        style: {
          radius: 45000,
          color: "#ff0000",
        }
      }
    ]
  }
}
