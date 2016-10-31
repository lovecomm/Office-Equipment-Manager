import React, { PropTypes } from 'react'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { filterChip, chipWrapper, filterWrapper } from 'sharedStyles/actionBar.scss'

ItemsFilter.propTypes = {
	isFiltering: PropTypes.bool.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.object.isRequired,
	disableIsFilteringItems: PropTypes.func.isRequired,
	updateAndHandleItemsFilter: PropTypes.func.isRequired,
	filterOptions: PropTypes.func.isRequired,
}

export default function ItemsFilter (props) {
	return (<div className={filterWrapper}>
		{(() => props.isFiltering
			? (<div className={chipWrapper}>
					<span>{'Showing Only:'}</span>
					<Chip deletable={true}
						onDeleteClick={props.disableIsFilteringItems}
						className={filterChip}>
						{props.name}</Chip>
				</div>
			) : (
				<Autocomplete
					label={(() => !props.isFiltering
						? 'Show Only...' : '')()}
					direction='down'
					selectedPosition='above'
					onInput={(e) => props.filterOptions(e)}
					onChange={(value) => props.updateAndHandleItemsFilter(value)}
					value={props.name}
					source={props.options}/>
			))()}
	</div>)
}
