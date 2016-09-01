import React, { PropTypes } from 'react'
import { Feed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const FeedContainer = React.createClass({
	propTypes: {
		itemIds: PropTypes.array.isRequired,
		error: PropTypes.string.isRequired,
		isFetching: PropTypes.bool.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<Feed
				itemIds={this.props.itemIds}
				error={this.props.error}
				isFetching={this.props.isFetching} />
		)
	},
})

function mapStateToProps ({feed}) {
	const { isFetching, error, itemIds } = feed
	return {
		isFetching,
		error,
		itemIds,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(FeedContainer)
