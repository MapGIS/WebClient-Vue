<template>
  <div class="mapgis-ui-svg-setting-panel-container">
    <div class="mapgis-ui-svg-setting-panel-left">
      <div class="mapgis-ui-svg-setting-panel-svg">
        <div class="mapgis-ui-svg-setting-panel-svg-outer" id="SVGICON" @click="clickOrigin" @mousemove="mouseMove"
             v-html="screenOuterHTML"></div>
      </div>
      <div class="mapgis-ui-svg-setting-panel-svg-config">
        <mapgis-ui-row style="margin: 10px 0">
          <span style="font-weight: bolder">整体设置</span>
        </mapgis-ui-row>
        <mapgis-ui-row style="margin: 10px 0">
          <span>名称:</span>
          <mapgis-ui-input style="margin-top: 3px"/>
        </mapgis-ui-row>
        <mapgis-ui-row style="margin: 10px 0">
          <span>类型: </span><br>
          <div
              :class="{'mapgis-ui-svg-setting-panel-active': type === 0}"
              class="mapgis-ui-svg-setting-panel-check-one" @click="selectSymbolType('点')">点
          </div>
          <div
              :class="{'mapgis-ui-svg-setting-panel-active': type === 1}"
              class="mapgis-ui-svg-setting-panel-check-one" @click="selectSymbolType('线')">线
          </div>
          <div
              style="margin-right: 0;"
              :class="{'mapgis-ui-svg-setting-panel-active': type === 2}"
              class="mapgis-ui-svg-setting-panel-check-one" @click="selectSymbolType('区')">区
          </div>
        </mapgis-ui-row>
        <mapgis-ui-row style="margin: 10px 0">
          <span>姿态: </span><br>
          <div
              style="margin-right: 20px"
              :class="{'mapgis-ui-svg-setting-panel-active': pose === 0}"
              class="mapgis-ui-svg-setting-panel-check-two" @click="selectSymbolPose('平躺')">平躺
          </div>
          <div
              :class="{'mapgis-ui-svg-setting-panel-active': pose === 1}"
              class="mapgis-ui-svg-setting-panel-check-two" @click="selectSymbolPose('站立')">站立
          </div>
        </mapgis-ui-row>
      </div>
    </div>
    <div class="mapgis-ui-svg-setting-panel-right">
      <div class="mapgis-ui-svg-setting-panel-svg-basic">
        <div>格式: SVG</div>
        <div>大小: {{ svgWidth }} * {{ svgHeight }}</div>
        <div>
          鼠标位置: X {{ mouseX }} Y {{ mouseY }}
          <span style="float: right;cursor: pointer;color: #00a0e9;">复制SVG代码</span>
        </div>
        <div class="mapgis-ui-svg-setting-panel-svg-content">
          {{ outerHTML }}
        </div>
      </div>
      <div class="mapgis-ui-svg-setting-panel-svg-part">
        <span style="font-weight: bolder">细节设置:</span>
        <div class="mapgis-ui-svg-setting-panel-svg-part-container">
          <div class="mapgis-ui-svg-setting-panel-svg-part-container-left"
            :style="{'overflow-y': Object.keys(parts).length > 4 ? 'scroll' : 'none'}"
          >
            <div
                :style="{background: part.id === currentPart.id ? 'rgb(24,144,255)' : 'rgb(247,248,250)',color: part.id === currentPart.id ? 'white' : 'black'}"
                style="padding: 12px 20px;cursor: pointer" @click="setCurrentPart(part)" :key="index"
                v-for="(part,index) in parts">
              {{ part.id }}
            </div>
          </div>
          <div class="mapgis-ui-svg-setting-panel-svg-part-container-right">
            <mapgis-ui-row v-show="type !== 0">
              <span>类型:</span> <br>
              <mapgis-ui-select style="width: 310px;margin-top: 5px" default-value="轴线符号" @change="selectPartType">
                <mapgis-ui-select-option :key="index" v-for="(partTypeValue, index) in partTypes">{{
                    partTypeValue
                  }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </mapgis-ui-row>
            <mapgis-ui-row v-show="type !== 0 && type !== 2 && partType === 13">
              <span>姿态:</span> <br>
              <mapgis-ui-select style="width: 310px;margin-top: 5px" default-value="轴线符号" @change="selectPartPose">
                <mapgis-ui-select-option :key="index" v-for="(partPoseValue, index) in partPoses">{{
                    partPoseValue
                  }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </mapgis-ui-row>
            <mapgis-ui-row v-show="type !== 0 && partType === 13">
              <span>原点:</span> <br>
              <mapgis-ui-input @change="addConfig" style="margin-top: 5px;width: 150px;margin-right: 6px" type="Number" v-model="originX"
                               step=0.1
                               max=200
                               min=0
              />
              <mapgis-ui-input @change="addConfig" style="margin-top: 5px;width: 150px" type="Number" v-model="originY"
                               step=0.1
                               max=200
                               min=0
              />
            </mapgis-ui-row>
            <mapgis-ui-row v-show="type === 2 && partType === 13">
              <span>位置:</span> <br>
              <mapgis-ui-input @change="addConfig" style="margin-top: 5px;width: 310px" type="Number" v-model="markerOffset"
                               step=0.01
                               max=1
                               min=0
              />
            </mapgis-ui-row>
          </div>
        </div>
      </div>
    </div>
    <div class="mapgis-ui-svg-setting-panel-bottom">
      <mapgis-ui-row>
        <mapgis-ui-button style="float: right;margin-top: 7px;margin-right: 10px;">取消</mapgis-ui-button>
        <mapgis-ui-button style="float: right;margin-top: 7px;margin-right: 10px;"  @click="getNewSvg">确定</mapgis-ui-button>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "mapgis-ui-svg-setting-panel",
  props: {
    //svg的url
    url: {
      type: String
    },
    baseUrl: {
      type: String
    }
  },
  watch: {
    url: {
      handler: function (obj) {
        let url = this.url;
        if(this.baseUrl){
          url = this.baseUrl + url;
        }
        this.getSvg(url);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      svg: undefined,
      svgParts: [],
      //svg宽度
      svgWidth: 0,
      //svg高度
      svgHeight: 0,
      //鼠标x轴坐标
      mouseX: 0,
      //鼠标y轴坐标
      mouseY: 0,
      originX: 0,
      originY: 0,
      partList: [],
      //符号类型，0:点,1:线,2:区
      types: ["点", "线", "区"],
      //符号类型
      type: 0,
      //符号姿态，0：平躺，1：站立
      poses: ["平躺", "站立"],
      //符号姿态
      pose: 0,
      SVG_NS: "http://www.w3.org/2000/svg",
      //部件类型，10：轴线符号，11：延伸轴线符号，12：轴线平铺单元，13：轴线
      //上点符号，21:区填充图案（存在时，三维场景下整个符号贴地渲染）,22:区中心点符号
      partTypes: ["轴线符号", "延伸轴线符号", "轴线平铺单元", "轴线上点符号", "区填充图案", "区中心点符号"],
      //部件类型
      partType: 10,
      //符号姿态，0：平躺，1：站立
      partPoses: ["平躺", "站立"],
      //符号姿态
      partPose: 0,
      parts: {},
      currentPart: {id: undefined},
      outerHTML: undefined,
      screenOuterHTML: undefined,
      markerOffset: 0,
      prevSvg: undefined,
      prevStroke: undefined,
      prevFill: undefined
    }
  },
  methods: {
    /**
     * @description 获取SVG图片的dom元素
     * @param url {String} svg的url
     * */
    async getSvg(url) {
      const res = await axios({
        method: "get",
        url: url,
        dataType: "text",
        timeout: 1000
      });

      const xml = await new DOMParser().parseFromString(
          res.data,
          "image/svg+xml"
      );
      this.getChild(xml.documentElement);
      this.svgWidth = xml.documentElement.width.baseVal.valueAsString;
      this.svgHeight = xml.documentElement.height.baseVal.valueAsString;
    },
    /**
     * @description 鼠标移动事件，获取鼠标的x,y坐标
     * @param e {Object} 移动事件的event对象
     * */
    mouseMove(e) {
      this.mouseX = e.layerX - 20;
      this.mouseY = e.layerY - 20;
    },
    clickOrigin(e) {
      this.originX = this.mouseX;
      this.originY = this.mouseY;
      this.currentPart.markerOrigin = this.originX + "," + this.originY;
      if(this.currentPart.type !== 13) {
        this.setHighLight(e.target);
      }
    },
    setHighLight(svg) {
      this.cancelHighLight();
      this.prevSvg = svg;

      if (svg.tagName === "g") {
        this.prevFill = {};
        this.prevStroke = {};
      }

      this.setFillHighLight(svg);
      this.setStrokeHighLight(svg);
    },
    cancelHighLight() {
      if (this.prevSvg) {
        if (this.prevSvg.tagName !== "g") {
          if (this.prevStroke) {
            this.prevSvg.style.stroke = this.prevStroke;
          }
          if (this.prevFill) {
            this.prevSvg.style.fill = this.prevFill;
          }
        } else {
          let {children} = this.prevSvg;
          for (let i = 0; i < children.length; i++) {
            if (children[i].tagName !== "g") {
              let id = children[i].getAttribute("id")
              if (this.prevStroke[id]) {
                children[i].style.stroke = this.prevStroke[id];
              }
              if (this.prevFill[id]) {
                children[i].style.fill = this.prevFill[id];
              }
            }
          }
        }
      }
    },
    setFillHighLight(svg) {
      if (svg.tagName === "g") {
        let {children} = svg;
        for (let i = 0; i < children.length; i++) {
          if (children[i].tagName !== "g" && children[i].style.fill !== "none") {
            this.prevFill[children[i].getAttribute("id")] = children[i].style.fill;
            children[i].style.fill = "#00ffff";
          }
        }
      } else {
        if (svg.style.fill && svg.style.fill !== "none") {
          this.prevFill = svg.style.fill;
          svg.style.fill = "#00ffff";
        } else {
          this.prevFill = undefined;
        }
      }
    },
    setStrokeHighLight(svg) {
      if (svg.tagName === "g") {
        let {children} = svg;
        for (let i = 0; i < children.length; i++) {
          if (children[i].tagName !== "g" && children[i].style.stroke !== "none") {
            this.prevStroke[children[i].getAttribute("id")] = children[i].style.stroke;
            children[i].style.stroke = "#00ffff";
          }
        }
      } else {
        if (svg.style.stroke && svg.style.stroke !== "none") {
          this.prevStroke = svg.style.stroke;
          svg.style.stroke = "#00ffff";
        } else {
          this.prevStroke = undefined;
        }
      }
    },
    getNewSvg() {
      if (this.type !== 0 && !this.isEditAll()) {
        alert("没有编辑完毕！");
        return;
      }

      if (this.type === 4 && !this.hasMainLine()) {
        alert("没有主轴！");
        return;
      }

      let parts = this.svgParts;
      let svg = this.setSvg();
      for (let i = 0; i < parts.length; i++) {
        let tag = document.createElementNS(this.SVG_NS, parts[i].tagName);
        switch (parts[i].tagName) {
          case "rect":
            this.setRect(svg, tag, parts[i]);
            break;
          case "path":
            let id = parts[i].getAttribute("id");
            if (this.parts[id].type === 10 || this.parts[id].type === 11 || this.parts[id].type === 12) {
              delete this.parts[id].pose;
              parts[i].setAttribute("style", this.correctStyle(parts[i].getAttribute("style")));
            }
            if (this.parts[id].type === 21 || (this.type === 2 && this.parts[id].type === 13)) {
              delete this.parts[id].pose;
            }
            this.setPath(svg, tag, parts[i]);
            break;
          case "text":
            this.setText(svg, tag, parts[i]);
            break;
          case "circle":
            this.setCircle(svg, tag, parts[i]);
            break;
          case "ellipse":
            this.setEllipse(svg, tag, parts[i]);
            break;
          case "g":
            const {children} = parts[i];
            let g = document.createElementNS(this.SVG_NS, "g");
            this.setZondyAtt(g, parts[i].getAttribute("id"));
            for (let j = 0; j < children.length; j++) {
              let cTag = document.createElementNS(this.SVG_NS, children[j].tagName);
              switch (children[j].tagName) {
                case "path":
                  this.setPath(g, cTag, children[j]);
                  break;
                case "text":
                  this.setText(g, cTag, children[j]);
                  break;
                case "circle":
                  this.setCircle(g, cTag, children[j]);
                  break;
                case "ellipse":
                  this.setEllipse(g, cTag, children[j]);
                  break;
                case "rect":
                  this.setRect(g, cTag, children[j]);
                  break;
              }
            }
            this.setG(svg, g);
            break;
        }
      }
      this.downloadSVG(svg.outerHTML);
    },
    setSvg() {
      let svg = document.createElementNS(this.SVG_NS, "svg");
      svg.setAttribute("width", "200");
      svg.setAttribute("height", "200");
      svg.setAttribute("version", "1.1");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("xmlns:zondyPlotSymbol", "http://www.w3.org/2000/svg");
      svg.setAttribute("xmlns:zondyPlotSymbolItem", "http://www.w3.org/2000/svg");
      svg.setAttribute("zondyPlotSymbol:version", "1.0");
      svg.setAttribute("zondyPlotSymbol:id", "svg003");
      svg.setAttribute("zondyPlotSymbol:name", "");
      svg.setAttribute("zondyPlotSymbol:desc", "");
      svg.setAttribute("zondyPlotSymbol:type", this.type);
      svg.setAttribute("zondyPlotSymbol:pose", this.pose);

      return svg;
    },
    setCircle(svg, tag, part, noAtt) {
      let id = part.getAttribute("id");
      tag.setAttribute("style", part.getAttribute("style"));
      tag.setAttribute("id", id);
      tag.setAttribute("cx", part.getAttribute("cx"));
      tag.setAttribute("cy", part.getAttribute("cy"));
      tag.setAttribute("r", part.getAttribute("r"));
      if (!noAtt) {
        this.setZondyAtt(tag, id);
      }
      svg.appendChild(tag);
    },
    setEllipse(svg, tag, part, noAtt) {
      let id = part.getAttribute("id");
      tag.setAttribute("style", part.getAttribute("style"));
      tag.setAttribute("id", id);
      tag.setAttribute("cx", part.getAttribute("cx"));
      tag.setAttribute("cy", part.getAttribute("cy"));
      tag.setAttribute("rx", part.getAttribute("rx"));
      tag.setAttribute("ry", part.getAttribute("ry"));
      if (!noAtt) {
        this.setZondyAtt(tag, id);
      }
      svg.appendChild(tag);
    },
    setText(svg, tag, part, noAtt) {
      let id = part.getAttribute("id");
      tag.setAttribute("style", part.getAttribute("style"));
      tag.setAttribute("id", id);
      if (part.getAttribute("transform")) {
        tag.setAttribute("transform", part.getAttribute("transform"));
      } else {
        tag.removeAttribute("transform");
      }
      tag.setAttribute("x", part.getAttribute("x"));
      tag.setAttribute("y", part.getAttribute("y"));
      const {children} = part;
      for (let i = 0; i < children.length; i++) {
        let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("id", children[i].getAttribute("id"));
        tspan.setAttribute("x", children[i].getAttribute("x"));
        tspan.setAttribute("y", children[i].getAttribute("y"));
        tspan.innerHTML = children[i].innerHTML;
        tag.appendChild(tspan);
      }
      if (!noAtt) {
        this.setZondyAtt(tag, id);
      }
      svg.appendChild(tag);
    },
    setPath(svg, tag, part, noAtt) {
      let id = part.getAttribute("id");
      tag.setAttribute("style", part.getAttribute("style"));
      tag.setAttribute("id", id);
      tag.setAttribute("d", part.getAttribute("d"));
      if (!noAtt) {
        this.setZondyAtt(tag, id);
      }
      svg.appendChild(tag);
    },
    setRect(svg, tag, part, noAtt) {
      let id = part.getAttribute("id");
      tag.setAttribute("style", part.getAttribute("style"));
      tag.setAttribute("id", id);
      tag.setAttribute("width", part.getAttribute("width"));
      tag.setAttribute("height", part.getAttribute("height"));
      tag.setAttribute("x", part.getAttribute("x"));
      tag.setAttribute("y", part.getAttribute("y"));
      if (!noAtt) {
        this.setZondyAtt(tag, id);
      }
      svg.appendChild(tag);
    },
    setG(svg, tag) {
      svg.appendChild(tag);
    },
    setZondyAtt(tag, id) {
      if (this.parts[id]) {
        if (this.parts[id].hasOwnProperty("type")) {
          tag.setAttribute("zondyPlotSymbolItem:type", this.parts[id].type);
        }
        if (this.parts[id].hasOwnProperty("pose")) {
          tag.setAttribute("zondyPlotSymbolItem:pose", this.parts[id].pose);
        }
        if (this.parts[id].hasOwnProperty("markerOrigin")) {
          tag.setAttribute("zondyPlotSymbolItem:markerOrigin", this.parts[id].markerOrigin);
        }
        if (this.parts[id].hasOwnProperty("markerOffset")) {
          tag.setAttribute("zondyPlotSymbolItem:markerOffset", this.parts[id].markerOffset);
        }
      }
    },
    downloadSVG(json) {
      const blob = new Blob([json], {
        type: "application/json;charset=utf-8"
      });
      let title = json.name || "无标题";
      saveAs(blob, title + ".svg");
    },
    getChild(svg) {
      this.svg = svg;
      this.screenOuterHTML = this.svg.outerHTML;
      this.$nextTick(function () {
        let svgDom = document.getElementById("SVGICON").children;
        if (svgDom.length > 0) {
          svgDom[0].setAttribute("width", "200");
          svgDom[0].setAttribute("height", "200");
        }
      });
      let children = svg.children, parts = [];
      for (let i = 0; i < children.length; i++) {
        if (children[i].tagName.indexOf("sodipodi") < 0 && children[i].tagName !== "defs") {
          this.partList.push("部件" + (this.partList.length + 1));
          parts.push(children[i]);
        }
      }
      if (parts.length === 1 && parts[0].tagName === "g") {
        alert("仅含有G元素，请确认您是要编辑一个点元素吗？");
      }
      this.svgParts = parts;
      this.initSvgConfig(parts);
    },
    initSvgConfig(parts) {
      this.parts = {};
      for (let i = 0; i < parts.length; i++) {
        let tag = document.createElementNS(this.SVG_NS, parts[i].tagName);
        this.parts[parts[i].getAttribute("id")] = {};
        this.parts[parts[i].getAttribute("id")].id = parts[i].getAttribute("id");
        this.parts[parts[i].getAttribute("id")].isEdit = false;
      }
    },
    isEditAll() {
      let isEditAll = true;

      Object.keys(this.parts).forEach((key) => {
        if (!this.parts[key].isEdit) {
          isEditAll = false;
        }
      });

      return isEditAll;
    },
    hasMainLine() {
      let hasMainLine = false;
      Object.keys(this.parts).forEach((key) => {
        if (this.parts[key].hasOwnProperty("type") && this.parts[key].type === 10) {
          hasMainLine = true;
        }
      });

      return hasMainLine;
    },
     addConfig() {
      switch (this.type) {
        case 0:
          break;
        case 1:
          switch (this.partType) {
            case 10:
            case 11:
            case 12:
              this.currentPart.type = this.partType;
              break;
            case 13:
              this.currentPart.type = this.partType;
              this.currentPart.pose = this.partPose;
              this.currentPart.markerOrigin = this.originX + "," + this.originY;
              break;
          }
          break;
        case 2:
          switch (this.partType) {
            case 10:
            case 21:
              this.currentPart.type = this.partType;
              break;
            case 13:
              this.currentPart.type = this.partType;
              this.currentPart.markerOffset = this.markerOffset;
              this.currentPart.markerOrigin = this.originX + "," + this.originY;
              break;
          }
          break;
      }
      this.currentPart.isEdit = true;
    },
    selectSymbolType(type) {
      switch (type) {
        case "点":
          this.type = 0;
          break;
        case "线":
          this.type = 1;
          this.pose = 1;
          break;
        case "区":
          this.type = 2;
          break;
      }
    },
    selectSymbolPose(pose) {
      switch (pose) {
        case "平躺":
          this.pose = 0;
          break;
        case "站立":
          this.pose = 1;
          break;
      }
    },
    selectPartType(index) {
      let type = this.partTypes[index];
      switch (type) {
        case "轴线符号":
          this.currentPart.type = 10;
          break;
        case "延伸轴线符号":
          this.currentPart.type = 11;
          break;
        case "轴线平铺单元":
          this.currentPart.type = 12;
          break;
        case "轴线上点符号":
          this.currentPart.type = 13;
          break;
        case "区填充图案":
          this.currentPart.type = 21;
          break;
        case "区中心点符号":
          this.currentPart.type = 22;
          break;
      }
      this.partType = this.currentPart.type;
      this.addConfig();
    },
    selectPartPose(index) {
      let pose = this.partPoses[index];
      switch (pose) {
        case "平躺":
          this.partPose = 0;
          break;
        case "站立":
          this.partPose = 1;
          break;
      }
      this.addConfig();
    },
    setCurrentPart(part) {
      let svgDom = document.getElementById("SVGICON").children;
      if (svgDom.length > 0) {
        let svgIcons = svgDom[0].children;
        for (let i = 0; i < svgIcons.length; i++) {
          if (svgIcons[i].getAttribute("id") === part.id) {
            this.setHighLight(svgIcons[i]);
          }
        }
      }
      this.currentPart = part;
      for (let i = 0; i < this.svgParts.length; i++) {
        if (this.svgParts[i].id === part.id) {
          this.outerHTML = this.svgParts[i].outerHTML;
          break;
        }
      }
      if (!this.currentPart.hasOwnProperty("markerOrigin")) {
      } else {
        let position = this.currentPart.markerOrigin.split(",");
        this.originX = position[0];
        this.originY = position[1];
      }
      if (this.type !== 0) {
        this.currentPart.type = this.partType;
        this.currentPart.pose = this.partPose;
      }
      this.addConfig();
    },
    correctStyle(style) {
      let styles = style.split(";");
      let result = "", styleArr = {};
      for (let i = 0; i < styles.length; i++) {
        if (styles[i]) {
          let sAtt = styles[i].split(":");
          styleArr[sAtt[0].trim()] = sAtt[1].trim();
        }
      }
      if (styleArr.hasOwnProperty("fill")) {
        styleArr.fill = "none";
      }
      Object.keys(styleArr).forEach(function (key) {
        result += key + ":" + styleArr[key] + ";";
      });

      return result
    }
  },
  mounted() {
    axios.defaults.withCredentials = true;
  }
}
</script>

<style scoped>
.mapgis-ui-svg-setting-panel-container {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 764px;
  height: 520px;
}

.mapgis-ui-svg-setting-panel-left {
  width: 236px;
  height: 470px;
  float: left;
  border-right: none;
}

.mapgis-ui-svg-setting-panel-right {
  width: 528px;
  height: 470px;
  float: left;
}

.mapgis-ui-svg-setting-panel-bottom {
  width: 100%;
  height: 50px;
  border-top: none;
  margin-top: 470px;
}

.mapgis-ui-svg-setting-panel-svg {
  width: 236px;
  height: 236px;
  padding: 18px;
}

.mapgis-ui-svg-setting-panel-svg-outer {
  width: 200px;
  height: 200px;
  background: white;
}

.mapgis-ui-svg-setting-panel-svg-config {
  width: 236px;
  height: 163px;
  padding: 0 10px;
}

.mapgis-ui-svg-setting-panel-check-one {
  width: 60px;
  height: 30px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  margin-right: 18px;
  margin-top: 3px;
  cursor: pointer;
  border-radius: 2px;
}

.mapgis-ui-svg-setting-panel-check-two {
  width: 98px;
  height: 30px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  margin-top: 3px;
  cursor: pointer;
  border-radius: 2px;
}

.mapgis-ui-svg-setting-panel-svg-content {
  width: 490px;
  height: 123px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.mapgis-ui-svg-setting-panel-svg-basic {
  width: 526px;
  height: 236px;
  padding: 18px;
}

.mapgis-ui-svg-setting-panel-svg-part {
  width: 526px;
  height: 254px;
  padding: 10px;
}

.mapgis-ui-svg-setting-panel-button {

}

.mapgis-ui-svg-setting-panel-svg-part-container {
  width: 506px;
  height: 230px;
}

.mapgis-ui-svg-setting-panel-svg-part-container-left {
  width: 180px;
  height: 180px;
  float: left;
  margin-top: 10px;
}

.mapgis-ui-svg-setting-panel-svg-part-container-right {
  width: 324px;
  height: 180px;
  margin: 12px 0;
  float: left;
  padding-left: 12px;
}

.mapgis-ui-svg-setting-panel-active {
  color: rgb(24,144,255);
  border-color: rgb(24,144,255);
}
</style>