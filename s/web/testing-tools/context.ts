import {css} from "lit"
import {BaseContext, Flat, prepare_frontend} from "@benev/slate"
import {SceneItemsControl} from "../../systems/scene-items-control.js"

export class Context implements BaseContext {
	flat = new Flat()
	scene_items: SceneItemsControl

	constructor(scene_items: SceneItemsControl) {
		this.scene_items = scene_items
	}
	theme = css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
	`
}

export const {component, components, view, views} = prepare_frontend<Context>()

