import './index.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const scene = new THREE.Scene();
const clock = new THREE.Clock();
const stats = new Stats();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-canva'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// controls
const controls = new OrbitControls( camera, renderer.domElement );


// Loading custom models
const loader = new GLTFLoader();

/*
loader.load( 'assets/models/sedanSports.glb', function ( gltf ) {

	scene.add( gltf.scene);
  gltf.scene.rotation.x += 0.10;
  gltf.scene.rotation.z = 0.99;
  gltf.scene.rotation.y += 0.10;
  gltf.scene.scale.set(0.50, 0.50, 0.50 );
  let tempONScrollFunc = () => {
    const t = document.body.getBoundingClientRect().top;
    gltf.scene.position.z = t * 0.01;
    gltf.scene.position.x = t * 0.0002;
    gltf.scene.rotation.y = t * 0.0002;
  }
  document.body.onscroll = tempONScrollFunc;
  tempONScrollFunc();

}, undefined, function ( error ) {

	console.error( error );

} );*/

loader.load( 'assets/models/large-building.glb', function ( gltf ) {

	scene.add( gltf.scene);
  gltf.scene.rotation.x += 0.10;
  gltf.scene.rotation.z = 0.99;
  gltf.scene.rotation.y += 0.10;
  gltf.scene.scale.set(0.50, 0.50, 0.50 );

}, undefined, function ( error ) {

	console.error( error );

} );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const getParticles = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(getParticles);

// Background

const bgTexture = new THREE.TextureLoader().load('assets/gfx/sky.jpg');
scene.background = bgTexture;

const earthTexture = new THREE.TextureLoader().load('assets/gfx/earth.png');
const normalTexture = new THREE.TextureLoader().load('assets/gfx/normal.jpg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);

scene.add(earth);

earth.position.z = 30;
earth.position.setX(-10);
// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  earth.rotation.x += 0.05;
  earth.rotation.y += 0.075;
  earth.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.x += 0.005;
  let delta = clock.getDelta();
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

animate();