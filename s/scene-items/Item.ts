import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"
import {AbstractMesh, Mesh, PhysicsAggregate, PhysicsShapeType, Scene, Vector3} from "@babylonjs/core"

import {loadGlb} from "../utils/babylon/load-glb.js"

// pickable - fire starter, coal, wood, you can pick and put to inventory but cant use/equip, these will have its own methods
// that can be run only by usables
// usable - lighter, food, can pick or use it/equip, normalized use method to fire pickable method
// interactable - static item, but you can directly interact with it, cant use/equip/pick

export namespace Item {
	export abstract class Any {
		abstract pickable: boolean
		abstract usable: boolean
		abstract interactable: boolean

		mesh: AbstractMesh
		pick_ui: TextBlock | undefined
		scene: Scene
		aggr: PhysicsAggregate | undefined = undefined

		constructor(mesh: AbstractMesh, scene: Scene, glb_url?: string) {
			this.mesh = mesh
			this.scene = scene
			mesh.metadata = this
			//mesh.showBoundingBox = true
			this.create_physics()
			if(glb_url)
				this.#loadGlb(scene, glb_url)
		}

		async #loadGlb(scene: Scene, glb_url: string) {
			return await loadGlb(scene, glb_url)
		}

		create_physics() {
			const aggr = new PhysicsAggregate(
				this.mesh,
				PhysicsShapeType.MESH,
				{ mass: 1, restitution: 0, friction: 1 },
				this.scene
			)

			aggr.body.setMassProperties({
				mass: 1,
				inertia: new Vector3(0, 0, 0)
			})
			aggr.body.disablePreStep = false
			aggr.body.computeMassProperties()
		}

		dispose_physics() {
			this.aggr?.body.dispose()
			this.aggr?.dispose()
			this.mesh.physicsBody?.dispose()
			this.mesh.physicsImpostor?.dispose()
		}

		show_pick_gui() {
			this.pick_ui!.isVisible = true
		}

		hide_pick_gui() {
			this.pick_ui!.isVisible = false
		}
	}

	export abstract class Pickable extends Any {
		readonly pickable = true
		readonly interactable = false
		readonly usable = false

		picked = false

		constructor(mesh: AbstractMesh, scene: Scene, ui: AdvancedDynamicTexture, glb_url?: string) {
			super(mesh, scene, glb_url)
			this.create_gui(ui)
		}

		create_gui(ui: AdvancedDynamicTexture) {
			const label = new TextBlock()
			label.text = "Pick (g)"
			label.color = "White"
			label.fontSize = "24"
			ui.addControl(label)
			label.linkWithMesh(this.mesh)
			this.pick_ui = label
			this.hide_pick_gui()
		}
	}

	export abstract class Interactable extends Any {
		readonly interactable = true
		readonly pickable = false
		readonly usable = false

		abstract interact(): void // method where animation from blender will run
		
		constructor(mesh: AbstractMesh, scene: Scene, ui: AdvancedDynamicTexture, glb_url?: string) {
			super(mesh, scene, glb_url)
			this.create_gui(ui)
		}

		create_gui(ui: AdvancedDynamicTexture) {
			const label = new TextBlock()
			label.text = "Pick (g)"
			label.color = "White"
			label.fontSize = "24"
			ui.addControl(label)
			label.linkWithMesh(this.mesh)
			this.pick_ui = label
			this.hide_pick_gui()
		}
	}

	export abstract class Usable extends Any {
		readonly pickable = true
		readonly interactable = false
		readonly usable = true
		equip_ui: TextBlock | undefined
		use_ui: TextBlock | undefined

		equipped = false
		picked = false
		
		abstract use_label:string

		abstract use(item: Item.Any | Mesh): void

		constructor(mesh: AbstractMesh, scene: Scene, ui: AdvancedDynamicTexture, glb_url?: string) {
			super(mesh, scene, glb_url)
			this.create_gui(ui)
		}

		create_gui(ui: AdvancedDynamicTexture) {
			const equip = new TextBlock()
			const label = new TextBlock()
			const use_label = new TextBlock()
			label.text = "Pick (r)"
			label.color = "White"
			label.fontSize = "24"
			equip.text = "Equip (q)"
			equip.color= "White"
			equip.fontSize = "24"
			equip.textHorizontalAlignment = 3
			equip.left = "2%"
			use_label.text = "Use (left click)"
			use_label.color = "White"
			use_label.fontSize = "24"
			use_label.textHorizontalAlignment = 3
			use_label.left = "2%"
			ui.addControl(label)
			ui.addControl(equip)
			ui.addControl(use_label)
			label.linkWithMesh(this.mesh)
			this.pick_ui = label
			this.equip_ui = equip
			this.use_ui = use_label
			this.hide_pick_gui()
			this.hide_equip_gui()
			this.hide_use_item_gui()
		}

		show_equip_gui() {
			this.equip_ui!.isVisible = true
		}

		hide_equip_gui() {
			this.equip_ui!.isVisible = false
		}

		show_use_item_gui() {
			this.use_ui!.isVisible = true
		}

		hide_use_item_gui() {
			this.use_ui!.isVisible = false
		}
	}
}
