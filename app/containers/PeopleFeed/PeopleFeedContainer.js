import React, { PropTypes } from 'react'
import { PeopleFeed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleFeedActionCreators from 'redux/modules/peopleFeed'
import { setAndHandleFeedListener } from 'redux/modules/feed'

const PeopleFeedContainer = React.createClass({
	propTypes: {
		peopleFeed: PropTypes.object.isRequired,
		isFetching: PropTypes.bool.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<PeopleFeed
				peopleFeed={this.props.peopleFeed}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({peopleFeed, feed}) {
	return {
		isFetching: feed.isFetching,
		peopleFeed: peopleFeed,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators({
		...peopleFeedActionCreators,
		setAndHandleFeedListener: setAndHandleFeedListener},
	dispatch)
)(PeopleFeedContainer)
