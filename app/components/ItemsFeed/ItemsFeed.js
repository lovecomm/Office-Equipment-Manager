import React, { PropTypes } from 'react'
import { ItemFormToggleContainer, ItemContainer, ItemsFilterContainer, ItemsSortMenuContainer } from 'containers'
import { ActionBar } from 'components'
import { list } from 'sharedStyles/layout'

ItemsFeed.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	items: PropTypes.object.isRequired,
	feedIds: PropTypes.array.isRequired,
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
					return props.feedIds.map((id) => {
						const item = props.items[id]
						if (item) {
							return (<ItemContainer
									item={item}
									itemId={id}
									key={id} />)
						}
					})
				})()}
			</div>
		</div>
}
