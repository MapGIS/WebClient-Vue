import isequal from "lodash.isequal";

export function compareStyle(oldStyle, newStyle) {
  let equal = true;
  if (!oldStyle || !newStyle) return false;

  let newSprite = newStyle.sprite;
  let newGlyphs = newStyle.glyphs;
  let oldSprite = oldStyle.sprite;
  let oldGlyphs = oldStyle.glyphs;
  if (newSprite != oldSprite || newGlyphs != oldGlyphs) {
    equal = false;
    return equal;
  }
  let newLayers = newStyle.layers;
  let oldLayers = oldStyle.layers;
  equal = compareLayers(newLayers, oldLayers);
  return equal;
}

export function compareLayers(oldLayers, newLayers) {
  let equal = true;
  if (oldLayers.length != newLayers.length) {
    equal = false;
    return equal;
  }

  for (let i = 0; i < oldLayers.length; i++) {
    equal = compareLayer(oldLayers[i], newLayers[i]);

    if (!equal) return false;
  }
  return equal;
}

export function compareLayer(oldLayer, newLayer) {
  let equal = false;
  if (!oldLayer || !newLayer) return false;

  equal =
    isequal(oldLayer.id, newLayer.id) &
    isequal(oldLayer.minzoom, newLayer.minzoom) &
    isequal(oldLayer.maxzoom, newLayer.maxzoom) &
    isequal(oldLayer.layout, newLayer.layout) &
    isequal(oldLayer.paint, newLayer.paint) &
    isequal(oldLayer.filter, newLayer.filter);

  return equal;
}
