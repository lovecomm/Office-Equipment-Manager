import React, { PropTypes } from 'react'
import { Navigation } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'
import * as importActionCreators from 'redux/modules/importData'

const NavigationContainer = React.createClass({
	propTypes: {
		isAuthed: PropTypes.bool.isRequired,
	},
	render () {
		return (
			<Navigation
				{...this.props}/>
		)
	},
})

function mapStateToProps ({feed, routing, importData}) {
	return {
		isFetching: feed.isFetching,
		error: feed.error,
		activePath: routing.locationBeforeTransitions.pathname,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators({...feedActionCreators, ...importActionCreators}, dispatch)
)(NavigationContainer)
