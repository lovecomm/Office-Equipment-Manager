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
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<PeopleFeed
				feedIds={this.props.feedIds}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({peopleFeed}) {
	return {
		isFetching: peopleFeed.isFetching,
		feedIds: peopleFeed.feedIds,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators({
		...peopleFeedActionCreators,
		setAndHandleFeedListener: setAndHandleFeedListener},
	dispatch)
)(PeopleFeedContainer)
