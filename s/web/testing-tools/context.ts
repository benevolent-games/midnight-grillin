import {css} from "lit"
import {Systems} from "../../utils/prepare-systems.js"
import {BaseContext, Flat, prepare_frontend} from "@benev/slate"

export class Context implements BaseContext {
	flat = new Flat()
	systems: Systems

	constructor(systems: Systems) {
		this.systems = systems
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

