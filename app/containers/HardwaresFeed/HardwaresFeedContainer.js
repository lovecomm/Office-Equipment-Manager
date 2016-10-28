import React, { PropTypes } from 'react'
import { HardwaresFeed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwaresFeedActionCreators from 'redux/modules/hardwaresFeed'
import { setAndHandleFeedListener } from 'redux/modules/feed'

const HardwaresFeedContainer = React.createClass({
	propTypes: {
		hardwaresFeed: PropTypes.object.isRequired,
		isFetching: PropTypes.bool.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<HardwaresFeed
				hardwaresFeed={this.props.hardwaresFeed}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({hardwaresFeed, feed}) {
	return {
		isFetching: feed.isFetching,
		hardwaresFeed: hardwaresFeed,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators({
		...hardwaresFeedActionCreators,
		setAndHandleFeedListener: setAndHandleFeedListener},
	dispatch)
)(HardwaresFeedContainer)
