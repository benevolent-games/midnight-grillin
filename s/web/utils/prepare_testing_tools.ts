import {register_to_dom} from "@benev/slate"

import {TestingTools} from "../testing-tools/element.js"
import {Context, components} from "../testing-tools/context.js"
import {SceneItemsControl} from "../../systems/scene-items-control.js"

export function prepare_testing_tools(scene_items: SceneItemsControl) {
	const context = new Context(scene_items)
	register_to_dom(components(context, {
		TestingTools
	}))
}
