
import {V2} from "@benev/nubs/x/tools/v2.js"
import {NubContext, NubEffectEvent} from "@benev/nubs"
import {Speeds} from "@benev/toolbox/x/trajectory/types/speeds.js"
import {get_user_move_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_move_trajectory_from_keys_and_stick.js"
import {add_user_pointer_movements_to_look} from "@benev/toolbox/x/babylon/flycam/utils/add_user_pointer_movements_to_look.js"
import {get_user_look_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_look_trajectory_from_keys_and_stick.js"

import {Character_capsule} from "./character_capsule"

export function integrate_nubs_to_control_character_capsule({
		character_capsule, look_sensitivity,
		nub_context, render_loop,
		speeds_for_movement,
		speeds_for_looking_with_keys_and_stick,
	}: {
		nub_context: NubContext
		look_sensitivity: {
			stick: number
			pointer: number
		}
		speeds_for_movement: Speeds
		render_loop: Set<() => void>
		speeds_for_looking_with_keys_and_stick: Speeds
		character_capsule: Character_capsule
	}) {

	NubEffectEvent
	.target(nub_context)
	.listen(

		add_user_pointer_movements_to_look({
			effect: "look",
			sensitivity: look_sensitivity.pointer,
			cause_to_use_when_pointer_not_locked: "Lookpad",
			add_look: (vector: V2) => character_capsule.look(vector),
			is_pointer_locked: () => !!document.pointerLockElement,
		})
	)

	function simulate() {
		character_capsule.move(
			get_user_move_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_movement,
			)
		)

		character_capsule.look(
			get_user_look_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_looking_with_keys_and_stick,
				look_sensitivity.stick,
			)
		)

	}

	render_loop.add(simulate)

	return character_capsule

}
