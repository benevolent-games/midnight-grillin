import {Scene} from "@babylonjs/core"
import {AdvancedDynamicTexture} from "@babylonjs/gui"

import {GuiControl} from "../systems/gui-control.js"
import {ItemHandler} from "../systems/item-handler.js"
import {HeatingSystem} from "../systems/heating-system.js"
import {SceneItemsControl} from "../systems/scene-items-control.js"
import {Character_capsule} from "../character/character_capsule.js"

export function prepare_systems(scene: Scene, character: Character_capsule) {

	const ui = AdvancedDynamicTexture.CreateFullscreenUI("myUI")
	const item_handler = new ItemHandler(scene)
	const scene_items = new SceneItemsControl()
	const gui_control = new GuiControl(ui, scene)

	const heating_system = new HeatingSystem(scene)

	scene_items.on_item_added(gui_control.create_guis)

	item_handler
		.on_item_drop((gui_control.handle_ondrop_gui, character.handle_item_drop))
		.on_item_pick((gui_control.handle_onpick_gui, character.handle_item_pick))
		.on_item_equip((gui_control.handle_onequip_gui, character.handle_item_equip))
		.on_intersect_change(gui_control.handle_on_intersect_gui)
		.on_item_use((equipped, intersected) => equipped.use(intersected))

	return {
		scene_items,
		ui
	}
}
