import API from "./API";
import { getPortalUrl, getMapGISUrl, getMapgisToken, getPortalToken } from "../config/mapgis";

/**
 * 获取门户的数据资源
 * @param {*} resourceType 
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getPortalData(resourceType, page, pageSize) {
  let url = getPortalUrl();
  const api = new API();
  const token = getPortalToken();

  api.setBaseUrl(url);
  // let token = sessionStorage.getItem("mapgis-cloud-portal-jwt");
  console.warn('【门户】【UI组件】【是否可以获取到token】', token);
  api.setAuthorization(token);
  return api.get(
    "/portal/ptResource/page?resourceType=" + resourceType + "&page=" + page + "&pageSize=" + pageSize + "&datasourceType=1"
  );
  // + '&Authorization=' + token
}


export function getPortalServices(serviceType, page, pageSize) {
  let url = getPortalUrl();
  const api = new API();
  const token = getPortalToken();

  api.setBaseUrl(url);
  // let token = sessionStorage.getItem("mapgis-cloud-portal-jwt");
  console.warn('【门户】【UI组件】【是否可以获取到token】', token);
  api.setAuthorization(token);
  return api.get(
    "/portal/resources/services?serviceType=" + serviceType + "&page=" + page + "&pageSize=" + pageSize + "&filter=page"
  );
}
