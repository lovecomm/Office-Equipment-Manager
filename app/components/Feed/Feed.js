import React, { PropTypes } from 'react'
import { ItemContainer, PersonContainer, HardwareContainer, ToolbarContainer } from 'containers'
import { list } from './styles.scss'
import { Snackbar } from 'react-toolbox'

Feed.propTypes = {
	activeCards: PropTypes.string.isRequired,
	itemIds: PropTypes.array.isRequired,
	personIds: PropTypes.array.isRequired,
	hardwareIds: PropTypes.array.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	handleConfirmDeleteTimeout: PropTypes.func.isRequired,
	handleDeleteData: PropTypes.func.isRequired,
	confirmDeleteActive: PropTypes.bool.isRequired,
	toDeleteType: PropTypes.string.isRequired,
	toDeleteId: PropTypes.string.isRequired,
}

export default function Feed (props) {
	return props.isFetching === true
		? <h3 style={{textAlign: 'center', marginTop: '25%'}}>{'Getting your items...'}</h3>
		: <div>
			<ToolbarContainer activeCards={props.activeCards}/>
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
