# Feature

## constructor

### `geometry`

- **类型:** [Geometry]
- **非侦听属性**
- **描述:** 要素的几何信息，一个要素可包含多个几何信息，例如一个区要素可以包含多个区域坐标点集合.
- **参考:** `Geometry` in [Geometry](/api/Util/geomtry/Geometry.md)

### `geometryType`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 要素所包含的几何类型，1:点,2:线,3:面

### `attributes`

- **类型:** `Object`
- **非侦听属性**
- **描述:** 要素所包含的属性信息。
- **示例:** {key1:"value1",key2:"value2",key3:"value3"}

### `style`

- **类型:** `Object`
- **非侦听属性**
- **描述:** 要素的样式信息

### `FID`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 要素的 FID，更新时要用

## 方法

### `fromQueryResult(FeatureSet)`

- **类型:** `static Function`
- **非侦听属性**
- **描述:** 将 webclient-es6-service 的查询方法返回的 result 对象转为 Feature 数组
- **参数:** result Object 通过 webclient-es6-service 的查询方法返回的 result 对象
- **返回值:** features [Feature] Feature 对象数组

### `fromGeoJSON(geoJSON)`

- **类型:** `static Function`
- **非侦听属性**
- **描述:** 将 geoJSON 格式的对象转换为 Feature 数组
- **参数:** geoJSON Object geoJSON 对象
- **返回值:** features [Feature] Feature 对象数组
