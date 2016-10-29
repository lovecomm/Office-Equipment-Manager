import React, { PropTypes } from 'react'
import { Navigation } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const NavigationContainer = React.createClass({
	propTypes: {
		isAuthed: PropTypes.bool.isRequired,
	},
	render () {
		return (
			<Navigation {...this.props} />
		)
	},
})

function mapStateToProps ({feed}) {
	const { isFetching, error, itemIds, filter, activeView } = feed
	return {
		isFetching,
		error,
		itemIds,
		filter,
		activeView,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(NavigationContainer)
