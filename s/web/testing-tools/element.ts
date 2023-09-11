import {html} from "lit"
import {GoldElement} from "@benev/slate"

import {styles} from "./style.css.js"
import {component} from "./context.js"

export const TestingTools = component(context => class extends GoldElement {
	static styles = styles
	#state = context.flat.state({
		count: 0,
	})

	#scene_items = context.scene_items

	//#add_item = () =>

	render() {
		return html`<div>halo123123123</div>`
	}
})
