
import {Scene} from "@babylonjs/core/scene.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsAggregate, PhysicsShapeType} from "@babylonjs/core"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Color3, Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {V3, v3} from "@benev/toolbox/x/utils/v3.js"
import {loadGlb} from "../utils/babylon/load-glb.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"


const material = new StandardMaterial("capsule")
material.alpha = 0.1

export class Character_capsule {
	#scene: Scene
	capsule: Mesh
	is_loaded = this.#loadGlb()
	current_look: V2 = v2.zero()
	starting_position: V3 = v3.zero()
	#is_base_mesh = (m: AbstractMesh) => m.name.startsWith("humanoid_base")

	root: TransformNode | undefined
	upper: TransformNode | undefined
	coaster: TransformNode | undefined

	health = 100
	activeWeapon = 0

	constructor(scene: Scene, position: V3) {
		this.#scene = scene
		this.starting_position = position
		this.capsule = this.#makeCapsule(3, position)

		this.is_loaded.then((m) => {
			this.#hide_collision_meshes(m)
			this.#assign_robot_parts(m.transformNodes)
			if (this.root) {
				this.root.position = new Vector3(0, -1, 0)
				this.root.parent = this.capsule
			}
		})
	}

	async #loadGlb() {
		return await loadGlb(this.#scene, `https://dl.dropbox.com/s/ka0uunak8h9fts5/spherebot3_1.glb`)
	}

	#hide_collision_meshes(ac: AssetContainer) {
		ac.meshes.forEach(mesh => {
			if (mesh.id.startsWith("collision"))
				mesh.visibility = 0
		})
	}

	#assign_robot_parts(nodes: TransformNode[]) {
		nodes.forEach(node => {
			if (node.id === "root")
					this.root = node
			if (node.id === "upper")
				this.upper = node
			if (node.id === "coaster")
				this.coaster = node
		})
	}

	#makeCapsule(height: number, position: V3) {
		const capsule = MeshBuilder.CreateCapsule("capsule", {
			radius: 0.8,
			height,
			updatable: true,
		}, this.#scene)
		capsule.position = new Vector3(...position)

		const aggregate = new PhysicsAggregate(capsule, PhysicsShapeType.MESH, {
			mass: 3,
			friction: 2,
			restitution: 0,
		})

		aggregate.body.disablePreStep = false

		aggregate.body.setMassProperties({
			inertia: new Vector3(0, 0, 0)
		})

		capsule.material = material
		return capsule
	}

	setVerticalAim(y: number) {
		if (this.upper) {
			this.upper.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				0, -y, 0,
			)
		}
	}

	move(vector: V2) {
		const [x, z] = vector
		const translation = new Vector3(x, 0, z)

		const translation_considering_rotation = translation
			.applyRotationQuaternion(this.capsule.absoluteRotationQuaternion)

		this.capsule.position.addInPlace(translation_considering_rotation)
	}

	look(vector: V2) {
		const [x, y] = this.current_look
		this.current_look = add_to_look_vector_but_cap_vertical_axis(this.current_look, vector)

		this.capsule.rotationQuaternion = Quaternion
			.RotationYawPitchRoll(x, 0, 0)
		this.setVerticalAim(y)
	}

}
