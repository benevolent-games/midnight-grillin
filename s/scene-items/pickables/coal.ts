import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"
import {Color3, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core"

import {Item} from "../Item.js"
import {Lighter} from "../usables/lighter.js"

export class Coal extends Item.Pickable {
	life_time = 5
	burn_level = 0
	temperature = 0
	burning = false

	minimum_temperature = 300
	maximum_temperature = 1000

	position: Vector3 = new Vector3(0,0,0)
	#ignite_gui: TextBlock | undefined
	#temperature_gui: TextBlock | undefined
	#burning_material: StandardMaterial

	constructor(scene: Scene, ui: AdvancedDynamicTexture) {
		const coal = MeshBuilder.CreateIcoSphere("coal", {radiusX: 0.2, radiusY: 0.15, radiusZ: 0.2})
		coal.id = "heat-source"
		coal.position = new Vector3(6,0,5)
		super(scene, coal)
		this.#burning_material = new StandardMaterial("burning", this.scene)
		this.create_coal_gui(ui)
		this.temperature_gui_test(ui)
		const coalMaterial = new StandardMaterial("coal", this.scene)
		coalMaterial.diffuseColor = new Color3(0,0,0)
		this.mesh!.material = coalMaterial
	}
	
	on_intersect(intersected_by: Item.Pickable | Item.Usable | null) {
		if(!this.burning && intersected_by instanceof Lighter && intersected_by.equipped) {
			this.#ignite_gui!.isVisible = true
		}
		if(this.burning) {
			this.#temperature_gui!.isVisible = true
		}
	}

	on_unintersect() {
		this.#ignite_gui!.isVisible = false
	}

	create_coal_gui(ui: AdvancedDynamicTexture) {
		const ignite_label = new TextBlock()
		ignite_label.text = "ignite"
		ignite_label.color = "Red"
		ignite_label.fontSize = "16"
		ignite_label.linkOffsetY = 5
		ui.addControl(ignite_label)
		ignite_label.linkWithMesh(this.mesh!)
		this.#ignite_gui = ignite_label
		ignite_label.isVisible = false
	}

	temperature_gui_test(ui: AdvancedDynamicTexture) {
		const temperature_label = new TextBlock()
		temperature_label.text = `${this.temperature} ℃`
		temperature_label.color = "Green"
		temperature_label.fontSize = "16"
		temperature_label.top = 5
		ui.addControl(temperature_label)
		temperature_label.linkWithMesh(this.mesh!)
		this.#temperature_gui = temperature_label
		temperature_label.isVisible = false
	}
	
	ignite() {
		if(this.burn_level < 2) {
			this.burning = true
		}
	}

	stop_burning() {
		this.burning = false
	}

	#some_color_to_see_coal_burning() {
		const midpoint = (this.life_time / 2)
		const temperature_color = this.temperature / 1000
		if(this.burn_level < midpoint) {
			this.#burning_material.emissiveColor = new Color3(temperature_color,0,0)
			this.#burning_material.diffuseColor = new Color3(temperature_color,0,0)
		} else if (this.burn_level > midpoint) {
			this.#burning_material.emissiveColor = new Color3(temperature_color,1 - temperature_color,1 - temperature_color)
			this.#burning_material.diffuseColor = new Color3(temperature_color,1 - temperature_color,1 - temperature_color)
		}
		this.mesh!.material = this.#burning_material
	}

	calculate_heat_level(heat_sources: Coal[]) {
		let burn_speed = this.burning ? 0.01 : 0

		heat_sources.forEach(source => {
			const distance = Vector3.Distance(this.mesh!.position, source.mesh!.position)
			const temperature = source.temperature / distance
			if(!this.burning && this.burn_level < this.life_time) {
				if(temperature > this.minimum_temperature) {
					this.ignite()
				}
			} else if(this.burning) {
					burn_speed += this.#calculate_burning_speed_modifier(temperature)
			}
		})

		this.burn_level += burn_speed
		this.temperature = this.#calculate_coal_temperature(burn_speed)
		this.#temperature_gui!.text = `${this.temperature.toFixed()} ℃`
		this.#some_color_to_see_coal_burning()
		if(this.temperature <= 0) {this.stop_burning()}
	}

	#calculate_burning_speed_modifier(heat_source_temp: number) {
		const exponent = 2
		const modifier = Math.pow(heat_source_temp, exponent) / 150000000 // at best/closest it can burn 1.5x faster for each heat source
		return modifier
	}

	#calculate_coal_temperature(burn_speed: number) {
		const midpoint = (this.life_time / 2)
		const percentage = this.burn_level <= midpoint  // percentage goes up to 100% (half life) then to 0% (end of life)
			? this.burn_level / midpoint 
			: (midpoint + (midpoint + (-this.burn_level))) / midpoint
		const modifier =  1 + ((0.3 * percentage) + (burn_speed * 4))
		const temperature = (this.minimum_temperature * modifier) * percentage
		return temperature
	}
}
