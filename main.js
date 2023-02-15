// import * as THREE from "three";
// import { ARButton } from "three/addons/webxr/ARButton.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const intersected = [];
// const tempMatrix = new THREE.Matrix4();

// // creating a scene
// let scene = new THREE.Scene();
// // scene.background = new THREE.Color('black');
// // make a div container
// let container = document.createElement("div");
// document.body.appendChild(container);
// // size of the viewport
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// let camera = new THREE.PerspectiveCamera(
//   50,
//   sizes.width / sizes.height,
//   1,
//   1000
// );
// camera.position.set(-150, 5, 30);

// const controls = new OrbitControls(camera, container);
// controls.minDistance = 0;
// controls.maxDistance = 8;
// controls.enableDamping = true;
// controls.enableZoom = true;
// controls.enablePan = true;

// // add a hemisherical light to the canvas
// scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
// // add a directional light to the canvas
// const light = new THREE.DirectionalLight(0xffffff);
// light.position.set(0, 0, 0);
// scene.add(light);

// // create light (it is needed for viewing the shapes)
// const light2 = new THREE.AmbientLight(0xffffff, 1, 1000);
// light2.position.set(0, 0, 0);
// scene.add(light2);

// const light1 = new THREE.DirectionalLight(0xffffff, 1, 1000);
// light1.position.set(10, 10, 0);
// scene.add(light1);

// // add the model
// const loader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
// loader.setDRACOLoader(dracoLoader);
// // Load a glTF resource
// loader.load(
//   // resource URL
//   "/models/plane/scene.gltf",
//   // called when the resource is loaded
//   function (gltf) {
//     console.log(gltf.scene);
//     gltf.scene.scale.set(1, 1, 1);
//     gltf.scene.position.x = 0; //Position (x = right+ left-)
//     gltf.scene.position.y = -500; //Position (y = up+, down-)
//     gltf.scene.position.z = 0;
//     scene.add(gltf.scene);
//   },
//   // called while loading is progressing
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened");
//   }
// );

// let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(sizes.width, sizes.height);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.xr.enabled = true;
// container.appendChild(renderer.domElement);
// document.body.appendChild(ARButton.createButton(renderer));

// let controller1 = renderer.xr.getController(0);
// controller1.addEventListener("selectstart", onSelectStart);
// controller1.addEventListener("selectend", onSelectEnd);
// scene.add(controller1);

// let controller2 = renderer.xr.getController(1);
// controller2.addEventListener("selectstart", onSelectStart);
// controller2.addEventListener("selectend", onSelectEnd);
// scene.add(controller2);

// let raycaster = new THREE.Raycaster();

// // resize and update the scene accordingly to the window dimensions
// window.addEventListener("resize", () => {
//   // update the div size to the window size
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;
//   // update the camera
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();
//   renderer.setSize(sizes.width, sizes.height);
// });

// function onSelectStart(event) {
//   const controller = event.target;

//   const intersections = getIntersections(controller);

//   if (intersections.length > 0) {
//     const intersection = intersections[0];

//     const object = intersection.object;
//     object.material.emissive.b = 1;
//     controller.attach(object);

//     controller.userData.selected = object;
//   }
// }

// function onSelectEnd(event) {
//   const controller = event.target;

//   if (controller.userData.selected !== undefined) {
//     const object = controller.userData.selected;
//     object.material.emissive.b = 0;
//     group.attach(object);

//     controller.userData.selected = undefined;
//   }
// }

// function getIntersections(controller) {
//   tempMatrix.identity().extractRotation(controller.matrixWorld);

//   raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
//   raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

//   return raycaster.intersectObjects(group.children, false);
// }

// function intersectObjects(controller) {
//   // Do not highlight when already selected

//   if (controller.userData.selected !== undefined) return;

//   const intersections = getIntersections(controller);

//   if (intersections.length > 0) {
//     const intersection = intersections[0];

//     const object = intersection.object;
//     object.material.emissive.r = 1;
//     intersected.push(object);
//   }
// }

// function cleanIntersected() {
//   while (intersected.length) {
//     const object = intersected.pop();
//     object.material.emissive.r = 0;
//   }
// }

// //

// function animate() {
//   renderer.setAnimationLoop(render);
// }
// animate();
// function render() {
//   cleanIntersected();

//   intersectObjects(controller1);
//   intersectObjects(controller2);

//   renderer.render(scene, camera);
// }

// const loop = () => {
//   controls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(loop);
// };
// loop();

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { XREstimatedLight } from "three/addons/webxr/XREstimatedLight.js";

let camera, scene, renderer;
let controller;
let defaultEnvironment;

init();
animate();

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  const defaultLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  defaultLight.position.set(0, 1, 0);
  scene.add(defaultLight);
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 0);
scene.add(light);

// create light (it is needed for viewing the shapes)
const light2 = new THREE.AmbientLight(0xffffff, 1, 1000);
light2.position.set(0, 0, 0);
scene.add(light2);

const light1 = new THREE.DirectionalLight(0xffffff, 1, 1000);
light1.position.set(10, 10, 0);
scene.add(light1);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  // Don't add the XREstimatedLight to the scene initially.
  // It doesn't have any estimated lighting values until an AR session starts.

  const xrLight = new XREstimatedLight(renderer);

  xrLight.addEventListener("estimationstart", () => {
    // Swap the default light out for the estimated one one we start getting some estimated values.
    scene.add(xrLight);
    scene.remove(defaultLight);

    // The estimated lighting also provides an environment cubemap, which we can apply here.
    if (xrLight.environment) {
      scene.environment = xrLight.environment;
    }
  });

  xrLight.addEventListener("estimationend", () => {
    // Swap the lights back when we stop receiving estimated values.
    scene.add(defaultLight);
    scene.remove(xrLight);

    // Revert back to the default environment.
    scene.environment = defaultEnvironment;
  });


  // In order for lighting estimation to work, 'light-estimation' must be included as either an optional or required feature.
  document.body.appendChild(
    ARButton.createButton(renderer, { optionalFeatures: ["light-estimation"] })
  );

// add the model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);
// Load a glTF resource
loader.load(
  // resource URL
  "/models/plane/scene.gltf",
  // called when the resource is loaded
  function (gltf) {
    console.log(gltf.scene);
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.position.x = 0; //Position (x = right+ left-)
    gltf.scene.position.y = 0; //Position (y = up+, down-)
    gltf.scene.position.z = 0;
    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

  function onSelect() {
    loader.position.set(0, 0, -2).applyMatrix4(controller.matrixWorld);
    loader.quaternion.setFromRotationMatrix(controller.matrixWorld);
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}
