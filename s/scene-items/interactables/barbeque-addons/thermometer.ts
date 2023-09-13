import {Mesh, Scene} from "@babylonjs/core"

import {Item} from "../../Item.js"

export class thermometer extends Item.Interactable {

	constructor(scene: Scene, mesh: Mesh) {
		super(scene, mesh)
	}

	interact() {
		//some logic about thermometer
	}

	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {}
	on_unintersect() {}

}
