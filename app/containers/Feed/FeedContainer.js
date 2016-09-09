import React, { PropTypes } from 'react'
import { Feed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as feedActionCreators from 'redux/modules/feed'

const FeedContainer = React.createClass({
	propTypes: {
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<Feed {...this.props} />
		)
	},
})

function mapStateToProps ({feed}) {
	const { isFetching, error, itemIds, filter } = feed
	return {
		isFetching,
		error,
		itemIds,
		filter,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(feedActionCreators, dispatch)
)(FeedContainer)
