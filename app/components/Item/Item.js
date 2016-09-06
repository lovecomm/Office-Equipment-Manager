import React, { PropTypes } from 'react'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'

Item.PropTypes = {
	serial: PropTypes.string.isRequired,
	dateCreated: PropTypes.number.isRequired,
	itemPerson: PropTypes.object.isRequired,
	itemHardware: PropTypes.object.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object.isRequired,
}

export default function Item ({serial, dateCreated, itemHardware, itemPerson, notes, photo}) {
	return (
		<Card style={{width: '350px'}}>
			<CardTitle
				avatar={itemHardware.photo.url}
				title={`${itemHardware.make} ${itemHardware.model}`}
				subtitle={serial}/>
			<CardTitle
				avatar={itemPerson.photo.url}
				title={`${itemPerson.firstName} ${itemPerson.lastName}`}
				subtitle={itemPerson.email}/>
		</Card>
	)
}
