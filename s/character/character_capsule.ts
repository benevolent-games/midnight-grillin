
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
import {NubEffectEvent, NubDetail} from "@benev/nubs"
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

	constructor(scene: Scene, position: V3) {
		this.#scene = scene
		this.starting_position = position
		this.capsule = this.#makeCapsule(3, position)
		this.#init_key_action_handler()
		
		this.is_loaded.then((m) => {
			this.#hide_collision_meshes(m)
			this.#assign_robot_parts(m.transformNodes)
			if (this.root) {
				//rotate mesh this.root.scaling.z = -1
				this.root.position = new Vector3(0, -1, 0)
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
		const [x, y] = this.current_look
		this.current_look = add_to_look_vector_but_cap_vertical_axis(this.current_look, vector)

		this.capsule.rotationQuaternion = Quaternion
			.RotationYawPitchRoll(x, 0, 0)
		this.setVerticalAim(y)
	}

	move_picked_item_to_center() {
		if(this.pickedItem) {
			if(this.pickedItem instanceof Item.Usable && this.pickedItem.equipped){ // if item is equipped stop moving to center
				return
			} else {
			this.pickedItem.mesh.position.x = this.upper!.position.x
			this.pickedItem.mesh.position.z = this.upper!.position.z + 5
			this.pickedItem.mesh.position.y = this.upper!.position.y
		}
		}
	}

	#handle_usable_item(item: Item.Usable, action: string) {
		if(action === "pick") {this.pick_item(item)}
		if(action === "equip") {this.equip_item(item)}
		if(action === "drop") {
			if(this.pickedItem instanceof Item.Usable && this.pickedItem.equipped) {
				this.unequip_item(this.pickedItem)
			}
			this.unpick_item()
		}
	}

	#handle_pickable_item(item: Item.Pickable, action: string) {
		if(action === "pick") {this.pick_item(item)}
		if(action === "drop") {this.unpick_item()}
	}

	#handle_item_pick(item: Item.Any | Mesh) {
		if(item instanceof Item.Usable) {
			this.#handle_usable_item(item, "pick")
		}
		else if(item instanceof Item.Pickable) {
			this.#handle_pickable_item(item, "pick")
		}
	}

	#handle_item_equip() {
		if(this.pickedItem instanceof Item.Usable) {
			this.#handle_usable_item(this.pickedItem, "equip")
		}
	}

	#handle_item_drop() {
		if(this.pickedItem instanceof Item.Usable) {
			this.#handle_usable_item(this.pickedItem, "drop")
		}
		if(this.pickedItem instanceof Item.Pickable) {
			this.#handle_pickable_item(this.pickedItem, "drop")
		}
	}

	#handle_intersected_item_gui(item: Item.Any | Mesh) {
		if(item instanceof Item.Any && item.pickable && item !== this.intersectedItem && !this.pickedItem) {
				this.intersectedItem?.hide_pick_gui()
				this.intersectedItem = item
				item.show_pick_gui()
		}
		if(!(item instanceof Item.Any) || item === this.pickedItem)
		 {
			this.intersectedItem?.hide_pick_gui()
			this.intersectedItem = undefined
		}
	}

	#init_key_action_handler() {
		NubEffectEvent.target(window).listen(({detail}) => {
			const pick_item = detail.effect === "pick" && (detail as NubDetail.Key).pressed
			const equip_item = detail.effect === "equip" && (detail as NubDetail.Key).pressed
			const drop_item = detail.effect === "drop" && (detail as NubDetail.Key).pressed
			const use = detail.effect === "primary" && (detail as NubDetail.Key).pressed
			const pick = this.#scene.pick(
				this.#scene.getEngine().getRenderWidth() / 2,
				this.#scene.getEngine().getRenderHeight() / 2
			)
			const item = pick?.pickedMesh?.metadata as Item.Any | Mesh
			if(drop_item) {this.#handle_item_drop()}
			if(pick_item) {this.#handle_item_pick(item)}
			if(equip_item) {this.#handle_item_equip()}
			if(use) {
				if(this.pickedItem instanceof Item.Usable)
					this.pickedItem.use(item)
			}

			this.#handle_intersected_item_gui(item)
		})
	}

	pick_item(item: Item.Usable | Item.Pickable) {
		item.mesh.setParent(this.upper!)
		this.pickedItem = item
		if(item instanceof Item.Usable) {
			item.show_equip_gui()
		}
	}

	unpick_item() {
		if(this.pickedItem instanceof Item.Usable) {
			this.pickedItem.hide_equip_gui()
		}
		this.pickedItem!.mesh.setParent(null)
		this.pickedItem = undefined
	}

	unequip_item(item: Item.Usable) {
		item.hide_use_item_gui()
		item.equipped = false;
		item.mesh.setParent(null)
		item.create_physics()
	}

	equip_item(item: Item.Usable) {
		const robotRightGun = this.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunright1_primitive0")!;
		item.hide_equip_gui()
		item.show_use_item_gui()
		item.equipped = true;
		item.mesh.setParent(this.upper!)
		item.dispose_physics()
		item.mesh.position = new Vector3(robotRightGun.position.x + 1, robotRightGun.position.y + 1, robotRightGun.position.z + 2)
	}

}
