import React, { PropTypes } from 'react'
import { ImportData } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as importActionCreators from 'redux/modules/importData'

const ImportDataContainer = React.createClass({
	propTypes: {
		formIsShowing: PropTypes.bool.isRequired,
	},
	render () {
		if (this.props.formIsShowing) {
			return (
				<ImportData />
			)
		} else {
			return <span></span>
		}
	},
})

function mapStateToProps ({importData}) {
	return {
		formIsShowing: importData.formIsShowing,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(importActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportDataContainer)
