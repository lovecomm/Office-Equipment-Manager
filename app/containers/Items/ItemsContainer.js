import React from 'react'
import { Items, ItemsToolbar } from 'components'

const ItemsContainer = React.createClass ({
	render () {
		return (
			<div>
				<ItemsToolbar />
				<Items />
			</div>
		)
	},
})

export default ItemsContainer
