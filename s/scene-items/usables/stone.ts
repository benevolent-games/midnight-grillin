import { AdvancedDynamicTexture } from "@babylonjs/gui"
import {Item} from "../Item.js"
import {AbstractMesh, Mesh, Scene} from "@babylonjs/core"

export class Stone extends Item.Usable {
	equipped = false
	use_label = "throw"
	constructor(mesh: AbstractMesh, scene: Scene, ui: AdvancedDynamicTexture) {
		super(mesh, scene, ui)
	}
	use() {}
}
