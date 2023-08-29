import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"
import {AbstractMesh, PhysicsAggregate, PhysicsShapeType, Scene} from "@babylonjs/core"

// pickable - fire starter, coal, wood, you can pick and put to inventory but cant use/equip
// usable - lighter, food, can pick or use it/equip
// interactable - static item, but you can directly interact with it, cant use/equip/pick

export namespace Item {
	export abstract class Base {
		abstract pickable: boolean
		abstract usable: boolean
		abstract interactable: boolean

		mesh: AbstractMesh
		pick_ui: TextBlock | undefined
		equip_ui: TextBlock | undefined
		scene: Scene
		aggr: PhysicsAggregate | undefined = undefined

		constructor(mesh: AbstractMesh, scene: Scene) {
			this.mesh = mesh
			this.scene = scene
			mesh.metadata = this
			this.create_physics(mesh)
		}
		create_physics(mesh: AbstractMesh) {
			const aggr = new PhysicsAggregate(
				mesh,
				PhysicsShapeType.MESH,
				{ mass: 1, restitution: 0, friction: 1 },
				this.scene
			)
			aggr.body.setMassProperties({
				mass: 1,
				//inertia: new Vector3(0.1, 0.1, 0.1)
			})
			aggr.body.disablePreStep = false
			aggr.body.computeMassProperties()
		}
		dispose_physics() {
			this.aggr?.body.dispose()
			this.aggr?.dispose()
		}
		show_equip_gui() {
			this.equip_ui!.isVisible = true
		}
		hide_equip_gui() {
			this.equip_ui!.isVisible = false
		}
		show_gui() {
			this.pick_ui!.isVisible = true
		}
		hide_gui() {
			this.pick_ui!.isVisible = false
		}
		create_gui(ui: AdvancedDynamicTexture) {
			const equip = new TextBlock()
			const label = new TextBlock()
			label.text = "Pick (g)"
			equip.text = "Equip (q)"
			label.color = "White"
			equip.color= "White"
			label.fontSize = "24"
			equip.fontSize = "24"
			equip.textHorizontalAlignment = 3
			equip.left = "2%"
			ui.addControl(label)
			ui.addControl(equip)
			label.linkWithMesh(this.mesh)
			this.pick_ui = label
			this.equip_ui = equip
			this.hide_gui()
			this.hide_equip_gui()
		}
	}
	export class Pickable extends Base {
		readonly pickable = true
		readonly interactable = false
		readonly usable = false

		picked = false
	}
	export abstract class Interactable extends Base {
		readonly interactable = true
		readonly pickable = false
		readonly usable = false

		abstract interact(): void
	}
	export class Usable extends Base {
		readonly pickable = true
		readonly interactable = false
		readonly usable = true

		equipped = false
		picked = false
	}
}

class example extends Item.Pickable {
	constructor(mesh: AbstractMesh, scene: Scene) {
		super(mesh,scene)
	}
	some_cool_thing() {}
}
