import {Mesh, MeshBuilder, Scene, Vector3} from "@babylonjs/core"

import {Item} from "../Item.js"
import {Coal} from "../pickables/coal.js"

export class Lighter extends Item.Usable {
	equipped = false
	use_label = "light up"

	constructor(scene: Scene) {
		const lighter = MeshBuilder.CreateCylinder("lighter", {height: 0.5, diameter: 0.3})
		lighter.position = new Vector3(7,0,5)
		super(lighter, scene)
	}

	on_intersect() {}

	on_unintersect() {}

	lit_lighter() {}

	use(item: Item.Any | Mesh) {
		if(item instanceof Coal) {
			item.ignite()
		}
		else {
			this.lit_lighter()
		}
	}
}
