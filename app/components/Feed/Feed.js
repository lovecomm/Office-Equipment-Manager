import React, { PropTypes } from 'react'
import { ItemContainer } from 'containers'
import { toolbar, sorting, searchbox, dropdownIcon, dropdownMenu } from './styles.scss'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import { FontIcon, Button } from 'react-toolbox/lib'

Feed.propTypes = {
	itemIds: PropTypes.array.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedPeople: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
}

export default function Feed (props) {
	return props.isFetching === true
		? <h1>{'Getting your items...'}</h1>
		: <div>
			<div className={toolbar}>
				<div className={searchbox}>
					<IconMenu
						className={dropdownMenu}
						icon={<FontIcon value='sort' className={dropdownIcon}/>}
						position='topLeft'
						menuRipple={true}>
						<MenuItem icon='view_agenda' caption='Creation Date' onClick={props.sortFeedCreationDate}/>
						<MenuItem icon='monetization_on' caption='Purchase Date' onClick={props.sortFeedPurchaseDate}/>
						<MenuItem icon='people' caption='People' onClick={props.sortFeedPeople}/>
						<MenuItem icon='laptop' caption='Hardware' onClick={props.sortFeedHardware}/>
					</IconMenu>
					<span>{' Sort Items'}</span>
				</div>
				<div className={sorting}>
					<Button icon='cached' label='Change sort order' raised={true}
						primary={true} onClick={props.changeSortOrder}/>
				</div>
			</div>
			<ul>
				{props.itemIds.map((id) => (
					<ItemContainer
						itemId={id}
						key={id} />
				))}
			</ul>
		</div>
}
