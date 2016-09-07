import React, { PropTypes } from 'react'
import { ItemContainer } from 'containers'
import { toolbar, dropdownIcon, list } from './styles.scss'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import { FontIcon, Button } from 'react-toolbox/lib'

Feed.propTypes = {
	itemIds: PropTypes.array.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedLastName: PropTypes.func.isRequired,
	sortFeedFirstName: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
}

export default function Feed (props) {
	return props.isFetching === true
		? <h3>{'Getting your items...'}</h3>
		: <div>
			<div className={toolbar}>
				<div>
					<IconMenu
						icon={<FontIcon value='sort' className={dropdownIcon}/>}
						position='topLeft'
						menuRipple={true}>
						<MenuItem icon='view_agenda' caption='Creation Date' onClick={props.sortFeedCreationDate}/>
						<MenuItem icon='monetization_on' caption='Purchase Date' onClick={props.sortFeedPurchaseDate}/>
						<MenuItem icon='people' caption='Last Name' onClick={props.sortFeedLastName}/>
						<MenuItem icon='people' caption='First Name' onClick={props.sortFeedFirstName}/>
						<MenuItem icon='laptop' caption='Make & Model' onClick={props.sortFeedHardware}/>
					</IconMenu>
					<span>{' Sort'}</span>
				</div>
				<div>
					<Button icon='cached' label='Change sort order' raised={true}
						primary={true} onClick={props.changeSortOrder}/>
				</div>
			</div>
			<div className={list}>
				{props.itemIds.map((id) => (
					<ItemContainer
						itemId={id}
						key={id} />
				))}
			</div>
		</div>
}
