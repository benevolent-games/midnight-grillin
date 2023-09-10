import {Mesh, Scene} from "@babylonjs/core"
import {AdvancedDynamicTexture} from "@babylonjs/gui";

import {Item} from "../../Item.js";

export class rusty_can extends Item.Interactable {
	constructor(mesh: Mesh, scene: Scene, glb_url?: string) {
		super(mesh, scene, glb_url)
	}
	interact(): void {
		//
	}

	on_unintersect() {}
	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {}
}
