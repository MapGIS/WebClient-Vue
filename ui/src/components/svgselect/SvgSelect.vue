<template>
  <div class="svg-select-outer">
    <div class="svg-select-inner" @click="$_toggle">
      <img class="svg-select-inner-img" :src="selectIcon" v-if="selectIcon">
      <img class="svg-select-inner-img" v-if="!selectIcon"
           src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjMwMDMxNDgwMjU0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEwLjY5MTE5MSA2NC41Njc1NTFjLTI0Ni41NDgyMzIgMC00NDcuMTI1NDU3IDIwMC41NzgyNDgtNDQ3LjEyNTQ1NyA0NDcuMTI1NDU3IDAgMjQ2LjU0MzExNiAyMDAuNTc4MjQ4IDQ0Ny4xMjU0NTcgNDQ3LjEyNTQ1NyA0NDcuMTI1NDU3IDI0Ni41NDMxMTYgMCA0NDcuMTI1NDU3LTIwMC41ODIzNDEgNDQ3LjEyNTQ1Ny00NDcuMTI1NDU3Qzk1Ny44MTY2NDggMjY1LjE0NDc3NiA3NTcuMjM0MzA3IDY0LjU2NzU1MSA1MTAuNjkxMTkxIDY0LjU2NzU1MXpNNTEwLjY5MTE5MSA4NjMuNDg5MzA2Yy0xOTMuOTgyMDE2IDAtMzUxLjc5NjI5OC0xNTcuODE0MjgyLTM1MS43OTYyOTgtMzUxLjc5NjI5OHMxNTcuODE0MjgyLTM1MS43OTYyOTggMzUxLjc5NjI5OC0zNTEuNzk2Mjk4Uzg2Mi40ODc0ODkgMzE3LjcxMDk5MiA4NjIuNDg3NDg5IDUxMS42OTMwMDggNzA0LjY3MzIwOCA4NjMuNDg5MzA2IDUxMC42OTExOTEgODYzLjQ4OTMwNnoiIHAtaWQ9IjI0MjciIGZpbGw9IiM1RDVENUQiPjwvcGF0aD48cGF0aCBkPSJNNTEwLjY5MTE5MSA1MTEuNjkzMDA4bS0yMTQuNDkxMTE5IDBhMjA5LjYwNiAyMDkuNjA2IDAgMSAwIDQyOC45ODIyMzggMCAyMDkuNjA2IDIwOS42MDYgMCAxIDAtNDI4Ljk4MjIzOCAwWiIgcC1pZD0iMjQyOCIgZmlsbD0iIzVENUQ1RCI+PC9wYXRoPjwvc3ZnPg==">
    </div>
    <div class="svg-select-triangle-up" v-show="showPanel"/>
    <div class="svg-select-panel" v-show="showPanel">
      <div class="svg-select-panel-head">
        <div class="svg-select-panel-prev" @click="$_prev">
          <div class="svg-select-triangle-left"></div>
        </div>
        <div class="svg-select-panel-head-tabs">
          <div id="translateId" class="svg-select-panel-head-translateX"
               :style="{transform: 'translateX(' + translateX + 'px)'}">
            <div :class="{svgActiveType: activeType === iconObj.type}" :id="iconObj.type"
                 @click="$_changeType(iconObj.type)" class="svg-select-panel-tab" v-for="(iconObj,index) in icons"
                 :key="index">
              {{ iconObj.type }}
            </div>
          </div>
        </div>
        <div class="svg-select-panel-next" @click="$_next">
          <div class="svg-select-triangle-right"></div>
        </div>
      </div>
      <div class="svg-select-panel-content" v-for="(iconObj,index) in icons" :key="index"
           v-show="activeType === iconObj.type">
        <img class="svg-select-icon" @click="$_clickIcon(icon)" :src="icon" style="fill:red;"
             v-for="(icon,index) in iconObj.icons" :key="index">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-svg-select",
  props: {
    icons: {
      type: Array
    },
    defaultIcon: {
      type: String
    }
  },
  watch: {
    defaultIcon: {
      handler: function () {
        this.selectIcon = this.defaultIcon;
      }
    },
    selectIcon: {
      handler: function () {
      }
    }
  },
  data() {
    return {
      showPanel: false,
      activeType: undefined,
      translateX: 0,
      translateXStep: 10,
      translateLength: 0,
      selectIcon: undefined
    }
  },
  mounted() {
    this.activeType = this.icons[0].type;
    this.selectIcon = this.defaultIcon;
    let vm = this;
    window.onclick = function (event) {
      if (event.target.className !== "theme-panel-options" &&
          event.target.className !== "svg-select-inner-img" &&
          event.target.className !== "svg-select-panel-content" &&
          event.target.className !== "svg-select-panel-tab" &&
          event.target.className !== "svg-select-panel-tab svgActiveType" &&
          event.target.className !== "svg-select-panel-head-translateX" &&
          event.target.className !== "svg-select-triangle-right" &&
          event.target.className !== "svg-select-triangle-left"
      ) {
        vm.showPanel = false;
      }
    }
  },
  methods: {
    $_getTranslateLength() {
      if (this.translateLength === 0) {
        let translateLength = 0;
        for (let i = 0; i < this.icons.length; i++) {
          let divWidth = document.getElementById(this.icons[i].type).offsetWidth;
          translateLength += divWidth;
        }
        this.translateLength = translateLength;
      }
      return this.translateLength;
    },
    $_toggle() {
      this.showPanel = !this.showPanel;
    },
    $_clickIcon(icon) {
      this.selectIcon = icon;
      this.showPanel = !this.showPanel;
      let icons = icon.split("/");
      let iconSvg = icons[icons.length - 1];
      let iconName = iconSvg.split(".")[0];
      this.$emit("change", iconName, icon);
    },
    $_changeType(type) {
      this.activeType = type;
    },
    $_prev() {
      let translate = document.getElementById("translateId");
      let translateLength = this.$_getTranslateLength();
      if (translateLength > translate.offsetWidth) {
        if (this.translateX + this.translateXStep > 0) {
          this.translateX = 0;
        } else {
          this.translateX = this.translateX + this.translateXStep;
        }
      }
    },
    $_next() {
      let translate = document.getElementById("translateId");
      let translateLength = this.$_getTranslateLength();
      if (translateLength > translate.offsetWidth) {
        if (this.translateX - this.translateXStep < (translate.offsetWidth - translateLength)) {
          this.translateX = translate.offsetWidth - translateLength;
        } else {
          this.translateX = this.translateX - this.translateXStep;
        }
      }
    }
  }
}
</script>

<style scoped>
.svg-select-outer {
  border-radius: 5px;
  width: 24px;
  height: 24px;
  position: relative;
  margin-left: 128px;
}

.svg-select-inner {
  width: 10px;
  height: 10px;
}

.svg-select-inner-img {
  width: 16px;
  height: 16px;
  margin-left: 3px;
}

.svg-select-panel-tab {
  display: inline-block;
  height: 100%;
  line-height: 28px;
  text-align: center;
  padding: 0 4px;
  cursor: pointer;
}

.svg-select-panel-prev, .svg-select-panel-next {
  display: inline-block;
  position: absolute;
  cursor: pointer;
  z-index: 100;
}

.svg-select-panel-prev {
  left: -2px;
  top: 5px;
}

.svg-select-panel-next {
  left: 269px;
  top: 5px;
}

.svg-select-panel {
  width: 286px;
  height: 255px;
  border-radius: 5px;
  position: absolute;
  top: 29px;
  left: -233px;
  z-index: 100;
  box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 35%);
}

.svg-select-panel-head {
  width: 98%;
  margin: 0 1%;
  height: 30px;
  position: relative;
}

.svg-select-panel-head-tabs {
  margin-left: 16px;
  width: 89%;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}

.svg-select-panel-content {
  width: 100%;
  height: 250px;
}

.svg-select-icon {
  width: 27px;
  height: 27px;
  margin-top: 4px;
  margin-left: 4px;
}

.svg-select-triangle-up {
  width: 0;
  height: 0;
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  position: absolute;
  top: 21px;
}

.svg-select-triangle-left {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-right: 8px solid rgb(228, 228, 228);
  border-bottom: 6px solid transparent;
  margin-left: 7px;
  margin-top: 4px;
}

.svg-select-triangle-right {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-left: 8px solid rgb(228, 228, 228);
  border-bottom: 6px solid transparent;
  margin-left: -2px;
  margin-top: 4px;
}
</style>