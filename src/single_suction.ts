const PathMtl = './single/单吸1风机叶轮.glb';
const PathMtl1 = './single/非电机侧.glb';
const PathMtl2 = './single/单吸3风机外壳.glb';
const PathMtl3 = './single/电机侧.glb';
const PathMtl4 = './single/单吸5联轴器.glb';
const PathMtl5 = './single/单吸7电机负荷侧轴承.glb';
const PathMtl6 = './single/单吸6电机.glb';
const PathMtl7 = './single/单吸8电机自由侧轴承.glb';
const arr = [
  {
    url: PathMtl,
    position: { x: -0.35, y: 0, z: 0 },
    name: 'diagnosis_fan_ubf',
    status: 'fine'
  },
  {
    url: PathMtl1,
    position: { x: -0.7, y: -0.05, z: 0 },
    status: 'fine',
    name: 'diagnosis_bearing_FN'
  },
  {
    url: PathMtl2,
    position: { x: -0.41, y: -0.03, z: -0.08 },
    status: 'fine',
    name: 'box'
  },
  {
    url: PathMtl3,
    position: { x: -0.09, y: -0.05, z: 0 },
    status: 'fine',
    name: 'diagnosis_bearing_FM'
  },
  {
    url: PathMtl4,
    position: { x: 0.01, y: 0, z: 0 },
    status: 'fine',
    name: 'diagnosis_cpl_misaf'
  },
  {
    url: PathMtl5,
    position: { x: 0.11, y: 0, z: 0 },
    status: 'fine',
    name: 'diagnosis_bearing_ML'
  },
  {
    url: PathMtl6,
    position: { x: 0.32, y: 0.01, z: 0.032 },
    status: 'fine',
    name: 'diagnosis_motor'
  },
  {
    url: PathMtl7,
    position: { x: 0.65, y: 0, z: 0 },
    status: 'fine',
    name: 'diagnosis_bearing_MF'
  }
];
export default arr;
