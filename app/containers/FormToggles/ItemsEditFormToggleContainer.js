import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFormActionCreators from 'redux/modules/itemsEditForm'
import { ItemsEditFormToggle } from 'components'

const ItemsEditFormToggleContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string.isRequired,
		serial: PropTypes.string.isRequired,
		initiateItemsEditForm: PropTypes.func.isRequired,
	},
	handleOpenEditForm () {
		this.props.initiateItemsEditForm(this.props.itemId)
	},
	render () {
		return (
			<ItemsEditFormToggle handleOpenEditForm={this.handleOpenEditForm} serial={this.props.serial}/>
		)
	},
})

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsFormActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(ItemsEditFormToggleContainer)
