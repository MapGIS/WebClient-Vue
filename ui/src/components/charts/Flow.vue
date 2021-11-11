<template>
  <div>
    <mapgis-ui-radio-group size="small" v-model="type">
      <mapgis-ui-radio-button value="name"
        ><mapgis-ui-iconfont type="mapgis-info" />名称分析
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button value="count"
        ><mapgis-ui-iconfont type="mapgis-crosshair" />频率分析
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button value="group"
        ><mapgis-ui-iconfont type="mapgis-cluster" />聚类分析
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group>
    <div id="mapgisflowcharts" :style="outStyle"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import DefaultData from "./d3/dataechart";

export default {
  name: "mapgis-ui-chart-flow",
  props: {
    data: {
      type: Object,
      required: true
    },
    domain: {
      type: Array,
      default: () => [-25000, 25000]
    },
    outStyle: {
      type: Object,
      default: () => {
        return {
          width: "600px",
          height: "600px",
          color: "#1890ff",
          right: "25px",
          top: "25px"
        };
      }
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 600
    },
    margin: {
      type: Object,
      default: () => {
        return { top: 135, right: 5, bottom: 0, left: 135 };
      }
    }
  },
  data() {
    return {
      type: "name"
    };
  },
  watch: {
    type(next) {
      this.orderType(next);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let { width, height, data } = this;
      data = data || DefaultData;
      this.initChart(data, width, height, this.hoverCallback);
    },
    hoverCallback(from, to, value) {
      let payload = {
        from,
        to,
        value
      };
      console.log("payload", payload);
      this.$emit("hover", payload);
    },
    orderType(type) {},
    initChart(data, width, height, changeLayerBySelect) {
      let { margin, domain } = this;
      domain = domain || [-25000, 25000];
      width = width - 135 || 400;
      height = height - 135 || 400;

      var x = d3.scaleBand().range([0, width]),
        z = d3
          .scaleLinear()
          .domain([0, 4])
          .clamp(true),
        c = d3
          .scaleQuantize()
          .domain(domain)
          .range(d3.schemeSet3 /* schemeRdYlGn[10] */);

      var svg = d3
        .select("#mapgisflowcharts")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", 0 + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      this.svg = svg;
      this.x = x;

      var matrix = [],
        nodes = data.nodes,
        n = nodes.length;

      // Compute index per node.
      nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) {
          return { x: j, y: i, z: 0 };
        });
      });

      // Convert links to matrix; count character occurrences.
      data.links.forEach(function(link) {
        const s = findNode(nodes, link.source);
        const t = findNode(nodes, link.target);
        matrix[s][t].z += link.value;
        matrix[t][s].z += link.value;
        matrix[s][s].z += link.value;
        matrix[t][t].z += link.value;
        nodes[s].count += link.value;
        nodes[t].count += link.value;
        /* matrix[link.source][link.target].z += link.value;
            matrix[link.target][link.source].z += link.value;
            matrix[link.source][link.source].z += link.value;
            matrix[link.target][link.target].z += link.value;
            nodes[link.source].count += link.value;
            nodes[link.target].count += link.value; */
      });

      // Precompute the orders.
      var orders = {
        name: d3.range(n).sort(function(a, b) {
          return d3.ascending(nodes[a].name, nodes[b].name);
        }),
        count: d3.range(n).sort(function(a, b) {
          return nodes[b].count - nodes[a].count;
        }),
        group: d3.range(n).sort(function(a, b) {
          return nodes[b].group - nodes[a].group;
        })
      };

      this.orders = orders;

      // The default sort order.
      x.domain(orders.name);

      svg
        .append("rect")
        .attr("class", "flow-chart-backgroud")
        .attr("width", width)
        .attr("height", height)
        .style("fill", d => {
          return "#FFFFFFF";
        })
        .style("fill-opacity", 0.15);

      let rowSvg = svg
        .selectAll(".row")
        .data(matrix)
        .enter()
        .append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) {
          return "translate(0," + x(i) + ")";
        })
        .each(row);

      rowSvg.append("line").attr("x2", width);

      rowSvg
        .append("text")
        .attr("x", -6)
        .attr("y", x.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        // .attr("text-color", "#ffffff")
        .text(function(d, i) {
          return nodes[i].name;
        });

      var column = svg
        .selectAll(".column")
        .data(matrix)
        .enter()
        .append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) {
          return "translate(" + x(i) + ")rotate(-90)";
        });

      column.append("line").attr("x1", -width);

      column
        .append("text")
        .attr("x", 6)
        .attr("y", x.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) {
          return nodes[i].name;
        });
      // .style("fill", "#ffffff");

      this.orderType = order.bind(this);

      d3.select("#order").on("change", function() {
        order(this.value);
      });

      function findNode(nodes, name) {
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].name == name) {
            return i;
          }
        }
        return 0;
      }

      function getLayerIdByIndex(index) {
        let nodes = data.nodes;
        return nodes[index].id;
      }

      function getLayerValueByIndex(p) {
        let from = nodes[p.y].id;
        let to = nodes[p.x].id;
        let value = undefined;

        data.links.forEach(l => {
          if (l.source == from && l.target == to) {
            value = l.value;
          }
        });

        return value;
      }

      function row(row) {
        var cell = d3
          .select(this)
          .selectAll(".cell")
          .data(
            row.filter(function(d) {
              return d.z;
            })
          )
          .enter()
          .append("rect")
          .attr("class", "cell")
          .attr("x", function(d) {
            return x(d.x);
          })
          .attr("width", x.bandwidth())
          .attr("height", x.bandwidth())
          .style("fill-opacity", function(d) {
            return z(d.z);
          })
          .style("fill", function(d) {
            return nodes[d.x].group == nodes[d.y].group ? c(d.z) : null;
          })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .append("title")
          .text(function(d) {
            return (
              "流入:" +
              getLayerIdByIndex(d.x) +
              " \r\n" +
              "流出:" +
              getLayerIdByIndex(d.y) +
              " \r\n" +
              "z值:" +
              d.z +
              "公顷"
            );
          });
      }

      function mouseover(p) {
        let toLayer = getLayerIdByIndex(p.x);
        let fromLayer = getLayerIdByIndex(p.y);
        let value = getLayerValueByIndex(p);

        changeLayerBySelect(fromLayer, toLayer, value);

        d3.selectAll(".row text").classed("active", function(d, i) {
          return i == p.y;
        });
        d3.selectAll(".column text").classed("active", function(d, i) {
          return i == p.x;
        });
      }

      function mouseout() {
        d3.selectAll("text").classed("active", false);
      }

      function order(value) {
        x.domain(orders[value]);

        var t = svg.transition().duration(2500);

        t.selectAll(".row")
          .delay(function(d, i) {
            return x(i) * 4;
          })
          .attr("transform", function(d, i) {
            return "translate(0," + x(i) + ")";
          })
          .selectAll(".cell")
          .delay(function(d) {
            return x(d.x) * 4;
          })
          .attr("x", function(d) {
            return x(d.x);
          });

        t.selectAll(".column")
          .delay(function(d, i) {
            return x(i) * 4;
          })
          .attr("transform", function(d, i) {
            return "translate(" + x(i) + ")rotate(-90)";
          });
      }
    },
    fixCircle(links) {
      var buckets = [];
      return links.filter(function(l) {
        return l.target != l.source;
      });
    },

    /**
     *
     * @param {*} links
     * @param {*} name
     * @param {*} rule source/target
     */
    filter(links, name, source) {
      source = source === undefined ? true : source;
      return fixCircle(
        links.filter(function(l) {
          if (source) {
            return l.source == name;
          } else {
            return l.target == name;
          }
        })
      );
    }
  }
};
</script>

<style>
#flow {
  position: absolute;
  background-color: #ffffff;
  right: 20px;
  top: 20px;
}
</style>
