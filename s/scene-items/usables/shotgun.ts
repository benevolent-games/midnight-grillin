import {AbstractMesh, Mesh, Scene, Vector3} from "@babylonjs/core"

import {Item} from "../Item.js"

export class shotgun extends Item.Usable {
	use_label = "shoot"

	constructor(scene: Scene) {
		super(scene, "https://dl.dropbox.com/scl/fi/m30y6qsmad1yy62l0qyfj/simple_old_shotgun.glb?rlkey=6p6936n7ty9oxeewi22sfu1yl&dl=0")
		this.loading?.then(() => {
			this.mesh!.scaling = new Vector3(0.5, 0.5, 0.5)
			this.mesh!.position = new Vector3(0, 5, 0)})
	}

	use(item: Item.Any | Mesh): void {
	}

	on_unintersect() {
	}

	on_intersect(intersected_by: Item.Usable | Item.Pickable | null) {
	}

	on_equip(robotRightGun: AbstractMesh) {
		this.mesh!.position = new Vector3(robotRightGun.position.x + 0.5, robotRightGun.position.y - 0.75, robotRightGun.position.z + 0.6)
	}
}
