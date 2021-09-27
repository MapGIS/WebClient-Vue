# Webclient-Vue-Ui

敬请期待...


## 组件增强说明

1、Select、Input 组件添加属性：`autoWidth`，设置为 true 时可实现宽度 100% 自适应。

2、Card 组件已添加属性：`customPosition`，可控制卡片显示的绝对位置：

```javascript
customPosition: {
  type: String,
  default: '',
  validator: v =>
    [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left'
    ].includes(v)
},
```
3、基于List组件增加无限加载列表组件：`mapgis-ui-infinite-list`，详情可查看StoryBook。
