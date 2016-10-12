import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Person } from 'components'
import { bindActionCreators } from 'redux'
import * as personActionCreators from 'redux/modules/people'

const PersonContainer = React.createClass({
	propTypes: {
		personId: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		handleCollapsed: PropTypes.func.isRequired,
	},
	envokeHandleCollapsed () {
		const newCollapse = !this.props.collapsed
		this.props.handleCollapsed(this.props.personId, newCollapse)
	},
	render () {
		return (
			<Person
				{...this.props}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({people, items, hardwares}, props) {
	// not all items are used at once, so this needs to get only the items on the feed.itemIds
	let personsItems = {}
	let itemIds = []
	Object.keys(items).forEach((itemId) => {
		if (items[itemId].personId === props.personId) {
			const itemsHardware = hardwares[items[itemId].hardwareId]
			const itemWithHardware = Object.assign(items[itemId], {hardware: itemsHardware})
			personsItems = Object.assign(personsItems, {[itemId]: itemWithHardware})
			itemIds.push(itemId)
		}
	})
	const person = people[props.personId]
	return {
		personId: person.personId,
		firstName: person.firstName,
		lastName: person.lastName,
		collapsed: person.collapsed,
		items: personsItems,
		itemIds,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(personActionCreators, dispatch)
)(PersonContainer)
