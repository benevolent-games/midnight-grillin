import {Item} from "../scene-items/Item.js"
import {Coal} from "../scene-items/pickables/coal.js"
import {Steak} from "../scene-items/usables/steak.js"

export class HeatingSystem {
	#heat_sources: Coal[] = [] // for now just coals, more will be added later
	#cookables: Steak[] = [] // for now just steak, more variety of food later

	constructor() {
		setInterval(() => this.recalculate_heat_levels(), 1000)
	}

	recalculate_heat_levels() {
		this.#cookables.map(cookable =>
			cookable.calculate_cooking(this.#heat_sources)
		),
		this.#heat_sources.map(heat =>
			heat.calculate_heat_level(this.#heat_sources.filter(h => h !== heat))
		)
	}

	add_heat_source = (item: Item.Any) => {
		if(item instanceof Coal) {
			this.#heat_sources.push(item)
		}
	}

	add_cookable = (item: Item.Any) => {
		if(item instanceof Steak) {
			this.#cookables.push(item)
		}
	}
}

