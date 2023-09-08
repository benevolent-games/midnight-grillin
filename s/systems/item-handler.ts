import {Mesh, Scene} from "@babylonjs/core"
import {NubDetail, NubEffectEvent} from "@benev/nubs"

import {Item} from "../scene-items/Item.js"

type Event = "on_drop" | "on_pick" | "on_equip" | "on_unpick"

export class ItemHandler {
	#scene: Scene
	#picked_item: Item.Usable | Item.Pickable | null = null
	#subscribers: {
		on_drop: ((item: Item.Usable) => void)[]
		on_pick: ((item: Item.Usable | Item.Pickable) => void)[]
		on_equip: ((item: Item.Usable) => void)[]
		on_unpick: ((item: Item.Usable | Item.Pickable) => void)[]
	} = {
		on_drop: [],
		on_pick: [],
		on_equip: [],
		on_unpick: []
	}

	constructor(scene: Scene) {
		this.#scene = scene
		this.#init_key_action_handler()
	}

	#init_key_action_handler() {
		NubEffectEvent.target(window).listen(({detail}) => {
			const pick_item = detail.effect === "pick" && (detail as NubDetail.Key).pressed
			const equip_item = detail.effect === "equip" && (detail as NubDetail.Key).pressed
			const drop_item = detail.effect === "drop" && (detail as NubDetail.Key).pressed
			const use = detail.effect === "primary" && (detail as NubDetail.Key).pressed
			const pick = this.#scene.pick(
				this.#scene.getEngine().getRenderWidth() / 2,
				this.#scene.getEngine().getRenderHeight() / 2
			)
			const item = pick?.pickedMesh?.metadata as Item.Any | Mesh
			if(drop_item) {this.#handle_item_drop()}
			if(pick_item) {this.#handle_item_pick(item)}
			if(equip_item) {this.#handle_item_equip()}
		})
	}
	
	#handle_item_drop() {
		if(this.#picked_item instanceof Item.Usable) {
			this.#publish("on_drop", this.#picked_item)
			this.#picked_item = null
		}
	}

	#handle_item_pick(item: Item.Any | Mesh) {
		if(!this.#picked_item && item instanceof Item.Usable || item instanceof Item.Pickable) {
			this.#publish("on_pick", item)
			this.#picked_item = item
		}
	}

	#handle_item_equip() {
		if(this.#picked_item instanceof Item.Usable)
			this.#publish("on_equip", this.#picked_item)
	}

	#publish(event: Event, item: Item.Pickable | Item.Usable) {
		if(event === "on_drop" || event === "on_equip") {
			this.#subscribers[event].forEach((callback) => {
				callback(item as Item.Usable)
			})
		}
		if(event === "on_pick" || event === "on_unpick") {
			this.#subscribers[event].forEach((callback) => {
				callback(item)
			})
		}
	}
	
	on_item_unequip() {}
	
	on_item_unpick() {}

	on_item_drop(callback: (item: Item.Usable) => void) {
		this.#subscribers.on_drop.push(callback)
	}
	
	on_item_pick(callback: (item: Item.Any) => void) {
		this.#subscribers.on_pick.push(callback)
	}

	on_item_equip(callback: (item: Item.Usable) => void) {
		this.#subscribers.on_equip.push(callback)
	}
}
