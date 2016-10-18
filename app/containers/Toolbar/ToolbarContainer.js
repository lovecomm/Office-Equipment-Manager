import React, { PropTypes } from 'react'
import { Toolbar } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const ToolbarContainer = React.createClass({
	propTypes: {
		activeCards: PropTypes.string.isRequired,
	},
	render () {
		return (
			<Toolbar {...this.props}/>
		)
	},
})

function mapStateToProps ({feed}) {
	return {
		filter: feed.filter,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(ToolbarContainer)
