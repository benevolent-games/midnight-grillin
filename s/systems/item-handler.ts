import {Mesh, Scene} from "@babylonjs/core"
import {NubDetail, NubEffectEvent} from "@benev/nubs"

import {Item} from "../scene-items/Item.js"

type Event = "on_drop" | "on_pick" | "on_equip" | "on_unpick" | "on_intersect_change" | "on_use"

export class ItemHandler {
	#scene: Scene
	#picked_item: Item.Usable | Item.Pickable | null = null
	#intersected: Item.Any | Mesh | null = null
	#subscribers: {
		on_drop: ((item: Item.Usable | Item.Pickable) => void)[]
		on_pick: ((item: Item.Usable | Item.Pickable) => void)[]
		on_equip: ((item: Item.Usable) => void)[]
		on_use: ((equipped: Item.Usable, intersected: Item.Pickable) => void)[]
		on_intersect: ((prev_intersected: Item.Any | Mesh | null, new_intersected: Item.Any | Mesh, intersected_by: Item.Usable | Item.Pickable | null) => void)[]
	} = {
		on_drop: [],
		on_pick: [],
		on_equip: [],
		on_intersect: [],
		on_use: []
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
			this.#handle_intersect_change(item)
			if(drop_item) {this.#handle_item_drop()}
			if(pick_item) {this.#handle_item_pick(item)}
			if(equip_item) {this.#handle_item_equip()}
			if(use) {this.#handle_item_use(item)}
		})
	}

	#handle_item_use(intersected: Item.Any | Mesh) {
		if(this.#picked_item instanceof Item.Usable && this.#picked_item.equipped
			&& intersected instanceof Item.Pickable) {
			this.#publish("on_use", intersected)
		}
	}

	#handle_item_drop() {
		if(this.#picked_item) {
			this.#publish("on_drop", this.#picked_item)
			this.#picked_item = null
		}
	}

	#handle_item_pick(item: Item.Any | Mesh) {
		if(!this.#picked_item && (item instanceof Item.Usable || item instanceof Item.Pickable) && item !== this.#picked_item) {
			this.#picked_item = item
			this.#publish("on_pick", item)
		}
	}

	#handle_item_equip() {
		if(this.#picked_item instanceof Item.Usable && !this.#picked_item.equipped) 
			this.#publish("on_equip", this.#picked_item)
	}

	#handle_intersect_change(item: Item.Any | Mesh) {
		if(item !== this.#intersected) {
			this.#publish_on_intersect(this.#intersected, item)
			this.#intersected = item
		}
	}
	
	#publish_on_intersect(prev_intersected: Item.Any | Mesh | null, new_intersected: Item.Any | Mesh) {
		this.#subscribers.on_intersect.forEach((callback) =>
			callback(prev_intersected, new_intersected, this.#picked_item))
	}

	#publish(event: Event, item: Item.Any | Mesh) {
		if(event === "on_use") {
			this.#subscribers[event].forEach((callback) => {
				callback(this.#picked_item as Item.Usable, item as Item.Pickable)
			})
		}
		if(event === "on_equip") {
			this.#subscribers[event].forEach((callback) => {
				callback(item as Item.Usable)
			})
		}
		if(event === "on_pick" || event === "on_drop") {
			this.#subscribers[event].forEach((callback) => {
				callback(item as Item.Pickable | Item.Usable)
			})
		}
	}

	on_intersect_change(callback: (
		prev_intersected: Item.Any | Mesh | null,
		new_intersected: Item.Any | Mesh,
		intersected_by: Item.Usable | Item.Pickable | null
	) => void) {
		this.#subscribers.on_intersect.push(callback)
		return this
	}

	on_item_use(callback: (equipped: Item.Usable, intersected: Item.Pickable) => void) {
		this.#subscribers.on_use.push(callback)
		return this
	}

	on_item_unequip() {}
	
	on_item_drop(...callbacks: ((item: Item.Usable | Item.Pickable) => void)[]) {
		this.#subscribers.on_drop.push(...callbacks)
		return this
	}
	
	on_item_pick(...callbacks: ((item: Item.Pickable | Item.Usable) => void)[]) {
		this.#subscribers.on_pick.push(...callbacks)
		return this
	}

	on_item_equip(...callbacks: ((item: Item.Usable) => void)[]) {
		this.#subscribers.on_equip.push(...callbacks)
		return this
	}
}
