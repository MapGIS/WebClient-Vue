import WidgetState from '../utils/widget-state'

export default class WidgetManager {
  constructor() {
    this.activeWidget = null
  }

  static getInstance() {
    // 单例
    if (!this.instance) {
      this.instance = new WidgetManager()
    }
    return this.instance
  }

  openWidget(widget) {
    this.deActivateWidget()
    widget.state = WidgetState.OPENED
    // 打开延迟10毫秒激活
    setTimeout(() => {
      this.activateWidget(widget)
    }, 10)
  }

  deActivateWidget() {
    if (this.activeWidget) {
      this.activeWidget.state = WidgetState.OPENED
      this.activeWidget = null
    }
  }

  activateWidget(widget) {
    if (widget.state !== WidgetState.OPENED) {
      return
    }

    if (this.activeWidget) {
      if (this.activeWidget.id !== widget.id) {
        if (this.activeWidget.state === WidgetState.ACTIVE) {
          this.activeWidget.state = WidgetState.OPENED
        }
      }
    }

    this.activeWidget = widget
    this.activeWidget.state = WidgetState.ACTIVE
  }

  isWidgetActive(widget) {
    return widget.state === WidgetState.ACTIVE
  }

  isWidgetVisible(widget) {
    return widget.state !== WidgetState.CLOSED
  }

  closeWidget(widget) {
    if (widget.state !== WidgetState.CLOSED) {
      if (this.activeWidget && this.activeWidget.id === widget.id) {
        this.activeWidget = null
        widget.state = WidgetState.OPENED
      }

      widget.state = WidgetState.CLOSED
    }
  }

  triggerWidgetOpen(widget) {
    if (widget.state === WidgetState.CLOSED) {
      this.openWidget(widget)
    } else {
      this.closeWidget(widget)
    }
  }
}
