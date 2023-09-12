import {register_to_dom} from "@benev/slate"

import {TestingTools} from "../testing-tools/element.js"
import {prepare_systems} from "../../utils/prepare-systems.js"
import {Context, components} from "../testing-tools/context.js"

export function prepare_testing_tools(systems: ReturnType<typeof prepare_systems>) {
	const context = new Context(systems)
	register_to_dom(components(context, {
		TestingTools
	}))
}
