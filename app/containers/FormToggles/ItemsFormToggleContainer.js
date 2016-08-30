import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFormActionCreators from 'redux/modules/itemsForm'
import { ItemsFormToggle } from 'components'

function mapStateToProps ({items}) {
	return {
		openItemsForm: items.openItemsForm,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsFormActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsFormToggle)
