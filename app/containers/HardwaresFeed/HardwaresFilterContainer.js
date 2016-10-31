import React, { PropTypes } from 'react'
import { HardwaresFilter } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as hardwaresFeedActionCreators from 'redux/modules/hardwaresFeed'

const HardwareFilterContainer = React.createClass({
	propTypes: {
		isFiltering: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		options: PropTypes.object.isRequired,
		disableIsFilteringHardwares: PropTypes.func.isRequired,
		updateAndHandleHardwaresFilter: PropTypes.func.isRequired,
		setFilterOptions: PropTypes.func.isRequired,
	},
	filterOptions (e) {
		let newInputLength = e.nativeEvent.target.value.length
		newInputLength >= 1 ? this.props.setFilterOptions(true) : this.props.setFilterOptions(false)
	},
	render () {
		return (
			<HardwaresFilter
				isFiltering={this.props.isFiltering}
				name={this.props.name}
				options={this.props.options}
				disableIsFilteringHardwares={this.props.disableIsFilteringHardwares}
				updateAndHandleHardwaresFilter={this.props.updateAndHandleHardwaresFilter}
				filterOptions={this.filterOptions}/>
		)
	},
})

function mapStateToProps ({hardwaresFeed}) {
	return {
		...hardwaresFeed.filter,
	}
}

export default connect(mapStateToProps,
	(dispatch) => bindActionCreators(hardwaresFeedActionCreators, dispatch)
)(HardwareFilterContainer)
