import React, { PropTypes } from 'react'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import { Button } from 'react-toolbox/lib'
import { cardActions, subCardActions } from 'sharedStyles/cards.scss'
import { EditMenuContainer } from 'containers'

Person.propTypes = {
	personId: PropTypes.string.isRequired,
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	photoUrl: PropTypes.string.isRequired,
	items: PropTypes.object.isRequired,
	itemIds: PropTypes.array.isRequired,
	collapsed: PropTypes.bool.isRequired,
	envokeHandleCollapsed: PropTypes.func.isRequired,
}

export default function Person (props) {
	return (
		<Card>
			<CardTitle
				avatar={props.photoUrl}
				title={(() => `${props.firstName} ${props.lastName}`)()}
				subtitle={`Items: ${props.itemIds.length.toString()}`} />
			{(() => {
				if (props.itemIds.length > 0 && !props.collapsed) {
					return props.itemIds.map((id) => (
						<div key={`person_item_${id}`} style={{position: 'relative'}}>
							<CardTitle
								avatar={props.items[id].hardware.photo.url}
								title={`${props.items[id].hardware.make} ${props.items[id].hardware.model}`}
								subtitle={props.items[id].serial}/>
							<CardActions className={subCardActions}><EditMenuContainer id={id} type='item'/></CardActions>
						</div>
					))
				}
			})()}
			<CardActions className={cardActions}>
				{props.itemIds.length > 0
				? <Button label={(() => props.collapsed ? 'Show Items' : 'Hide Items')()} onClick={props.envokeHandleCollapsed}/>
				: ''}
				<EditMenuContainer id={props.personId} type='person' />
			</CardActions>
		</Card>
	)
}
