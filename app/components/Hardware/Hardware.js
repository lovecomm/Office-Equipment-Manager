import React, { PropTypes } from 'react'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import { Button } from 'react-toolbox/lib'
import { cardActions, subCardActions } from 'sharedStyles/cards.scss'
import { EditMenuContainer } from 'containers'

Hardware.propTypes = {
	hardwareId: PropTypes.string.isRequired,
	make: PropTypes.string.isRequired,
	model: PropTypes.string.isRequired,
	items: PropTypes.object.isRequired,
	itemIds: PropTypes.array.isRequired,
	photoUrl: PropTypes.string.isRequired,
	collapsed: PropTypes.bool.isRequired,
	envokeHandleCollapsed: PropTypes.func.isRequired,
}

export default function Hardware (props) {
	return (
		<Card>
			<CardTitle
				avatar={props.photoUrl}
				title={(() => `${props.make} ${props.model}`)()}
				subtitle={`Items: ${props.itemIds.length.toString()}`} />
			{(() => {
				if (props.itemIds.length > 0 && !props.collapsed) {
					return props.itemIds.map((id) => (
						<div key={`hardware_item_${id}`} style={{position: 'relative'}}>
							<CardTitle
								avatar={props.items[id].person.photo.url}
								title={`${props.items[id].person.firstName} ${props.items[id].person.lastName}`}
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
				<EditMenuContainer id={props.hardwareId} type='hardware' />
			</CardActions>
		</Card>
	)
}
