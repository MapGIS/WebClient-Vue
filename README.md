# MapGIS WebClient for Vue

[![npm version][npm-img]][npm-url]
[![apache licensed](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](https://github.com/MapGIS/WebClient-JavaScript/blob/master/LICENSE)

[npm-img]: https://img.shields.io/badge/npm-10.5.0-brightgreen
[npm-url]: https://www.npmjs.com/package/@mapgis/webclient

<img alt="MapGIS" src="mapboxgl/docs/zh/images/framework/webclient-vue-mapboxgl.png">

## 目录
- [MapGIS WebClient for Vue](#mapgis-webclient-for-vue)
  - [目录](#目录)
  - [一、开始](#一开始)
    - [1、司马云](#1司马云)
    - [2、特性](#2特性)
  - [二、深入了解](#二深入了解)
    - [1、代码结构](#1代码结构)
    - [2、编译](#2编译)
    - [3、本地调试](#3本地调试)

## 一、开始

### 1、司马云
[MapGIS Client for JavaScript](http://develop.smaryun.com:8899/)

### 2、特性
1. `组件式风格` - Vue组件式开发
2. `面向对象编程` - 地图元素拥有 Vue 的生命周期，将原生地图事件封装成 Vue 的事件


## 二、深入了解
### 1、代码结构
``` text
 |-- WebClient-JavaSript
    |-- cesium                    -- Cesium的代码结构
        |--src                    -- Cesium源代码
        |--docs                   -- Vuepress文档说明
    |-- mapboxgl                  -- Mapboxgl 代码结构
        |--src                    -- MapboxGL源代码
        |--docs                   -- Vuepress文档说明
```

### 2、编译

如果您需修改源码，可自行编译打包生成OpenLayers、Leaflet、MapBoxGL、Cesium的地图引擎库、API文档。

`以MapboxGL`为例，首先进入对应的目录下

0. 进入目录
    ``` sh
    cd /path/to/mapboxgl
    ```

1. 安装依赖
    ``` sh
    npm install
    # 或者
    yarn
    ```

2. 地图组件编译
    ``` sh
    npm run build           #编译 将源代码编译成Vue的地图组件
    ```

3. API文档生成
    ``` sh
    npm run docs:serve      #服务实时预览-生成API参考文档
    npm run docs:build      #编译打包预览-生成API参考文档
    ```
### 3、本地调试
`以MapboxGL`为例，首先进入对应的目录下，假设用户存在2个工程：1.WebClient-Vue 2.项目工程 MyProject

1. 进入对应的目录
    ``` sh
    cd /path/to/WebClient-Vue/mapboxgl
    ```
2. 执行本地链接操作
    ``` sh
    npm link
    ```

    `得到对应的结果`

    ``` sh
    ```
3. 进入自己的项目工程
    ``` sh
    cd /path/to/MyProject
    ```
4. 指定连接的WebClient-Vue库
    ``` sh
    npm link @mapgis/webclient-vue-mapboxgl
    ```
    `得到对应的结果`
    ``` sh
    ```