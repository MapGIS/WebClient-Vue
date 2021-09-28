const initStyle = {
  textType: "宋体",
  textColor: "#1890ff",
  textSize: "14",
  lineType: "实线",
  lineColor: "#1890ff",
  lineOpacity: 1,
  lineWidth: 3,
  fillColor: "#1890ff",
  fillOpacity: 0.4
};

class Dep {
  subs = [];

  result = null;

  styles = { ...initStyle };

  resetStyles() {
    return this.setStyles(initStyle);
  }

  getStyles() {
    return this.styles;
  }

  setStyles(styles) {
    if (JSON.stringify(this.styles) !== JSON.stringify(styles)) {
      this.styles = { ...styles };
    }
    return this.styles;
  }

  getResult() {
    return this.result;
  }

  setResult(result) {
    this.result = { ...result };
  }

  addSub(item) {
    this.subs.push(item);
  }

  removeSub(item) {
    this.subs.splice(this.subs.indexOf(item), 1);
  }

  notify() {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update();
    }
  }
}

const dep = new Dep();

export default dep;
