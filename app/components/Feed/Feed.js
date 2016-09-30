import React, { PropTypes } from 'react'
import { ItemContainer } from 'containers'
import { toolbar, dropdownIcon, list, filter, filterWrapper, filterName } from './styles.scss'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import { FontIcon, Button, Autocomplete, Chip } from 'react-toolbox/lib'
import { Snackbar } from 'react-toolbox'

Feed.propTypes = {
	itemIds: PropTypes.array.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	filter: PropTypes.object.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedLastName: PropTypes.func.isRequired,
	sortFeedFirstName: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
	updateAndHandleFilter: PropTypes.func.isRequired,
	disableIsFiltering: PropTypes.func.isRequired,
	handleConfirmDeleteTimeout: PropTypes.func.isRequired,
	handleDeleteData: PropTypes.func.isRequired,
	confirmDeleteActive: PropTypes.bool.isRequired,
	toDeleteType: PropTypes.string.isRequired,
	toDeleteId: PropTypes.string.isRequired,
}

export default function Feed (props) {
	return props.isFetching === true
		? <h3>{'Getting your items...'}</h3>
		: <div>
			<div className={toolbar}>
				<div className={filterWrapper}>
					<span>{'Filter:'}</span>
					<Autocomplete
						direction='down'
						selectedPosition='above'
						className={filter}
						onChange={(value) => props.updateAndHandleFilter(value)}
						value={props.filter.name}
						source={props.filter.options}/>
					{props.filter.isFiltering
					? <Chip deletable={true} onDeleteClick={props.disableIsFiltering} className={filterName}>{props.filter.name}</Chip>
					: ''}
				</div>
				<div>
					<Button icon='cached' label='Change sort order' raised={true}
						primary={true} onClick={props.changeSortOrder}/>
					<IconMenu
						icon={<FontIcon value='sort' className={dropdownIcon}/>}
						position='topRight'
						menuRipple={true}>
						<MenuItem icon='view_agenda' caption='Creation Date' onClick={props.sortFeedCreationDate}/>
						<MenuItem icon='monetization_on' caption='Purchase Date' onClick={props.sortFeedPurchaseDate}/>
						<MenuItem icon='people' caption='Last Name' onClick={props.sortFeedLastName}/>
						<MenuItem icon='people' caption='First Name' onClick={props.sortFeedFirstName}/>
						<MenuItem icon='laptop' caption='Make & Model' onClick={props.sortFeedHardware}/>
					</IconMenu>
				</div>
			</div>
			<div className={list}>
				{props.itemIds.map((id) => (
					<ItemContainer
						itemId={id}
						key={id} />
				))}
			</div>
			<Snackbar
				action='delete'
				active={props.confirmDeleteActive}
				icon='delete'
				timeout={10000}
				onTimeout={props.handleConfirmDeleteTimeout}
				onClick={props.handleDeleteData}
				label={(() => {
					switch (props.toDeleteType) {
					case 'people':
						return 'Are you sure you want to delete this person? If you do, ALL ITEMS assigned to this person will be assigned to INVENTORY. There is no taking back this action.'
					case 'hardwares':
						return 'Are you sure you want to delete this hardware? If you do, ALL ITEMS using this hardware will be deleted. There is no taking back this action.'
					default:
						return 'Are you sure you want to delete this item? There is no taking back this action.'
					}
				})()}
				type='cancel' />
		</div>
}
