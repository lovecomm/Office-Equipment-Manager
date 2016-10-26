import React, { PropTypes } from 'react'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { filterChip, chipWrapper, filterWrapper } from 'sharedStyles/actionBar.scss'

PeopleFilter.propTypes = {
	filter: PropTypes.object.isRequired,
	updateAndHandlePeopleFilter: PropTypes.func.isRequired,
	disableIsFilteringPeople: PropTypes.func.isRequired,
}

export default function PeopleFilter (props) {
	return (<div className={filterWrapper}>
		{(() => props.filter.isFiltering
			? (<div className={chipWrapper}>
					<span>{'Showing Only:'}</span>
					<Chip deletable={true}
						onDeleteClick={props.disableIsFilteringPeople}
						className={filterChip}>
						{props.filter.name}</Chip>
				</div>
			) : (
				<Autocomplete
					label={(() => !props.filter.isFiltering
						? 'Show Only...' : '')()}
					direction='down'
					selectedPosition='above'
					onChange={(value) => props.updateAndHandlePeopleFilter(value)}
					value={props.filter.name}
					source={props.filter.options}/>
			))()}
	</div>)
}
