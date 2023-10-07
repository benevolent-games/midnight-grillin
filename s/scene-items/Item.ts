import {TextBlock} from "@babylonjs/gui"
import {AbstractMesh, AssetContainer, Mesh, PhysicsAggregate, PhysicsShapeType, Scene, Vector3} from "@babylonjs/core"

import {loadGlb} from "../utils/babylon/load-glb.js"

// pickable - fire starter, coal, wood, you can pick and put to inventory but cant use/equip, these will have its own methods
// that can be run only by usables
// usable - lighter, food, can pick or use it/equip, normalized use method to fire pickable method
// interactable - static item, but you can directly interact with it, cant use/equip/pick, interact does not more than running animation when interacted

export namespace Item {
	export abstract class Any {
		abstract pickable: boolean
		abstract usable: boolean
		abstract interactable: boolean

		mesh: AbstractMesh | undefined
		pick_ui: TextBlock | undefined
		scene: Scene
		aggr: PhysicsAggregate | undefined = undefined
		loading: Promise<AssetContainer> | undefined = undefined

		constructor(scene: Scene, url_or_mesh: string | AbstractMesh) {
			this.scene = scene
			//mesh.showBoundingBox = true
			if(typeof url_or_mesh === "string") {
				this.loading = this.loadGlb(scene, url_or_mesh)
				this.loading.then(a => {
					this.mesh = a.meshes[1]
					this.mesh.parent = null
					this.mesh!.metadata = this
					this.create_physics()
				})
			} else {
				this.mesh = url_or_mesh
				this.mesh!.metadata = this
				this.create_physics()
			}
		}

		abstract on_intersect(intersected_by: Item.Pickable | Item.Usable | null):any
		abstract on_unintersect():any

		async loadGlb(scene: Scene, glb_url: string) {
			return await loadGlb(scene, glb_url)
		}

		create_physics() {
			const aggr = new PhysicsAggregate(
				this.mesh!,
				PhysicsShapeType.MESH,
				{ mass: 1, restitution: 0, friction: 1 },
				this.scene
			)

			aggr.body.setMassProperties({
				//mass: 1,
				//inertia: new Vector3(0, 0, 0)
				inertia: this.mesh?.metadata instanceof Item.Interactable ? new Vector3(0,0,0) : undefined
			})
			aggr.body.disablePreStep = false
			aggr.body.computeMassProperties()
			this.aggr = aggr
		}

		dispose_physics() {
			this.aggr?.body.dispose()
			this.aggr?.dispose()
			this.mesh?.physicsBody?.dispose()
		}

	}

	export abstract class Pickable extends Any {
		readonly pickable = true
		readonly interactable = false
		readonly usable = false

		picked = false

		constructor(scene: Scene, url_or_mesh: string | AbstractMesh) {
			super(scene, url_or_mesh)
		}
	}

	export abstract class Interactable extends Any {
		readonly interactable = true
		readonly pickable = false
		readonly usable = false

		addons: Item.Any[] = []

		abstract interact(): void // method where animation from blender will run
		
		constructor(scene: Scene, url_or_mesh: string | AbstractMesh) {
			super(scene, url_or_mesh)
		}
	}
	
	export abstract class Usable extends Any {
		readonly pickable = true
		readonly interactable = false
		readonly usable = true
		equip_ui: TextBlock | undefined
		use_ui: TextBlock | undefined

		equipped = false
		picked = false
		
		abstract use_label:string
		
		abstract on_equip(parent: AbstractMesh): void
		abstract use(item: Item.Any | Mesh): void

		constructor(scene: Scene, url_or_mesh: string | AbstractMesh) {
			super(scene, url_or_mesh)
		}
	}
}
