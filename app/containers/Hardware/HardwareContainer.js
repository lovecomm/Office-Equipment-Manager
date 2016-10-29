import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Hardware } from 'components'
import { bindActionCreators } from 'redux'
import * as hardwareActionCreators from 'redux/modules/hardwaresFeed'

const HardwareContainer = React.createClass({
	propTypes: {
		hardwareId: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		make: PropTypes.string.isRequired,
		model: PropTypes.string.isRequired,
		photoUrl: PropTypes.string.isRequired,
		handleHardwareCollapsed: PropTypes.func.isRequired,
		items: PropTypes.object.isRequired,
		people: PropTypes.object.isRequired,
	},
	componentWillMount () {
		this.hardwaresItems = {}
		this.hardwareItemIds = []
		const items = this.props.items
		const people = this.props.people
		Object.keys(items).forEach((itemId) => {
			if (items[itemId].hardwareId === this.props.hardwareId) {
				const itemsPerson = people[items[itemId].personId]
				const itemsWithPeople = Object.assign(items[itemId], {person: itemsPerson})
				this.hardwaresItems = Object.assign(this.hardwaresItems, {[itemId]: itemsWithPeople})
				this.hardwareItemIds.push(itemId)
			}
		})
	},
	envokeHandleCollapsed () {
		const newCollapse = !this.props.collapsed
		this.props.handleHardwareCollapsed(this.props.hardwareId, newCollapse)
	},
	render () {
		return (
			<Hardware
				hardwareId={this.props.hardwareId}
				make={this.props.make}
				model={this.props.model}
				items={this.hardwaresItems}
				itemIds={this.hardwareItemIds}
				photoUrl={this.props.photoUrl}
				collapsed={this.props.collapsed}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({itemsFeed, hardwaresFeed, peopleFeed}, props) {
	const hardware = hardwaresFeed.hardwares[props.hardwareId]
	return {
		hardwareId: hardware.hardwareId,
		make: hardware.make,
		model: hardware.model,
		collapsed: hardware.collapsed,
		items: itemsFeed.items,
		people: peopleFeed.people,
		photoUrl: hardware.photo.url,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(hardwareActionCreators, dispatch)
)(HardwareContainer)
