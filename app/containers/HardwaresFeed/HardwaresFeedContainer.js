import React, { PropTypes } from 'react'
import { HardwaresFeed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwaresFeedActionCreators from 'redux/modules/hardwaresFeed'
import { setAndHandleFeedListener } from 'redux/modules/feed'

const HardwaresFeedContainer = React.createClass({
	propTypes: {
		hardwares: PropTypes.object.isRequired,
		feedIds: PropTypes.array.isRequired,
		isFetching: PropTypes.bool.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<HardwaresFeed
				hardwares={this.props.hardwares}
				feedIds={this.props.feedIds}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({hardwaresFeed, feed}) {
	return {
		feedIds: hardwaresFeed.feedIds,
		hardwares: hardwaresFeed.hardwares,
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
