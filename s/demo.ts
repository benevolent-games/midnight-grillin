import "@benev/toolbox/x/html.js"
import "@babylonjs/core/Loading/Plugins/babylonFileLoader.js"
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/core/Meshes/instancedMesh.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/PostProcesses/index.js"
import "@babylonjs/core/Rendering/index.js"
import {TargetCamera, Vector3, MeshBuilder, HemisphericLight, Color3, StandardMaterial, PhysicsAggregate, PhysicsShapeType, SceneLoader} from "@babylonjs/core"

import {schema} from "./schema.js"
import {setupPhysics} from "./physics/setup_physics.js"
import {prepare_systems} from "./utils/prepare-systems.js"
import {toggleCameraView} from "./utils/toggle_camera_view.js"
import {Character_capsule} from "./character/character_capsule.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import {prepare_testing_tools} from "./web/utils/prepare_testing_tools.js"
import {bbq_test} from "./scene-items/interactables/barbeques/bbq-test.js"
import {integrate_nubs_to_control_character_capsule} from "./character/integrate_nubs_to_control_character_capsule.js"

void async function main() {
	const theater = document.querySelector<BenevTheater>("benev-theater")!
	theater.setAttribute("mobile-controls", "")
	await theater.updateComplete
	
	const {
		nubContext,
		babylon: {
			renderLoop,
			engine,
			scene,
			resize,
			start,
		}
	} = theater

	await setupPhysics(scene, [0, -9.81, 0])
	SceneLoader.ShowLoadingScreen = false

	nubContext!.schema = schema

	const character_capsule = new Character_capsule(scene, [0, 0, 0])
	await character_capsule.is_loaded

	integrate_nubs_to_control_character_capsule({
			nub_context: nubContext!,
			render_loop: renderLoop,
			speeds_for_movement: {
				slow: 1 / 50,
				base: 1 / 10,
				fast: 1 / 2,
			},
			look_sensitivity: {
				stick: 1 / 100,
				pointer: 1 / 200,
			},
			speeds_for_looking_with_keys_and_stick: {
				slow: 1 / 200,
				base: 1 / 25,
				fast: 1 / 5,
			},
			character_capsule
		})

	const character_camera = new TargetCamera(
		"first-cam", Vector3.Zero(), scene
	)
	
	character_camera.ignoreParentScaling = true
	
	character_camera.parent = character_capsule.upper!

	scene.activeCamera = character_camera
	toggleCameraView({character_camera, robot_upper: character_capsule.upper!})
	const camera = scene.activeCamera

	camera.minZ = 1
	camera.maxZ = 500
	camera.fov = 1.2
	
	const direction = new Vector3(0.8, 0.6, -0.9)
	const backlight = new HemisphericLight("backlight", direction, scene)
	backlight.intensity = 1
	backlight.diffuse = new Color3(1, 1, 1)

	const ground = MeshBuilder.CreateGround("plane", {width: 100, height: 100}, scene)
	ground.position = new Vector3(0, 0, 0)
	
	new PhysicsAggregate(ground, PhysicsShapeType.MESH, {mass: 0, friction: 1}, scene)
	const groundMaterial = new StandardMaterial("planeMaterial", scene)
	groundMaterial.diffuseColor = new Color3(1, 1, 1)
	ground.material = groundMaterial

	const systems = prepare_systems(scene, character_capsule)
	prepare_testing_tools(systems)
	const bbq = new bbq_test(scene)
	bbq.loading?.then(() => {
		const bbq_addons = bbq.addons
		systems.scene_items.add_item(bbq)
		bbq_addons.forEach(a => systems.scene_items.add_item(a))
	})

	resize(theater.settings.resolutionScale ?? 100)
	start()
}()


console.log("demo")
