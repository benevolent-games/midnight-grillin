import {Mesh, Scene} from "@babylonjs/core"
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"
import {NubEffectEvent} from "@benev/nubs"

import {Item} from "../scene-items/Item.js"
import {ItemHandler} from "./item-handler.js"
import {SceneItemsControl} from "./scene-items-control.js"

export class GuiControl {
	#gui_control: AdvancedDynamicTexture
	#guis = {
		on_mesh: [] as TextBlock[],
		on_screen: {
			equip: null as null | TextBlock,
			pick: null as null | TextBlock
		}
	}
	#scene: Scene

	constructor(item_handler: ItemHandler, scene_items_control: SceneItemsControl, gui: AdvancedDynamicTexture ,scene: Scene) {
		this.#scene = scene
		this.#gui_control = gui
		this.#init_gui_handler()
		this.#init_listeners(item_handler, scene_items_control)
	}
	
	#init_listeners(item_handler: ItemHandler, scene_items_control: SceneItemsControl) {
		scene_items_control.on_item_added((item) => this.create_guis_for_paritcular_item_type(item))
		item_handler.on_item_drop(this.#handle_drop_gui)
		item_handler.on_item_pick(this.#handle_pick_gui)
		item_handler.on_item_equip(this.#handle_equip_gui)
	}

	#init_gui_handler() {
		NubEffectEvent.target(window).listen(({detail}) => {
			const pick = this.#scene.pick(
				this.#scene.getEngine().getRenderWidth() / 2,
				this.#scene.getEngine().getRenderHeight() / 2
			)
			const item = pick?.pickedMesh?.metadata
		})
	}
	
	#handle_equip_gui(item: Item.Usable) {}

	#handle_drop_gui(item: Item.Usable) {}

	#handle_pick_gui(item: Item.Any) {}

	private create_guis_for_paritcular_item_type(item: Item.Any) {
		if(item instanceof Item.Usable) {
			this.create_pick_gui(item.mesh)
			this.create_equip_gui(item.mesh)
		} else if(item instanceof Item.Pickable) {
			this.create_pick_gui(item.mesh)
		}
	}

	private create_pick_gui(mesh: Mesh) {
		const pick = new TextBlock()
		pick.text = "Pick (r)"
		pick.color = "Green"
		pick.fontSize = "16"
		pick.linkOffsetY = -15
		this.#gui_control.addControl(pick)
		pick.linkWithMesh(mesh)
		pick.isVisible = false
		this.#guis.on_screen.pick = pick
	}

	private create_equip_gui(mesh: Mesh) {
		const equip = new TextBlock()
		equip.text = "Equip (q)"
		equip.color= "White"
		equip.fontSize = "24"
		equip.textHorizontalAlignment = 3
		equip.left = "2%"
		this.#gui_control.addControl(equip)
		equip.isVisible = false
		this.#guis.on_screen.equip = equip
	}

	#remove_gui() {
	}
	
	#hide_equip_gui() {
		this.#guis.on_screen.equip!.isVisible = false
	}

	#show_equip_gui() {
		this.#guis.on_screen.equip!.isVisible = true
	}

	#hide_pick_gui(mesh: Mesh) {
	}

	#show_pick_gui(mesh: Mesh) {
	}
}
