# Marker

## 属性

### `offset`

- **类型**: `Array<number>`
- **描述:** The offset in pixels as a PointLike object to apply relative to the element's center. Negatives indicate left and up.
- **查看:** `offset` in [Marker](https://docs.mapbox.com/mapbox-gl-js/api/#marker)

### `coordinates`

- **类型**: `Array<number>`
- **必传**
- **侦听属性**
- **描述:** Marker coordinates in format `[longitude, latitude]`

### `color`

- **类型**: `string`
- **描述:** The color to use for the default marker if custom marker is not provided. The default is light blue.

### `anchor`

- **类型**: `string`
- **非侦听属性**
- **默认值** `center`
- **描述:** A string indicating the part of the Marker that should be positioned closest to the coordinate set via Marker#setLngLat . Options are 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right' . The default is 'center'.
- **查看** `options.anchor` in [Marker](https://docs.mapbox.com/mapbox-gl-js/api/#marker)

### `draggable`

- **类型**: `boolean`
- **非侦听属性**
- **默认值** `false`
- **描述:** A boolean indicating whether or not a marker is able to be dragged to a new position on the map.
- **查看** `options.draggable` in [Marker](https://docs.mapbox.com/mapbox-gl-js/api/#marker)

## 槽

### `marker`

- **描述:** Slot for custom marker. Can be HTML element or Vue component.

### `default`

- **描述:** Slot for popup component. When popup put inside marker, popup automaticaly mounted to marker, similiar as [setPopup](https://docs.mapbox.com/mapbox-gl-js/api/#marker#setpopup)

## 方法

### `.remove()`

- **描述:** Removes marker from the map.
- **返回值** `Marker` MapboxGL marker.
- **查看** [Marker.remove](https://docs.mapbox.com/mapbox-gl-js/api/#marker#remove)

### `.togglePopup()`

- **描述:** Opens or closes the bound popup, depending on the current state.
- **返回值** `Marker` MapboxGL marker.
- **查看** [Marker.togglePopup](https://docs.mapbox.com/mapbox-gl-js/api/#marker#togglepopup)

## 事件

### `@added`

- **描述:** Fires when marker added on the map.
- **Payload** `{ component: MarkerComponent, map: Map, marker: Marker }` Object with `Marker` component, parent map and MapboxGl `Marker` object

### `@removed`

- **描述:** Fires when marker removed the map.
- **Payload** `{ component: MarkerComponent, map: Map, marker: Marker }` Object with `Marker` component, parent map and MapboxGl `Marker` object

### `@drag`

- **描述:** Fires when marker dragged if marker `draggable` prop is `true`
- **Payload** `{ component: MarkerComponent, map: Map, mapboxEvent: Event }` Object with `Marker` component, parent map and original MapboxGl event

### `@dragstart`

- **描述:** Fires when marker dragging starts if marker `draggable` prop is `true`
- **Payload** `{ component: MarkerComponent, map: Map, mapboxEvent: Event }` Object with `Marker` component, parent map and original MapboxGl event

### `@dragend`

- **描述:** Fires when marker dragging ends if marker `draggable` prop is `true`
- **Payload** `{ component: MarkerComponent, map: Map, mapboxEvent: Event }` Object with `Marker` component, parent map and original MapboxGl event

### `@click` <Badge text="experimental" type="warn"/>

- **描述:** Fires marker is clicked.
- **Payload**

```
    {
        component: MarkerComponent,
        map: Map,
        mapboxEvent: DOMEvent,
        marker: Marker
    }
```

Object with `Marker` component, parent map and original MapboxGl event

### `@mouseenter` <Badge text="experimental" type="warn"/>

- **描述:** Fires when mouse cursor enters marker area.
- **Payload**

```
    {
        component: MarkerComponent,
        map: Map,
        mapboxEvent: DOMEvent,
        marker: Marker
    }
```

Object with `Marker` component, parent map and original MapboxGl event

### `@mouseleave` <Badge text="experimental" type="warn"/>

- **描述:** Fires when mouse cursor leaves marker area.
- **Payload**

```
    {
        component: MarkerComponent,
        map: Map,
        mapboxEvent: DOMEvent,
        marker: Marker
    }
```

Object with `Marker` component, parent map and original MapboxGl event
