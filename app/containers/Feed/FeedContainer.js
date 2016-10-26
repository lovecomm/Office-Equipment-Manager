import React, { PropTypes } from 'react'
import { Feed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const FeedContainer = React.createClass({
	propTypes: {
		route: PropTypes.object.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<Feed {...this.props} activeCards={this.props.route.activeCards}/>
		)
	},
})

function mapStateToProps ({feed, peopleFeed}) {
	const { isFetching, error, itemIds, hardwareIds, activeView } = feed
	return {
		isFetching,
		error,
		itemIds,
		personIds: peopleFeed.feedIds,
		hardwareIds,
		activeView,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(FeedContainer)
