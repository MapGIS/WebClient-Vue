let pointData = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [114.31, 30.81]
    },
    "properties": {
      "Name": "test"
    }
  }]
}

let polylineData = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [[114.31, 30.81],[114.33, 30.83],[114.35, 30.85]]
    },
    "properties": {
      "Name": "test1"
    }
  },{
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [[114.41, 30.21],[114.47, 30.77],[114.49, 30.89]]
    },
    "properties": {
      "Name": "test2"
    }
  }]
}

let polygonData = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0]
        ]
      ]
    },
    "properties": {
      "Name": "test3"
    }
  }]
}

let multiPolygonData = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [
        [
          [
            [180.0, 40.0], [180.0, 50.0], [170.0, 50.0],
            [170.0, 40.0], [180.0, 40.0]
          ]
        ],
        [
          [
            [-170.0, 40.0], [-170.0, 50.0], [-180.0, 50.0],
            [-180.0, 40.0], [-170.0, 40.0]
          ]
        ]
      ]
    },
    "properties": {
      "Name": "test1"
    }
  }]
}

export {pointData,polylineData,polygonData,multiPolygonData}