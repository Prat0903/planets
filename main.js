import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Scene setup
const scene = new THREE.Scene();

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

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rogland_clear_night_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const starTexture = new THREE.TextureLoader().load('./stars.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;
const starGeometry = new THREE.SphereGeometry(30, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  transparent: true,
  opacity: 0.8,
  side: THREE.BackSide,
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

const radius = 1.3;
const widthSegements = 64;
const heightSegements = 32;
const orbitRadius = 4;
const textures = [
  './jupiter/color.png',
  './earth/map.jpg',
  './venus/map.jpg',
  './neptune/color.png',
];
const spheres = new THREE.Group();
const spheresMesh = [];

for (let i = 0; i < 4; i++) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(radius, widthSegements, heightSegements);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

  spheresMesh.push(sphere);

  const angle = i * (Math.PI / 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.add(sphere);
}

spheres.rotation.x = 0.18;
spheres.position.y = -0.7;
scene.add(spheres);

let lastWheelTime = 0;
let scrollCount = 0;

function handleWheel() {
  const now = Date.now();
  if (now - lastWheelTime >= 1500) {
    lastWheelTime = now;
    scrollCount = (scrollCount + 1) % 4;

    const headings = document.querySelectorAll('.heading');
    gsap.to(headings, {
      y: `-=${100}%`,
      duration: 1,
      ease: 'power2.inOut',
    })
    gsap.to(spheres.rotation, {
      y: `+=${Math.PI / 2}`,
      duration: 1,
      ease: 'power2.inOut',
    })

    if (scrollCount === 0) {
      gsap.to(headings, {
        y: 0,
        duration: 1,
        ease: 'power2.inOut',
      })
    }
  }
}

window.addEventListener('wheel', handleWheel);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let clock = new THREE.Clock();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < spheresMesh.length; i++) {
    let sphere = spheresMesh[i];
    sphere.rotation.y = clock.getElapsedTime() * 0.02;
  }
  renderer.render(scene, camera);
}
animate();