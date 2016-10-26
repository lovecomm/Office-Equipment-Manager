import React, { PropTypes } from 'react'
import { PersonFormToggleContainer, PersonContainer, PeopleFilterContainer, PeopleSortMenuContainer } from 'containers'
import { ActionBar } from 'components'
import { list } from 'sharedStyles/layout'

PeopleFeed.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	feedIds: PropTypes.array.isRequired,
}

export default function PeopleFeed (props) {
	return props.isFetching === true
		? <h3 style={{textAlign: 'center', marginTop: '25%'}}>{'Getting people...'}</h3>
		: <div>
			<ActionBar
				newFormToggle={<PersonFormToggleContainer editing={false} />}
				filter={<PeopleFilterContainer />}
				sortMenu={<PeopleSortMenuContainer />}/>
			<div className={list}>
				{(() => {
					return props.feedIds.map((id) => (
						<PersonContainer
							personId={id}
							key={id} />
					))
				})()}
			</div>
		</div>
}
