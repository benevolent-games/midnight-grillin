import {html} from "lit"
import {GoldElement} from "@benev/slate"

import {styles} from "./style.css.js"
import {component, views} from "./context.js"
import {Spawner} from "./views/spawner/view.js"

export const TestingTools = component(context => class extends GoldElement {
	static styles = styles
	
	#views = views(context, {
		Spawner,
	})

	render() {
		return html`
			${this.#views.Spawner({props: context as any})}
		`
	}
})
