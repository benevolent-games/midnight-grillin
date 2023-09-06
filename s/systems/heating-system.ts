import {Scene} from "@babylonjs/core"

import {Coal} from "../scene-items/pickables/coal.js"
import {Steak} from "../scene-items/usables/steak.js"

export class HeatingSystem {
	heat_sources: Coal[] = [] // for now just coals, more will be added later
	cookables: Steak[] = [] // for now just steak, more variety of food later
	scene: Scene

	constructor(scene: Scene) {
		this.scene = scene
		this.cookables = this.get_cookables()
		this.heat_sources = this.get_heat_sources()
		setInterval(() => this.recalculate_heat_levels(), 1000)
	}

	recalculate_heat_levels() {
		this.cookables.map(cookable =>
			cookable.calculate_cooking(this.heat_sources)
		),
		this.heat_sources.map(heat =>
			heat.calculate_heat_level(this.heat_sources.filter(h => h !== heat))
		)
	}

	get_heat_sources() {
		const heat_sources = this.scene.getMeshesById("heat-source").map(h => h.metadata) as Coal[] | null
		if(heat_sources) return heat_sources
			else return []
	}

	get_cookables() {
		const cookables = this.scene.getMeshesById("cookable").map(c => c.metadata) as Steak[] | null
		if(cookables) return cookables
			else return []
	}
}
