import React from 'react'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'

export default function Item ({itemId, dateCreated, itemHardware, itemPerson, notes, photo}) {
	return (
		<Card style={{width: '350px'}}>
			<CardTitle
				avatar={itemHardware.photo.url}
				title={`${itemHardware.make} ${itemHardware.model}`}
				subtitle={itemId}/>
			<CardTitle
				avatar={itemPerson.photo.url}
				title={`${itemPerson.firstName} ${itemPerson.lastName}`}
				subtitle={itemPerson.email}/>
		</Card>
	)
}
