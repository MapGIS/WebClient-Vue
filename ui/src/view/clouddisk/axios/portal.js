import API from "./API";
import { getMapGISUrl, getMapgisToken } from "../config/mapgis";

export function getPortalUrl () {
  return 'http://192.168.176.1:6160/'
}

/**
 * 获取门户的数据资源
 * @param {*} resourceType 
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getPortalResource(resourceType, page, pageSize) {
  const url = getPortalUrl();
  const api = new API();
  // const token = getMapgisToken();
  api.setBaseUrl(url);
  // api.setAuthorization(token);
  return api.get(
    "/portal/ptResource/page?resourceType=" + resourceType + "&page=" + page + "&pageSize=" + pageSize + "&orderBy=create_time&search=&tagSearch="
  );
}
