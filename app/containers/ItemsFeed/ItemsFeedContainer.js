import React, { PropTypes } from 'react'
import { ItemsFeed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFeedActionCreators from 'redux/modules/itemsFeed'
import { setAndHandleFeedListener } from 'redux/modules/feed'

const ItemsFeedContainer = React.createClass({
	propTypes: {
		items: PropTypes.object.isRequired,
		feedIds: PropTypes.array.isRequired,
		isFetching: PropTypes.bool.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<ItemsFeed
				items={this.props.items}
				feedIds={this.props.feedIds}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({itemsFeed, feed}) {
	return {
		isFetching: feed.isFetching,
		feedIds: itemsFeed.feedIds,
		items: itemsFeed.items,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators({
		...itemsFeedActionCreators,
		setAndHandleFeedListener: setAndHandleFeedListener},
	dispatch)
)(ItemsFeedContainer)
