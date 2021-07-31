import API from "./API";
import { getPortalUrl, getMapGISUrl, getMapgisToken } from "../config/mapgis";

/**
 * 获取门户的数据资源
 * @param {*} resourceType 
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getPortalResource(resourceType, page, pageSize) {
  let url = getPortalUrl();
  const api = new API();
  // const token = getMapgisToken();
  api.setBaseUrl(url);
  // api.setAuthorization(token);
  let token = sessionStorage.getItem("mapgis-cloud-portal-jwt");
  console.warn('【门户】【UI组件】【是否可以获取到session】', token);
  api.setAuthorization(token);
  return api.get(
    "/portal/ptResource/page?resourceType=" + resourceType + "&page=" + page + "&pageSize=" + pageSize + "&datasourceType=1"
  );
  // + '&Authorization=' + token
}
