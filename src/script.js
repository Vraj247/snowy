import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loadingManager: loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loadingManager: loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loadingManager: loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png')
const colorTexture = textureLoader.load(
    '/textures/10.jpeg',
    () =>
    {
        console.log('textureLoader: loading finished')
    },
    () =>
    {
        console.log('textureLoader: loading progressing')
    },
    () =>
    {
        console.log('textureLoader: loading error')
    }
)
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI * 0.25
colorTexture.center.x = 0
colorTexture.center.y = 0
colorTexture.generateMipmaps = true
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

const alphaTexture = textureLoader.load('/textures/checkboard-8x8.png')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(1, 20, 20)
console.log(geometry.attributes)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 10
camera.position.z = 10
camera.position.x = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = Math.PI / 60;
controls.enableZoom = false;


const snowflakeGeometry = new THREE.BufferGeometry();
const snowflakeVertices = [];

// Generate 5000 snowflakes with smoother distribution
for (let i = 0; i < 10000; i++) {
    // Randomly position each snowflake within a larger range
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 50;

    // Add the coordinates to the array
    snowflakeVertices.push(x, y, z);
}

snowflakeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowflakeVertices, 3));

// Create a PointsMaterial with emission shader
const snowflakeMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.01312,
    emissive: 0x00ff00, // Set the emissive color (green in this case)
    emissiveIntensity: 0.01, // Adjust the intensity of the emission
});

const snowflakes = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
scene.add(snowflakes);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Background Music
 */
const audio = new Audio('/static/bg.mp3'); // Replace with the actual path to your music file
audio.loop = true; // Set to true to loop the music
audio.volume = 1; // Adjust the volume as needed


// Check if the audio can be played
audio.addEventListener('canplaythrough', () => {
    audio.play();
});

audio.addEventListener('error', (error) => {
    console.error('Error loading audio:', error);
});

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Rotate the mesh
    mesh.rotation.x = elapsedTime * Math.PI / 39312   // Adjust the rotation speed by changing the multiplier
    // mesh.rotation.y = elapsedTime * Math.PI / 1
    // mesh.rotation.z = elapsedTime * Math.PI / 1  // Adjust the rotation speed by changing the multiplier

    // // Rotate the texture
    // colorTexture.rotation = elapsedTime * 0.25  // Adjust the rotation speed by changing the multiplier
    // Update snowflakes position to create the snowfall effect
    // const snowflakePositions = snowflakeGeometry.attributes.position.array;

    // for (let i = 1; i < snowflakePositions.length; i += 3) {
    //     snowflakePositions[i] -= 0.03; // Adjust the falling speed
    //     if (snowflakePositions[i] < -5) {
    //         snowflakePositions[i] = 10;
    //     }
    // }

    // snowflakeGeometry.attributes.position.needsUpdate = true;


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()