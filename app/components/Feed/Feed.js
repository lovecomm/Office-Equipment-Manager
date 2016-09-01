import React, { PropTypes } from 'react'
import { ItemContainer } from 'containers'

Feed.propTypes = {
	itemIds: PropTypes.array.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
}

export default function Feed (props) {
	return props.isFetching === true
		? <h1>{'Getting your items...'}</h1>
		: <div>
			{props.itemIds.map((id) => (
				<ItemContainer
					itemId={id}
					key={id} />
			))}
		</div>
}
