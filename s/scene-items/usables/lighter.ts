import {AdvancedDynamicTexture} from "@babylonjs/gui"
import {Mesh, MeshBuilder, Scene, Vector3} from "@babylonjs/core"

import {Item} from "../Item.js"
import {Coal} from "../pickables/coal.js"
import {NubEffectEvent} from "@benev/nubs"

export class Lighter extends Item.Usable {
	equipped = false
	use_label = "light up"
	#intersected_mesh: Coal | null = null

	constructor(scene: Scene, ui: AdvancedDynamicTexture) {
		const lighter = MeshBuilder.CreateCylinder("lighter", {height: 0.5, diameter: 0.3})
		lighter.position = new Vector3(7,0,5)
		super(lighter, scene, ui)
		this.#show_gui()
	}

	#show_gui() {
			NubEffectEvent.target(window).listen(({detail}) => {
				if(this.equipped && !this.#intersected_mesh?.burning) {
					const pick = this.scene.pick(
						this.scene.getEngine().getRenderWidth() / 2,
						this.scene.getEngine().getRenderHeight() / 2
					)
					const item = pick?.pickedMesh?.metadata as Item.Any | Mesh
					if(item instanceof Coal) {
						item.show_gui()
						this.#intersected_mesh = item
					} else {
						this.#intersected_mesh?.hide_gui()
						this.#intersected_mesh = null
					}
				} else if(!this.equipped && this.#intersected_mesh) {
					this.#intersected_mesh.hide_gui()
					this.#intersected_mesh = null
				}
				if(this.#intersected_mesh && this.#intersected_mesh.burning) {
					this.#intersected_mesh.hide_gui()
					this.#intersected_mesh = null
				}

			})
	}

	lit_lighter() {}

	use(item: Item.Any | Mesh) {
		if(item instanceof Coal) {
			item.ignite()
			console.log("coal")
		}
		else {
			console.log("lit lighter")
			this.lit_lighter()
		}
	}
}
