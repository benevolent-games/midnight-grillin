import "@babylonjs/core/Physics/physicsEngineComponent.js"

import {HavokPlugin} from "@babylonjs/core"
import {Scene} from "@babylonjs/core/scene.js"
import {v3, V3} from "@benev/toolbox/x/utils/v3.js"
import HavokPhysics from "@babylonjs/havok/lib/esm/HavokPhysics_es.js"

export async function setupPhysics(
		scene: Scene,
		gravity: V3,
	) {

	const havok = await HavokPhysics()
	const physics = new HavokPlugin(true, havok)
	scene.enablePhysics(v3.toBabylon(gravity), physics)
}
