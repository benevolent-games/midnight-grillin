import {Mesh, Scene} from "@babylonjs/core"
import {AdvancedDynamicTexture} from "@babylonjs/gui";

import {Item} from "../../Item.js";

export class rusty_can extends Item.Interactable {
	constructor(mesh: Mesh, scene: Scene, ui: AdvancedDynamicTexture, glb_url?: string) {
		super(mesh, scene, ui, glb_url)
	}
	interact(): void {
		//
	}
}
