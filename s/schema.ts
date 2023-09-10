export const schema = {
	humanoid: {
		pointer: {
			look: {causes: ["Pointer", "Lookpad"]},
		},
		stick: {
			move: {causes: ["Stick"]},
			look: {causes: ["Stick2"]},
		},
		key: {
			open_menu: {causes: ["Backquote"]},

			move_forward: {causes: ["KeyE", "ArrowUp"]},
			move_backward: {causes: ["KeyD", "ArrowDown"]},
			move_leftward: {causes: ["KeyS", "ArrowLeft"]},
			move_rightward: {causes: ["KeyF", "ArrowRight"]},

			move_fast: {causes: ["ShiftLeft"]},
			move_slow: {causes: ["CapsLock"]},

			jump: {causes: ["Space"]},
			crouch: {causes: ["KeyZ"]},
			primary: {causes: ["Mouse1"]},
			secondary: {causes: ["Mouse2"]},
			drop: {causes: ["KeyG"]},
			equip: {causes: ["KeyQ"]},
			pick: {causes: ["KeyR"]},

			look_up: {causes: ["KeyI"]},
			look_down: {causes: ["KeyK"]},
			look_left: {causes: ["KeyJ"]},
			look_right: {causes: ["KeyL"]},

			look_fast: {causes: ["Slash"]},
			look_slow: {causes: ["Period"]},
		},
	},
	menu: {
		key: {
			close_menu: {causes: ["KeyQ", "Backquote"]},
		},
	},
}
