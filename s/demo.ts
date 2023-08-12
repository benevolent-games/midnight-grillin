import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import "@benev/toolbox/x/html.js"

void async function main() {
	const theater = document.querySelector<BenevTheater>("benev-theater")!
	await theater.updateComplete

	const {
		nubContext,
		babylon: {
			renderLoop,
			engine,
			scene,
			resize,
			start,
		}
	} = theater

	start()
}()


console.log("demo")
