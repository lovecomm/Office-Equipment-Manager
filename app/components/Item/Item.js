import React from 'react'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'

export default function Item ({itemId, dateCreated, itemHardware, itemPerson, notes, photo}) {
	console.log('person photo', itemPerson.photoUrl)
	return (
		<Card style={{width: '350px'}}>
			<CardTitle
				avatar={itemPerson.photo.url}
				title={`${itemHardware.make} ${itemHardware.model}`}
				subtitle={itemId}/>
			<CardMedia
				aspectRatio='wide'/>
			<CardTitle
				title={`${itemPerson.firstName} ${itemPerson.lastName}`}
				subtitle={itemPerson.email}/>
		</Card>
	)
}
