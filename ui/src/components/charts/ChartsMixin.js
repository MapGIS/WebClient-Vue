import * as echarts from "echarts/core";

export default {
  methods: {
    extendEcharts() {
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x - 9, shape.y - 9];
          const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 9];
          const c3 = [xAxisPoint[0], xAxisPoint[1]];
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath();
        }
      });
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c1 = [shape.x, shape.y];
          const c2 = [xAxisPoint[0], xAxisPoint[1]];
          const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9];
          const c4 = [shape.x + 18, shape.y - 9];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        }
      });
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const c1 = [shape.x, shape.y];
          const c2 = [shape.x + 18, shape.y - 9];
          const c3 = [shape.x + 9, shape.y - 18];
          const c4 = [shape.x - 9, shape.y - 9];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        }
      });
      echarts.graphic.registerShape("CubeLeft", CubeLeft);
      echarts.graphic.registerShape("CubeRight", CubeRight);
      echarts.graphic.registerShape("CubeTop", CubeTop);
    }
  }
};
