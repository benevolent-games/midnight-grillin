import {Scene} from "@babylonjs/core"

import {Coal} from "../scene-items/pickables/coal.js"
import {Steak} from "../scene-items/usables/steak.js"

export class HeatingSystem {
	heat_sources: Coal[] = [] // for now just coals, more will be added later
	cookables: Steak[] = [] // for now just steak, more variety of food later
	scene: Scene

	constructor(scene: Scene) {
		this.scene = scene
		setInterval(() => this.recalculate_heat_levels(), 1000)
	}

	recalculate_heat_levels() {
		this.heat_sources = this.get_active_heat_sources()
		this.cookables.map(cookable =>
			cookable.calculate_cook_level(this.heat_sources)
		),
		this.heat_sources.map(heat =>
			heat.calculate_heat_level(this.heat_sources.filter(h => h !== heat))
		)
	}

	get_active_heat_sources() {
		const heat_sources = this.scene.getMeshesById("heat-source").map(h => h.metadata) as Coal[] | null
		const heat_sources_burning = heat_sources?.filter(heat_source => heat_source.burning)
		if(heat_sources_burning) return heat_sources_burning
			else return []
	}
}
