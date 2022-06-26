import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";
import * as dat from "dat.gui";
const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};

gui.add(world.plane, "height", 1, 20, 0.001).onChange(() => refreshGeometry());
gui.add(world.plane, "width", 1, 20, 0.001).onChange(() => refreshGeometry());
gui
  .add(world.plane, "widthSegments", 1, 50, 0.001)
  .onChange(() => refreshGeometry());
gui
  .add(world.plane, "heightSegments", 1, 50, 0.001)
  .onChange(() => refreshGeometry());

const refreshGeometry = () => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
  }
};

const rayCaster = new THREE.Raycaster();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random();
}

const colors = [];
const { count } = planeMesh.geometry.attributes.position;
for (let i = 0; i < count; i++) {
  colors.push(1, 1, 1);
}
planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const mouse = {
  x: undefined,
  y: undefined,
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  rayCaster.setFromCamera(mouse, camera);
  const intersects = rayCaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const intersectsFace = intersects[0].face;
    const colorAttribute = intersects[0].object.geometry.attributes.color;
    colorAttribute.setX(intersectsFace.a, 0);
    colorAttribute.setY(intersectsFace.a, 2);
    colorAttribute.setZ(intersectsFace.a, 1);

    colorAttribute.setX(intersectsFace.b, 0);
    colorAttribute.setY(intersectsFace.b, 2);
    colorAttribute.setZ(intersectsFace.b, 1);

    colorAttribute.setX(intersectsFace.c, 0);
    colorAttribute.setY(intersectsFace.c, 2);
    colorAttribute.setZ(intersectsFace.c, 1);

    colorAttribute.needsUpdate = true;
  }
};
window.addEventListener("resize", onWindowResize, false);
animate();

addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
