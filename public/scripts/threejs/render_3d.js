import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/STLLoader.js";

const canvas = document.getElementById("threeCanvas");
const viewer = document.getElementById("viewer-container");
const fileTrigger = document.getElementById("fileTrigger");
const fileInput = document.getElementById("stlFileInput");

//start threejs stuff
const width = canvas.clientWidth;
const height = canvas.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x434343);

const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(width, height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const directionalLightTop = new THREE.DirectionalLight(0xffffff, 1);
directionalLightTop.position.set(5, 10, 7.5);
scene.add(directionalLightTop);
const directionalLightBottom = new THREE.DirectionalLight(0xffffff, 1);
directionalLightBottom.position.set(-5, -10, -7.5);
scene.add(directionalLightBottom);

let defaultCube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0xffffff }));
scene.add(defaultCube);

let currentMesh = defaultCube;
let meshColor = 0xffffff;

fileInput.addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;

	document.getElementById("hiddenFileName").value = file.name;
	const nameWithoutExtension = file.name.replace(/\.stl$/i, "");
	document.getElementById("name").value = nameWithoutExtension;

	const reader = new FileReader();
	reader.onload = function (e) {
		const contents = e.target.result;

		const loader = new STLLoader();
		const geometry = loader.parse(contents);

		const material = new THREE.MeshStandardMaterial({
			color: meshColor,
			metalness: 0.5,
			roughness: 0.7,
		});

		const mesh = new THREE.Mesh(geometry, material);

		geometry.computeBoundingBox();
		const bbox = geometry.boundingBox;
		const center = new THREE.Vector3();
		bbox.getCenter(center);
		geometry.translate(-center.x, -center.y, -center.z);
		const size = new THREE.Vector3();
		bbox.getSize(size);
		const maxAxis = Math.max(size.x, size.y, size.z);
		mesh.scale.multiplyScalar(1 / maxAxis);
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.set(0, 0, 0);

		// Add mesh to scene
		scene.add(mesh);

		scene.clear();
		currentMesh = mesh;
		scene.add(currentMesh);
		scene.add(directionalLightTop);
		scene.add(directionalLightBottom);
		scene.add(new THREE.AmbientLight(0xffffff, 0.5));

		const price = calculateCost(geometry);

		document.getElementById("cost").textContent = price.toFixed(2);
		document.getElementById("time").textContent = 5;

		fileTrigger.classList.add("hidden");
		fileTrigger.classList.remove("visible");

		viewer.classList.remove("hidden");
		viewer.classList.add("visible");
	};
	reader.readAsArrayBuffer(file);
});

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	controls.update();
	renderer.render(scene, camera);
}

animate();

//===========================================================================
// Change model color

// Your function that applies the selected color to the mesh
export function applySelectedColor(color) {
	meshColor = color;

	if (currentMesh && currentMesh.material) {
		currentMesh.material.color.set(color);
		currentMesh.material.needsUpdate = true; // Tell Three.js to update the material
	}
}

// Existing event listener now just calls the function
const colorSelect = document.getElementById("color");
colorSelect.addEventListener("change", (event) => {
	applySelectedColor(event.target.value);
});

//===================================================================

// Delete and replace buttons
document.getElementById("remove3dfile").addEventListener("click", () => {
	if (currentMesh) {
		scene.remove(currentMesh);
		currentMesh.geometry.dispose();
		currentMesh.material.dispose();
		currentMesh = null;
	}

	fileTrigger.classList.remove("hidden");
	fileTrigger.classList.add("visible");

	viewer.classList.add("hidden");
	viewer.classList.remove("visible");

	// Clear the file input so the same file can be re-selected
	fileInput.value = "";
	document.getElementById("hiddenFileName").value = "";
	document.getElementById("name").value = "";

	document.getElementById("cost").textContent = "--,--";
	document.getElementById("time").textContent = "--";
});

document.getElementById("replace3dfile").addEventListener("click", () => {
	document.getElementById("stlFileInput").click();
});

function calculateCost(geometry) {
	let position = geometry.attributes.position;

	let volume = 0;

	for (let i = 0; i < position.count; i += 3) {
		// Get vertices of the triangle
		const p1 = new THREE.Vector3().fromBufferAttribute(position, i);
		const p2 = new THREE.Vector3().fromBufferAttribute(position, i + 1);
		const p3 = new THREE.Vector3().fromBufferAttribute(position, i + 2);

		// Calculate volume of the tetrahedron formed by triangle and origin
		volume += p1.dot(p2.cross(p3)) / 6.0;
	}

	return Math.abs(volume) / 10000;
}
