import {AbstractMesh, Scene} from "@babylonjs/core"
import {Item} from "../../Item.js"

export class grates extends Item.Pickable {
	constructor(scene: Scene, mesh: AbstractMesh) {
		super(scene, mesh)
	}

	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {}
	on_unintersect() {}
}
