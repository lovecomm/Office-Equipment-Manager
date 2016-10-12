import React, { PropTypes } from 'react'
import { Card, CardMedia, CardTitle, CardText } from 'react-toolbox/lib/card'
import { statusWarning, statusReplace, status, chips, fullWidthPhoto, cardNotExpanded, cardExpanded, cardHasSubContent } from './styles.scss'
import { EditMenuContainer } from 'containers'

Person.propTypes = {
	personId: PropTypes.string.isRequired,
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	items: PropTypes.object.isRequired,
	itemIds: PropTypes.array.isRequired,
	collapsed: PropTypes.bool.isRequired,
	envokeHandleCollapsed: PropTypes.func.isRequired,
}

export default function Person (props) {
	return (
		<div style={{position: 'relative'}} className={(() => props.itemIds.length > 0 ? cardHasSubContent : '')()}>
			<Card onClick={props.envokeHandleCollapsed} className={(() => props.collapsed ? cardNotExpanded : cardExpanded)()}>
				<CardTitle
					title={(() => `${props.firstName} ${props.lastName}`)()}
					subtitle={`Number of assigned items: ${props.itemIds.length.toString()}`} />
				{(() => {
					if (props.itemIds.length > 0 && !props.collapsed) {
						return props.itemIds.map((id) => (
							<CardTitle
								key={`person_item_${id}`}
								avatar={props.items[id].hardware.photo.url}
								title={`${props.items[id].hardware.make} ${props.items[id].hardware.model}`}
								subtitle={props.items[id].serial}/>
						))
					}
				})()}
			</Card>
			<EditMenuContainer id={props.personId} type='person' />
		</div>
	)
}
