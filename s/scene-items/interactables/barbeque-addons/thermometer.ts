import { Mesh, Scene } from "@babylonjs/core";
import { Item } from "../../Item";
import { AdvancedDynamicTexture } from "@babylonjs/gui";

export class thermometer extends Item.Interactable {

	constructor(mesh: Mesh, scene: Scene, ui: AdvancedDynamicTexture) {
		super(mesh, scene, ui)
	}

	interact() {
		//some logic about thermometer
	} 
}
