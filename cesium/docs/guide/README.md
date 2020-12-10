# 快速上手

##  ES6 方式

### 中地版本安装 `建议使用`

> 由于cesium本身`涉及大量的纹理材质以及多线程Worker`， 公司内部修改版实现`M3D格式`， M3D`不是`3dtile，是中地数码自己独特的格式，与开源的3dtile不是一种格式。很多高级分析功能`只能作用于M3D`,而不支持3d tile.

webclient-vue-cesium支持一层封装，除了本身需要安装以外，你还需要拷贝@mapgis/cesium

```bash
# 不同时安装@mapgis/cesium的原因在于这个对外的是非高级版本，事业部一般全内部使用高级版本开发
npm install --save @mapgis/webclient-vue-cesium
```

::: danger
要实现cesium主体的引入，一定要看下面的`文件拷贝`章节, 光是@mapgis/webclient-vue-cesium 是无法正常开发的 Orz...
:::

### 文件拷贝
由于标准的Cesium在支持Webpack编译的时候也是采取的copy插件来执行对应的文件夹拷贝操作。 因此为了统一处理，这里`统一不采取`手动修改webpack.config的方式，而是将cesium的所有文件放在public或者asset的某个目录下，自己`手动实现`静态资料的拷贝

::: warning
这样做的本质原因是，MapGIS的高级版本的Cesium是只对内不对外提供，导致不同事业部的Cesium版本各不一致
:::

以`@mapgis/cesium`的包结构展示如下：
![代码结构](./cesium_dist.png)

> 请将上述文件统一拷贝到你的vue工程对应的public文件夹下的某个目录中，记录对应的路径为

``` sh
# quasar 的静态资源目录为src/static
# 常见的静态资源目录为 public
# 主Cesium主体路径
path/to/statics/cesium/Cesium.js
# Cesium拓展插件路径
path/to/statics/cesium/webclient-cesium-plugins.js
```
> 如果在浏览器中 访问 `http://localhost:xxxx/path/to/statics/cesium/Cesium.js` 成功则说明整个Cesium的环境准备已经完毕。

## 浏览器使用

### 安装
::: warning
~ 纯浏览器端建议还是使用Cesium原生的方式，而不是Vue组件的方式，真心建议
:::

## 高级版本
1. 由于公司的cdn包不在公网上发布，统一在[司马云](http://www.smaryun.com)上获取，`高级收费版本`请联系三维部门内部获取.
    - 针对m3d的`性能优化`
    - 针对m3d的`调度优化`
    - 针对一些公司平台`C++内核`代码高级空间分析功能
1. webclient-cesium-plugins.js请联系潘卓然 或者从[司马云](http://develop.smaryun.com:8899/#/total/download)下载
    - 针对常见的`业务开发`进行业务封装
    - 针对`IGServer、DataStore`的服务进行封装
    - 针对一些`高级开源`技术进行封装


