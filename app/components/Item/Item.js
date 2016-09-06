import React, { PropTypes } from 'react'

Item.PropTypes = {
	serial: PropTypes.string.isRequired,
	person: PropTypes.object.isRequired,
	hardware: PropTypes.object.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object.isRequired,
	purchasedAtDate: PropTypes.string.isRequired,
}

export default function Item ({serial, hardware, person, notes, photo, purchasedAtDate}) {
	return (
		<li>
			{serial}
			<br />
			{hardware.make} {hardware.model}
		</li>
	)
}
