import {MeshBuilder, Scene, Vector3} from "@babylonjs/core"
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"

import {Item} from "../Item.js"
import {Coal} from "../pickables/coal.js"

export class Steak extends Item.Usable {
	use_label = "eat"
	cook_time = 2

	burn_level = 0
	cook_level = 0
	
	cooked = false
	burned = false

	cooking = false
	minimum_temperature_to_start_cooking = 150

	#cook_levels_gui: TextBlock | undefined

	constructor(scene: Scene, ui: AdvancedDynamicTexture) {
		const steak = MeshBuilder.CreateIcoSphere("steak", {radiusX: 1, radiusZ: 1})
		steak.position = new Vector3(5,0,5)
		steak.id = "cookable"
		super(steak, scene)
		this.cook_levels_gui_test(ui)
	}

	on_unintersect() {}

	on_intersect() {}

	cook_levels_gui_test(ui: AdvancedDynamicTexture) {
		const cook_levels_label = new TextBlock()
		cook_levels_label.text = `
			cook: ${this.cook_level}
			burn: ${this.burn_level}
		`
		cook_levels_label.color = "Black"
		cook_levels_label.fontSize = "16"
		cook_levels_label.linkOffsetY = 10
		ui.addControl(cook_levels_label)
		cook_levels_label.linkWithMesh(this.mesh)
		this.#cook_levels_gui = cook_levels_label
	}

	calculate_cooking(heat_sources: Coal[]) {
		let burn_speed = 0
		let cook_speed = this.cooking ? 0.01 : 0

		heat_sources.forEach(source => {
			const distance = Vector3.Distance(this.mesh.position, source.mesh.position)
			const temperature = source.temperature / distance
			if(!this.cooking) {
				if(temperature > this.minimum_temperature_to_start_cooking) {
					this.start_cooking()
				}
			} else if(temperature > this.minimum_temperature_to_start_cooking) {
					burn_speed += this.calculate_burning_speed_modifier(temperature)
					cook_speed += this.calculate_cooking_speed_modifier(temperature)
			}
		})

		this.burn_level += burn_speed
		this.cook_level += cook_speed
		this.#cook_levels_gui!.text = `
			cook: ${Math.floor((this.cook_level / this.cook_time) * 100)}%
			burn: ${Math.floor((this.burn_level / this.cook_time) * 100)}%
		`

		if(this.burn_level >= 2 || this.cook_level >= 2) this.stop_cooking()
	}

	start_cooking() {
		if(this.cook_level < 2 && this.burn_level < 2)
			this.cooking = true
	}
	
	stop_cooking() {
		this.cooking = false
	}

	calculate_cooking_speed_modifier(heat_source_temp: number) {
		const baseModifier = 0.01
		const modifier = baseModifier * heat_source_temp / 1000
		return modifier
	}

	calculate_burning_speed_modifier(heat_source_temp: number) {
		const exponent = 3
		const modifier = Math.pow(heat_source_temp, exponent) / 2000000000
		return modifier
	}

	use() {}
}
