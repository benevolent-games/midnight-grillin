import {Item} from "../scene-items/Item.js";

type Event = "on_add" | "on_remove"

export class SceneItemsControl {

	#subscribers: {
		on_add: ((added: Item.Any) => void)[]
		on_remove: ((removed: Item.Any) => void)[]
	} = {
		on_add: [],
		on_remove: []
	}
	
	items: Item.Any[] = []
	
	constructor() {}

	add_item(item: Item.Any) {
		this.items.push(item)
		this.#publish("on_add", item)
		return this
	}
	
	remove_item(item: Item.Any) {
		const filter = this.items.filter(i => i !== item)
		this.items = filter
		this.#publish("on_remove", item)
	}

	#publish(event: Event, data: any) {
		if (!Array.isArray(this.#subscribers[event])) {
			return
		}
		this.#subscribers[event].forEach((callback) => {
			callback(data)
		})
	}
	
	on_item_removed(...callbacks: ((item: Item.Any) => void)[]) {
		this.#subscribers.on_remove.push(...callbacks)
	}
	
	on_item_added(...callbacks: ((item: Item.Any) => void)[]) {
		this.#subscribers.on_add.push(...callbacks)
	}
}
