export default class PanelManager {
  constructor() {
    this.panels = []
  }

  static getInstance() {
    // 单例
    if (!this.instance) {
      this.instance = new PanelManager()
    }
    return this.instance
  }

  addPanel(panel) {
    this.panels.push(panel)
  }

  removePanel(panel) {
    this.panels.filter(item => item.id != panel.id)
  }

  getPanels() {
    return this.panels
  }
}
