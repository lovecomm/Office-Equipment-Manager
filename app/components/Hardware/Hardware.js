import React, { PropTypes } from 'react'
import { Card, CardTitle, CardActions, CardText } from 'react-toolbox/lib/card'
import { Button } from 'react-toolbox/lib'
import { cardActions, subCardActions, chips } from 'sharedStyles/cards.scss'
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
				title={(() => `${props.make} ${props.model}`)()} />
			<CardText className={chips}>
				<span>{(() => `Used by ${props.itemIds.length.toString()} item(s)`)()}</span>
			</CardText>
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
			<CardActions className={cardActions} data-content={(() => props.itemIds.length > 0)()}>
				{props.itemIds.length > 0
				? <Button primary={true} label={(() => props.collapsed ? 'Show Items' : 'Hide Items')()} onClick={props.envokeHandleCollapsed}/>
				: ''}
				<EditMenuContainer id={props.hardwareId} type='hardware' />
			</CardActions>
		</Card>
	)
}
