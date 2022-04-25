import promisifyMap from './promisifyMap'
import promisifyMethod from './methodsConfig'
import { Map } from 'mapbox-gl'
import IMapActions from './mapActions'

export default function promisify(
  map: Map,
  methodName: string = null
): ((...args: any) => Promise<object>) | IMapActions {
  if (methodName) {
    return promisifyMethod(map, methodName)
  } else {
    return promisifyMap(map)
  }
}