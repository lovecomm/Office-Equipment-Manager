import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ItemsForm } from 'components'
import * as itemsFormActionCreators from 'redux/modules/itemsForm'
import { setAndHandlePeopleListener } from 'redux/modules/feed'

const ItemsFormContainer = React.createClass({
	propTypes: {
		setAndHandlePeopleListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandlePeopleListener()
	},
	render () {
		return (
			<ItemsForm {...this.props} />
		)
	},
})

function mapStateToProps ({itemsForm}, props) {
	function disableSubmit () {
		// if (items.firstNameText.length <= 0 ||
		// 	items.lastNameText.length <= 0 ||
		// 	items.emailText.length <= 0 ||
		// 	// testing to see if no photo has been selected is empty
		// 	Object.keys(items.photo).length === 0 && items.photo.constructor === Object
		// ) {
		// 	return true
		// } else {
		return false
		// }
	}
	return {
		isOpen: itemsForm.isOpen,
		purchasedAtDate: itemsForm.purchasedAtDate,
		itemId: itemsForm.itemId,
		itemPersonId: itemsForm.itemPersonId,
		itemHardwareId: itemsForm.itemHardwareId,
		notes: itemsForm.notes,
		photos: itemsForm.photos,
		photoNames: itemsForm.photoNames,
		isSubmitDisabled: disableSubmit(),
	}
}

const dispatchedItems = {
	...itemsFormActionCreators,
	setAndHandlePeopleListener,
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(dispatchedItems, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsFormContainer)
