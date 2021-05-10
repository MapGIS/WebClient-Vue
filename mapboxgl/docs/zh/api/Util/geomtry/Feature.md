# Feature

## constructor

### `geometry`

- **类型:** [Geometry]
- **Non-Synced**
- **描述:** 要素的几何信息，一个要素可包含多个几何信息，例如一个区要素可以包含多个区域坐标点集合.
- **参考:** `Geometry` in [Geometry](/zh/api/Util/geomtry/Geometry.md)

### `geometryType`

- **类型:** `Number`
- **Non-Synced**
- **描述:** 要素所包含的几何类型，1:点,2:线,3:面

### `attributes`

- **类型:** `Object`
- **Non-Synced**
- **描述:** 要素所包含的属性信息。
- **示例:** {key1:"value1",key2:"value2",key3:"value3"}

### `style`

- **类型:** `Object`
- **Non-Synced**
- **描述:** 要素的样式信息

### `FID`

- **类型:** `Number`
- **Non-Synced**
- **描述:** 要素的FID，更新时要用

## Functions

### `fromQueryResult(FeatureSet)`
- **类型:** `static Function`
- **Non-Synced**
- **描述:** 将webclient-es6-service的查询方法返回的result对象转为Feature数组
- **参数:** result Object 通过webclient-es6-service的查询方法返回的result对象 
- **返回值:** features [Feature] Feature对象数组 

### `fromGeoJSON(geoJSON)`
- **类型:** `static Function`
- **Non-Synced**
- **描述:** 将geoJSON格式的对象转换为Feature数组
- **参数:** geoJSON Object geoJSON对象
- **返回值:** features [Feature] Feature对象数组 