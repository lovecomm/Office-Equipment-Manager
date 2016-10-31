import React, { PropTypes } from 'react'
import { PeopleFilter } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as peopleFeedActionCreators from 'redux/modules/peopleFeed'

const PeopleFilterContainer = React.createClass({
	propTypes: {
		isFiltering: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		options: PropTypes.object.isRequired,
		disableIsFilteringPeople: PropTypes.func.isRequired,
		updateAndHandlePeopleFilter: PropTypes.func.isRequired,
		setFilterOptions: PropTypes.func.isRequired,
	},
	filterOptions (e) {
		let newInputLength = e.nativeEvent.target.value.length
		newInputLength >= 1 ? this.props.setFilterOptions(true) : this.props.setFilterOptions(false)
	},
	render () {
		return (
			<PeopleFilter
				isFiltering={this.props.isFiltering}
				name={this.props.name}
				options={this.props.options}
				disableIsFilteringPeople={this.props.disableIsFilteringPeople}
				updateAndHandlePeopleFilter={this.props.updateAndHandlePeopleFilter}
				filterOptions={this.filterOptions}/>
		)
	},
})

function mapStateToProps ({peopleFeed}) {
	return {
		...peopleFeed.filter,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(peopleFeedActionCreators, dispatch)
)(PeopleFilterContainer)
