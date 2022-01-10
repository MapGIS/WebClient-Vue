/**
 * @description 当前用户文件夹,强调当前目录的归属权在当前用户自身
 */
export const OWNERSHIP_USER_FOLDER = -100;

/**
 * @description 当前用户打开的组织文件夹
 */
export const OWNERSHIP_GROUP_FOLDER = -99;

/**
 * @description 全局公共资源分享给当前用户,强调当前目录的归属权在公共资源那边
 */
export const OWNERSHIP_PUBLIC_SHARE_TO_USER = -98;

/**
 * @description 其他用户资源分享给当前用户,强调当前目录的归属权在分享来的用户那边
 */
export const OWNERSHIP_OTHER_SHARE_TO_USER = -97;

export const OWNERSHIPS = [
  OWNERSHIP_USER_FOLDER,
  OWNERSHIP_GROUP_FOLDER,
  OWNERSHIP_PUBLIC_SHARE_TO_USER,
  OWNERSHIP_OTHER_SHARE_TO_USER
];
