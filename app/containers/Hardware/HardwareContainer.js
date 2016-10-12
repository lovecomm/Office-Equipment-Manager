import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Hardware } from 'components'
import { bindActionCreators } from 'redux'
import * as hardwareActionCreators from 'redux/modules/hardwares'

const HardwareContainer = React.createClass({
	propTypes: {
		hardwareId: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		handleHardwareCollapsed: PropTypes.func.isRequired,
	},
	envokeHandleCollapsed () {
		const newCollapse = !this.props.collapsed
		this.props.handleHardwareCollapsed(this.props.hardwareId, newCollapse)
	},
	render () {
		return (
			<Hardware
				{...this.props}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({items, hardwares, people}, props) {
	// not all items are used at once, so this needs to get only the items on the feed.itemIds
	let hardwaresItems = {}
	let itemIds = []
	Object.keys(items).forEach((itemId) => {
		if (items[itemId].hardwareId === props.hardwareId) {
			const itemsPerson = people[items[itemId].personId]
			const itemsWithPeople = Object.assign(items[itemId], {person: itemsPerson})
			hardwaresItems = Object.assign(hardwaresItems, {[itemId]: itemsWithPeople})
			itemIds.push(itemId)
		}
	})
	const hardware = hardwares[props.hardwareId]
	return {
		hardwareId: hardware.hardwareId,
		make: hardware.make,
		model: hardware.model,
		collapsed: hardware.collapsed,
		items: hardwaresItems,
		itemIds,
		photoUrl: hardware.photo.url,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(hardwareActionCreators, dispatch)
)(HardwareContainer)
