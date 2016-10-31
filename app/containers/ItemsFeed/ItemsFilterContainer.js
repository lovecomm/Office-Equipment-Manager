import React, { PropTypes } from 'react'
import { ItemsFilter } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFeedActionCreators from 'redux/modules/itemsFeed'

const ItemFilterContainer = React.createClass({
	propTypes: {
		isFiltering: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		options: PropTypes.object.isRequired,
		disableIsFilteringItems: PropTypes.func.isRequired,
		updateAndHandleItemsFilter: PropTypes.func.isRequired,
		setFilterOptions: PropTypes.func.isRequired,
	},
	filterOptions (e) {
		let newInputLength = e.nativeEvent.target.value.length
		newInputLength >= 1 ? this.props.setFilterOptions(true) : this.props.setFilterOptions(false)
	},
	render () {
		return (
			<ItemsFilter
				isFiltering={this.props.isFiltering}
				name={this.props.name}
				options={this.props.options}
				disableIsFilteringItems={this.props.disableIsFilteringItems}
				updateAndHandleItemsFilter={this.props.updateAndHandleItemsFilter}
				filterOptions={this.filterOptions}/>
		)
	},
})

function mapStateToProps ({itemsFeed}) {
	return {
		...itemsFeed.filter,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(itemsFeedActionCreators, dispatch)
)(ItemFilterContainer)
