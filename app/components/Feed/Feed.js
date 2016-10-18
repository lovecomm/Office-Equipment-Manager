import React, { PropTypes } from 'react'
import { ItemContainer, PersonContainer, HardwareContainer } from 'containers'
import { toolbar, list, filter, filterWrapper, filterName } from './styles.scss'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { Snackbar } from 'react-toolbox'

Feed.propTypes = {
	activeCards: PropTypes.string.isRequired,
	itemIds: PropTypes.array.isRequired,
	personIds: PropTypes.array.isRequired,
	hardwareIds: PropTypes.array.isRequired,
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
		? <h3 style={{textAlign: 'center'}}>{'Getting your items...'}</h3>
		: <div>
			<div className={toolbar}>
				<div className={filterWrapper}>
					<span>{'Filter'}</span>
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
			</div>
			<div className={list}>
				{(() => {
					switch (props.activeCards) {
					case '/':
						return props.itemIds.map((id) => (
							<ItemContainer
								itemId={id}
								key={id} />
						))
					case 'people':
						return props.personIds.map((id) => (
							<PersonContainer
								personId={id}
								key={id} />
						))
					case 'hardware':
						return props.hardwareIds.map((id) => (
							<HardwareContainer
								hardwareId={id}
								key={id} />
						))
					}
				})()}
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
