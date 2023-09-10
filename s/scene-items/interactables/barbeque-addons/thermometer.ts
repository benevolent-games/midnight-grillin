import { Mesh, Scene } from "@babylonjs/core";
import { Item } from "../../Item";
import { AdvancedDynamicTexture } from "@babylonjs/gui";

export class thermometer extends Item.Interactable {

	constructor(mesh: Mesh, scene: Scene) {
		super(mesh, scene)
	}

	interact() {
		//some logic about thermometer
	}

	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {}
	on_unintersect() {}

}
