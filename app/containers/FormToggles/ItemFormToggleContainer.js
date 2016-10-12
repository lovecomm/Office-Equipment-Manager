import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemFormActionCreators from 'redux/modules/itemForm'
import { ItemFormToggle } from 'components'

const ItemFormToggleContainer = React.createClass({
	propTypes: {
		itemId: PropTypes.string.isRequired,
		editing: PropTypes.bool.isRequired,
		openItemForm: PropTypes.func.isRequired,
		initiateItemForm: PropTypes.func.isRequired,
	},
	handleOpenForm () {
		if (this.props.editing === true) {
			this.props.initiateItemForm(this.props.itemId)
		} else {
			this.props.openItemForm()
		}
	},
	render () {
		return (
			<ItemFormToggle handleOpenForm={this.handleOpenForm} editing={this.props.editing}/>
		)
	},
})

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemFormActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(ItemFormToggleContainer)
