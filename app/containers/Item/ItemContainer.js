import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Item } from 'components'

const ItemsContainer = React.createClass({
	propTypes: {
		item: PropTypes.object.isRequired,
	},
	render () {
		return (
			<Item {...this.props}/>
		)
	},
})

function mapStateToProps ({items}, props) {
	return {
		item: items[props.itemId],
	}
}

export default connect(mapStateToProps)(ItemsContainer)
