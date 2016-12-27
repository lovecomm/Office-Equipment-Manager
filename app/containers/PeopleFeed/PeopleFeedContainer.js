import React, { PropTypes } from 'react'
import { PeopleFeed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleFeedActionCreators from 'redux/modules/peopleFeed'
import { setAndHandleFeedListener } from 'redux/modules/feed'

const PeopleFeedContainer = React.createClass({
	propTypes: {
		feedIds: PropTypes.array.isRequired,
		isFetching: PropTypes.bool.isRequired,
		people: PropTypes.object.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<PeopleFeed
				feedIds={this.props.feedIds}
				people={this.props.people}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({peopleFeed, feed}) {
	return {
		isFetching: feed.isFetching,
		feedIds: peopleFeed.feedIds,
		people: peopleFeed.people,
		peopleFeed: peopleFeed
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators({
		...peopleFeedActionCreators,
		setAndHandleFeedListener: setAndHandleFeedListener},
	dispatch)
)(PeopleFeedContainer)
