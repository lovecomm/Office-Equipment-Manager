import React, { PropTypes } from 'react'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { filterChip, chipWrapper, filterWrapper } from 'sharedStyles/actionBar.scss'

ItemsFilter.propTypes = {
	filter: PropTypes.object.isRequired,
	updateAndHandleItemsFilter: PropTypes.func.isRequired,
	disableIsFilteringItems: PropTypes.func.isRequired,
}

export default function ItemsFilter (props) {
	return (<div className={filterWrapper}>
		{(() => props.filter.isFiltering
			? (<div className={chipWrapper}>
					<span>{'Showing Only:'}</span>
					<Chip deletable={true}
						onDeleteClick={props.disableIsFilteringItems}
						className={filterChip}>
						{props.filter.name}</Chip>
				</div>
			) : (
				<Autocomplete
					label={(() => !props.filter.isFiltering
						? 'Show Only...' : '')()}
					direction='down'
					selectedPosition='above'
					onChange={(value) => props.updateAndHandleItemsFilter(value)}
					value={props.filter.name}
					source={props.filter.options}/>
			))()}
	</div>)
}
