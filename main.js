import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222233);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  27,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 8;

// Renderer setup
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const radius = 1.2;
const widthSegements = 64;
const heightSegements = 32;
const orbitRadius = 4;
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
const spheres = new THREE.Group();

for (let i = 0; i < 4; i++) {
  const geometry = new THREE.SphereGeometry(radius, widthSegements, heightSegements);
  const material = new THREE.MeshBasicMaterial({ color: colors[i] });
  const sphere = new THREE.Mesh(geometry, material);

  const angle = i * (Math.PI / 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.add(sphere);
}

spheres.rotation.x = 0.2;
spheres.position.y = -0.4;
scene.add(spheres);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();