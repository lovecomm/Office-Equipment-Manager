import React, { PropTypes } from 'react'
import { Autocomplete, Chip } from 'react-toolbox/lib'
import { filterChip, chipWrapper } from 'sharedStyles/filter.scss'

export default function PeopleFilter (props) {
	return (<div>
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
	</div>)
}
