import React, { PropTypes } from 'react'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { filterChip, chipWrapper, filterWrapper } from 'sharedStyles/actionBar.scss'

PeopleFilter.propTypes = {
	isFiltering: PropTypes.bool.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.object.isRequired,
	disableIsFilteringPeople: PropTypes.func.isRequired,
	updateAndHandlePeopleFilter: PropTypes.func.isRequired,
	filterOptions: PropTypes.func.isRequired,
}

export default function PeopleFilter (props) {
	return (<div className={filterWrapper}>
		{(() => props.isFiltering
			? (<div className={chipWrapper}>
					<span>{'Showing Only:'}</span>
					<Chip deletable={true}
						onDeleteClick={props.disableIsFilteringPeople}
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
					onChange={(value) => props.updateAndHandlePeopleFilter(value)}
					value={props.name}
					source={props.options}/>
			))()}
	</div>)
}
