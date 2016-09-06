import React, { PropTypes } from 'react'
import { Avatar, Button } from 'react-toolbox/lib'
import { item } from './styles.scss'

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
		<li className={item}>
			<Avatar><img src={hardware.photo.url} /></Avatar>
			<div>
				{person.firstName} {person.lastName}
			</div>
			<div>
				{hardware.make} {hardware.model}
			</div>
			<Button icon='edit'/>
		</li>
	)
}
