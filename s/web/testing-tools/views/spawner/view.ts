import {html} from "lit"
import {ShaleView} from "@benev/slate"
import {view} from "../../context.js"
import {styles} from "./style.css.js"
import {Item} from "../../../../scene-items/Item.js"
import toolSvg from "../../../icons/tabler-icons/tool.svg.js"
import {get_all_items} from "../../../utils/get_all_items.js"
import outlineAddSvg from "../../../icons/icon-park/outline-add.svg.js"

export const Spawner = view(context => class extends ShaleView {
	//static name = "spawner"
	static styles = styles


	#items = get_all_items()
	#state = context.flat.state({
		isPanelOpen: false
	})
	
	#systems = context.systems
	#scene = context.systems.scene
	#ui = context.systems.ui
	#add_item = (item: Item.Any) => this.#systems.scene_items.add_item(item)

	#render_items() {
		const items = Object.values(this.#items)
		return items.map(Item => html`
			<div class="item">
				<span>${Item.name}</span>
				<span
					@click=${() => this.#add_item(new Item(this.#scene, this.#ui))}
					class="svg">
					${outlineAddSvg}
				</span>
			</div>
		`)
	}

	#toggle_panel_open = (e: Event) => {
		e.preventDefault()
		this.#state.isPanelOpen = !this.#state.isPanelOpen
	}


	render() {
		return html`
			<div>
				<div class="icon" @click=${this.#toggle_panel_open}>
					${toolSvg}
				</div>
					${this.#state.isPanelOpen
						?	html`
							<div class=items>
								<p>Spawner</p>
								${this.#render_items()}
							</div>`
						: null}
			</div>`
	}
})
