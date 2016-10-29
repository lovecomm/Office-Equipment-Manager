import React, { PropTypes } from 'react'
import { ItemFormToggleContainer, ItemContainer, ItemsFilterContainer, ItemsSortMenuContainer } from 'containers'
import { ActionBar } from 'components'
import { list } from 'sharedStyles/layout'

ItemsFeed.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	itemsFeed: PropTypes.object.isRequired,
}

export default function ItemsFeed (props) {
	return props.isFetching === true
		? <h3 style={{textAlign: 'center', marginTop: '25%'}}>{'Getting items...'}</h3>
		: <div>
			<ActionBar
				newFormToggle={<ItemFormToggleContainer editing={false} itemId='' serial='' />}
				filter={<ItemsFilterContainer />}
				sortMenu={<ItemsSortMenuContainer />}/>
			<div className={list}>
				{(() => {
					return props.itemsFeed.feedIds.map((id) => (
						<ItemContainer
							itemId={id}
							key={id} />
					))
				})()}
			</div>
		</div>
}
