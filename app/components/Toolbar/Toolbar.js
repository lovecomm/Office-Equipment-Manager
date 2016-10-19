import React, { PropTypes } from 'react'
import { toolbar, toolbarWrapper, filterChip, filterWrapper, sortWrapper, chipWrapper, sortWrapperIcon, newWrapper } from './styles.scss'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { HardwareFormToggleContainer, ItemFormToggleContainer, PersonFormToggleContainer } from 'containers'

Toolbar.propTypes = {
	activeView: PropTypes.string.isRequired,
	filter: PropTypes.object.isRequired,
	sortFeedCreationDate: PropTypes.func.isRequired,
	sortFeedPurchaseDate: PropTypes.func.isRequired,
	sortFeedLastName: PropTypes.func.isRequired,
	sortFeedFirstName: PropTypes.func.isRequired,
	sortFeedHardware: PropTypes.func.isRequired,
	changeSortOrder: PropTypes.func.isRequired,
	updateAndHandleFilter: PropTypes.func.isRequired,
	disableIsFiltering: PropTypes.func.isRequired,
}

export default function Toolbar (props) {
	return (
		<div className={toolbarWrapper} >
			<div className={toolbar}>
				<div className={newWrapper}>
					{(() => {
						switch (props.activeView) {
						case '/':
							return (<ItemFormToggleContainer editing={false} itemId='' serial=''/>)
						case '/people':
							return (<PersonFormToggleContainer editing={false} />)
						case '/hardware':
							return (<HardwareFormToggleContainer editing={false} />)
						default:
						}
					})()}
				</div>
				<div className={filterWrapper}>
					{(() => props.filter.isFiltering
						? (<div className={chipWrapper}>
								<span>{'Showing Only:'}</span>
								<Chip deletable={true}
									onDeleteClick={props.disableIsFiltering}
									className={filterChip}>
									{props.filter.name}</Chip>
							</div>
						) : (
							<Autocomplete
								label={(() => !props.filter.isFiltering
									? 'Show Only...' : '')()}
								direction='down'
								selectedPosition='above'
								onChange={(value) => props.updateAndHandleFilter(value)}
								value={props.filter.name}
								source={props.filter.options}/>
						))()}
				</div>
				<IconMenu
					icon={<span
						className={sortWrapperIcon}><MenuItem>{'Sort'}</MenuItem><MenuItem icon='sort' /></span>}
					position='topRight'
					className={sortWrapper}
					iconRipple={false}>
					{(() => {
						switch (props.activeView) {
						case '/':
							return (<div>
								<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.changeSortOrder}/>
								<MenuDivider />
								<MenuItem icon='sim_card' caption='Serial' onClick={props.sortFeedPurchaseDate}/>
								<MenuItem icon='event' caption='Date Created' onClick={props.sortFeedCreationDate}/>
								<MenuItem icon='monetization_on' caption='Purchase Date' onClick={props.sortFeedPurchaseDate}/>
							</div>)
						case '/people':
							return (<div>
								<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.changeSortOrder}/>
								<MenuDivider />
								<MenuItem icon='event' caption='Date Created' onClick={props.sortFeedCreationDate}/>
								<MenuItem icon='first_page' caption='First Name' onClick={props.sortFeedFirstName}/>
								<MenuItem icon='last_page' caption='Last Name' onClick={props.sortFeedLastName}/>
							</div>)
						case '/hardware':
							return (<div>
								<MenuItem icon='cached' caption='Reverse Sort Order' onClick={props.changeSortOrder}/>
								<MenuDivider />
								<MenuItem icon='event' caption='Date Created' onClick={props.sortFeedCreationDate}/>
								<MenuItem icon='devices_other' caption='Make' onClick={props.sortFeedHardware}/>
								<MenuItem icon='tv' caption='Model' onClick={props.sortFeedHardware}/>
							</div>)
						default:
						}
					})()}
				</IconMenu>
			</div>
		</div>
	)
}
