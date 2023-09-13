import {Scene} from "@babylonjs/core"

import {Item} from "../../Item.js"
import {grates} from "../barbeque-addons/grates.js"

export class bbq_test extends Item.Interactable {
	constructor(scene: Scene) {
		super(scene, "https://dl.dropbox.com/scl/fi/uuheu7hs4vl3n1q3renlm/bbq11.glb?rlkey=9juqyjxke0t56krr94oh4rmaf&dl=0")
			this.loading?.then((a) => {
				const addon = new grates(scene, a.meshes.find(m => m.id === "grates")!)
				this.addons.push(addon)
		})
	}
	on_unintersect() {}
	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {}
	interact() {}
}
