import {Mesh} from "@babylonjs/core"
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"

import {Item} from "../scene-items/Item.js"

export class GuiControl {
	#gui_control: AdvancedDynamicTexture
	#guis = {
		on_mesh: {
			pick: [] as TextBlock[]
		},
		on_screen: {
			equip: null as null | TextBlock,
			drop: null as null | TextBlock,
		}
	}

	constructor(gui: AdvancedDynamicTexture) {
		this.#gui_control = gui
	}

	handle_on_intersect_gui = (
		prev_item: Item.Any | Mesh | null,
		new_item: Item.Any | Mesh,
		intersected_by: Item.Usable | Item.Pickable | null) => {
		if(prev_item instanceof Item.Any) {prev_item.on_unintersect()}
		if(new_item instanceof Item.Any) {new_item.on_intersect(intersected_by)}
		if(new_item instanceof Item.Usable || new_item instanceof Item.Pickable) {
			this.#show_pick_gui(new_item.mesh)
		}
		if(prev_item instanceof Item.Usable || prev_item instanceof Item.Pickable) {
			this.#hide_pick_gui(prev_item.mesh)
		}
	}

	handle_onequip_gui = (item: Item.Any) => {
		if(item instanceof Item.Usable) {this.#hide_equip_gui()}
		this.#show_drop_gui()
	}

	handle_ondrop_gui = (item: Item.Usable | Item.Pickable) => {
		if(item instanceof Item.Usable) {this.#hide_equip_gui()}
		this.#hide_drop_gui()
	}

	handle_onpick_gui = (item: Item.Any) => {
		if(item instanceof Item.Usable) {this.#show_equip_gui()}
		this.#show_drop_gui()
	}

	create_guis = (item: Item.Any) => {
		this.#create_drop_gui()
		this.#create_pick_gui(item.mesh)
		this.#create_equip_gui()
	}

	#create_drop_gui() {
		const drop = new TextBlock()
		drop.text = "Drop (g)"
		drop.color= "White"
		drop.fontSize = "24"
		drop.textHorizontalAlignment = 3
		drop.left = "2%"
		drop.top = "4%"
		this.#gui_control.addControl(drop)
		drop.isVisible = false
		this.#guis.on_screen.drop = drop
	}

	#create_pick_gui(mesh: Mesh) {
		const pick = new TextBlock()
		pick.text = "Pick (r)"
		pick.color = "Green"
		pick.fontSize = "16"
		pick.linkOffsetY = -15
		this.#gui_control.addControl(pick)
		pick.linkWithMesh(mesh)
		pick.isVisible = false
		this.#guis.on_mesh.pick.push(pick)
	}

	#create_equip_gui() {
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

	#remove_gui() {}
	
	#show_pick_gui(mesh: Mesh) {
		const find_linked_gui = this.#guis.on_mesh.pick.find(g => g.linkedMesh === mesh)
		find_linked_gui!.isVisible = true
	}

	#hide_pick_gui(mesh: Mesh) {
		const find_linked_gui = this.#guis.on_mesh.pick.find(g => g.linkedMesh === mesh)
		find_linked_gui!.isVisible = false
	}

	#hide_drop_gui() {
		this.#guis.on_screen.drop!.isVisible = false
	}

	#show_drop_gui() {
		this.#guis.on_screen.drop!.isVisible = true
	}

	#hide_equip_gui() {
		this.#guis.on_screen.equip!.isVisible = false
	}

	#show_equip_gui() {
		this.#guis.on_screen.equip!.isVisible = true
	}
}
