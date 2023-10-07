import {Mesh, Scene} from "@babylonjs/core"

import {Item} from "../Item.js"

export class Stone extends Item.Usable {
	equipped = false
	use_label = "throw"
	//constructor(mesh: Mesh, scene: Scene) {
	//	super(mesh, scene)
	//}

	use() {}

	on_intersect() {}

	on_unintersect() {}

	on_equip() {}

}
