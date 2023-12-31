
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsAggregate, PhysicsShapeType} from "@babylonjs/core"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"


import {Item} from "../scene-items/Item.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {V3, v3} from "@benev/toolbox/x/utils/v3.js"
import {loadGlb} from "../utils/babylon/load-glb.js"
import {multiply_quaternion_by_vector} from "./utils/multiply_quaternion_by_vector.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

const material = new StandardMaterial("capsule")
material.alpha = 0.1

export class Character_capsule {
	#scene: Scene
	capsule: Mesh
	is_loaded = this.#loadGlb()
	current_look: V2 = v2.zero()
	starting_position: V3 = v3.zero()

	root: TransformNode | undefined
	upper: TransformNode | undefined
	coaster: TransformNode | undefined

	health = 100
	activeWeapon = 0
	pickedItem: Item.Any | undefined = undefined
	intersectedItem: Item.Any | undefined = undefined

	is_item_rotating = false

	constructor(scene: Scene, position: V3) {
		this.#scene = scene
		this.starting_position = position
		this.capsule = this.#makeCapsule(3, position)
		
		this.is_loaded.then((m) => {
			this.#hide_collision_meshes(m)
			this.#assign_robot_parts(m.transformNodes)
			if (this.root) {
				//rotate mesh this.root.scaling.z = -1
				this.root.position = new Vector3(0, 1, 0)
				this.root.parent = this.capsule
			}
		})
	}

	async #loadGlb() {
		return await loadGlb(this.#scene, `https://dl.dropbox.com/scl/fi/hplfzmldqtnr3slxtlip8/spherebot.glb?rlkey=hctf8qp2bn9qiibov4clp1a39&dl=0`)
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
			mass: 1,
			friction: 1,
			restitution: 0,
		})

		aggregate.body.disablePreStep = false
		
		aggregate.body.setMassProperties({
			mass: 1,
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
		if(!this.is_item_rotating) {
			const [x, y] = this.current_look
			this.current_look = add_to_look_vector_but_cap_vertical_axis(this.current_look, vector)
			this.capsule.rotationQuaternion = Quaternion
				.RotationYawPitchRoll(x, 0, 0)
			this.setVerticalAim(y)
		} else this.#rotate_picked_item(vector)
	}

	move_picked_item_to_center() {
		if(this.pickedItem) {
			if(this.pickedItem instanceof Item.Usable && this.pickedItem.equipped) { // if item is equipped stop moving to center
				return
			} else {
					const cameraQuaternion = this.#scene.activeCamera!.absoluteRotation.clone()
					const directionVector = new Vector3(0, 0, 5)
					const rotationVector = multiply_quaternion_by_vector(cameraQuaternion, directionVector)
					const velocityDirectionVector = new Vector3(
						this.upper!.getAbsolutePosition().x + rotationVector.x,
						this.upper!.getAbsolutePosition().y + rotationVector.y,
						this.upper!.getAbsolutePosition().z + rotationVector.z
					).subtract(this.pickedItem.mesh!.getAbsolutePosition())
					this.pickedItem.mesh!.physicsBody?.setLinearVelocity(new Vector3(velocityDirectionVector.x * 10, velocityDirectionVector.y * 10, velocityDirectionVector.z * 10))
					this.pickedItem.mesh!.physicsBody?.setAngularVelocity(new Vector3(0,0,0))
			}
		}
	}

	handle_item_pick = (item: Item.Pickable | Item.Usable) => this.#pick_item(item)

	handle_item_equip = (item: Item.Usable) => this.#equip_item(item)

	handle_item_drop = (item: Item.Usable | Item.Pickable) => this.#drop_item(item)

	handle_item_rotation = (is_pressed: boolean) => {
		this.is_item_rotating = is_pressed
	}

	#pick_item(item: Item.Usable | Item.Pickable) {
		this.pickedItem = item
	}

	#drop_item(item: Item.Usable | Item.Pickable) {
		if(item instanceof Item.Usable && item.equipped) {this.#unequip_item(item)}
		item.mesh?.setParent(null)
		this.pickedItem = undefined
	}

	#unequip_item(item: Item.Usable) {
		item.equipped = false;
		item.mesh?.setParent(null)
		item.create_physics()
	}

	#equip_item(item: Item.Usable) {
		const robotRightGun = this.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunright1_primitive0")!;
		item.equipped = true;
		item.mesh?.setParent(this.upper!)
		item.dispose_physics()
		item.mesh!.position = new Vector3(robotRightGun.position.x + 1, robotRightGun.position.y + 1, robotRightGun.position.z + 2)
		item.mesh!.rotation = new Vector3(0,0.1,0)
		item.on_equip(robotRightGun)
	}
	
	#rotate_picked_item(vector: V2) {
		if(this.pickedItem) {
			const matrix = this.#scene.activeCamera!.getWorldMatrix();
			const right = Vector3.Zero().copyFromFloats(matrix.m[0], matrix.m[1], matrix.m[2])
			const up = Vector3.Zero().copyFromFloats(matrix.m[4], matrix.m[5], matrix.m[6]);
			this.pickedItem.mesh!.rotateAround(this.pickedItem.mesh!.getAbsolutePosition(), up, -vector[0])
			this.pickedItem.mesh!.rotateAround(this.pickedItem.mesh!.getAbsolutePosition(), right, vector[1])

			//this.pickedItem.mesh!.rotate(up, -vector[0])
			//this.pickedItem.mesh!.rotate(right, vector[1])
		}
	}
}
