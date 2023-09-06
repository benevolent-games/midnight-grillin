import {Mesh, Scene} from "@babylonjs/core"
import {AdvancedDynamicTexture} from "@babylonjs/gui"

import {Item} from "../../Item"

class Vent extends Item.Interactable {
	opened = false

	constructor(mesh: Mesh, scene: Scene, ui: AdvancedDynamicTexture, glb_url: string) {
		super(mesh, scene, ui, glb_url)
	}
	interact() {
	  // run animation
		// run logic about making bbq more powerful, like coal burning faster
		this.opened = !this.opened
	}
}
