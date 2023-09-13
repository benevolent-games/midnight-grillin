import {Mesh, Scene} from "@babylonjs/core"

import {Item} from "../../Item"

class Vent extends Item.Interactable {
	opened = false

	constructor(scene: Scene, glb_or_mesh: string | Mesh) {
		super(scene, glb_or_mesh)
	}
	interact() {
	  // run animation
		// run logic about making bbq more powerful, like coal burning faster
		this.opened = !this.opened
	}

	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {}
	on_unintersect() {}
}
