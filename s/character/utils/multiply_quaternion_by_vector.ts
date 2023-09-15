import {Quaternion, Vector3} from "@babylonjs/core"

export function multiply_quaternion_by_vector(quaternion: Quaternion, vector: Vector3) {
	const target = new Vector3()

	const x = vector.x,
			y = vector.y,
			z = vector.z

	const qx = quaternion.clone().x,
			qy = quaternion.clone().y,
			qz = quaternion.clone().z,
			qw = quaternion.clone().w

	const ix = qw * x + qy * z - qz * y,
			iy = qw * y + qz * x - qx * z,
			iz = qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z

	target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy
	target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz
	target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx

	return target
}
