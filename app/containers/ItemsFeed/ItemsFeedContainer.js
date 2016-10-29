import React, { PropTypes } from 'react'
import { ItemsFeed } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFeedActionCreators from 'redux/modules/itemsFeed'
import { setAndHandleFeedListener } from 'redux/modules/feed'

const ItemsFeedContainer = React.createClass({
	propTypes: {
		itemsFeed: PropTypes.object.isRequired,
		isFetching: PropTypes.bool.isRequired,
		setAndHandleFeedListener: PropTypes.func.isRequired,
	},
	componentDidMount () {
		this.props.setAndHandleFeedListener()
	},
	render () {
		return (
			<ItemsFeed
				itemsFeed={this.props.itemsFeed}
				isFetching={this.props.isFetching}/>
		)
	},
})

function mapStateToProps ({itemsFeed, feed}) {
	return {
		isFetching: feed.isFetching,
		itemsFeed: itemsFeed,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators({
		...itemsFeedActionCreators,
		setAndHandleFeedListener: setAndHandleFeedListener},
	dispatch)
)(ItemsFeedContainer)
