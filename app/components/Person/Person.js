import React, { PropTypes } from 'react'
import { Card, CardTitle, CardActions, CardText } from 'react-toolbox/lib/card'
import { Button } from 'react-toolbox/lib'
import { cardActions, subCardActions, chips } from 'sharedStyles/cards.scss'
import { DeleteDataContainer, PersonFormToggleContainer, ItemFormToggleContainer } from 'containers'

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
				title={(() => `${props.firstName} ${props.lastName}`)()} />
			<CardText className={chips}>
				{(() => props.itemIds.map((id) => (
					<span key={id}>{props.items[id].serial}</span>
				)))()}
			</CardText>
			{(() => {
				if (props.itemIds.length > 0 && !props.collapsed) {
					return props.itemIds.map((id) => (
						<div key={`person_item_${id}`} style={{position: 'relative'}}>
							<CardTitle
								avatar={props.items[id].hardware.photo.url}
								title={props.items[id].serial}
								subtitle={`${props.items[id].hardware.make}  ${props.items[id].hardware.model}`}/>
							<CardActions className={subCardActions}>
								<ItemFormToggleContainer itemId={id} editing={true}/>
								<DeleteDataContainer id={id} type='item'/>
							</CardActions>
						</div>
					))
				}
			})()}
			<CardActions className={cardActions} data-content={(() => props.itemIds.length > 0)()}>
				{props.itemIds.length > 0
				? <Button primary={true} label={(() => props.collapsed ? 'Show Items' : 'Hide Items')()} onClick={props.envokeHandleCollapsed}/>
				: ''}
				<PersonFormToggleContainer personId={props.personId} editing={true}/>
				<DeleteDataContainer id={props.personId} type='person' />
			</CardActions>
		</Card>
	)
}
