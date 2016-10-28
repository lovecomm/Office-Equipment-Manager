import React, { PropTypes } from 'react'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { filterChip, chipWrapper, filterWrapper } from 'sharedStyles/actionBar.scss'

HardwaresFilter.propTypes = {
	filter: PropTypes.object.isRequired,
	updateAndHandleHardwaresFilter: PropTypes.func.isRequired,
	disableIsFilteringHardwares: PropTypes.func.isRequired,
}

export default function HardwaresFilter (props) {
	return (<div className={filterWrapper}>
		{(() => props.filter.isFiltering
			? (<div className={chipWrapper}>
					<span>{'Showing Only:'}</span>
					<Chip deletable={true}
						onDeleteClick={props.disableIsFilteringHardwares}
						className={filterChip}>
						{props.filter.name}</Chip>
				</div>
			) : (
				<Autocomplete
					label={(() => !props.filter.isFiltering
						? 'Show Only...' : '')()}
					direction='down'
					selectedPosition='above'
					onChange={(value) => props.updateAndHandleHardwaresFilter(value)}
					value={props.filter.name}
					source={props.filter.options}/>
			))()}
	</div>)
}
