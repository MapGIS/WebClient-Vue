const WORLD_SIZE = 1024000;
const MERCATOR_A = 6378137.0;

module.exports = exports = {
    WORLD_SIZE: WORLD_SIZE,
    PROJECTION_WORLD_SIZE: WORLD_SIZE / (MERCATOR_A * Math.PI * 2),
    MERCATOR_A: MERCATOR_A, // 900913 projection property
    DEG2RAD: Math.PI / 180,
    RAD2DEG: 180 / Math.PI,
    EARTH_CIRCUMFERENCE: 40075000, // In meters
}