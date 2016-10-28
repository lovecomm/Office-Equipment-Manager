import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Person } from 'components'
import { bindActionCreators } from 'redux'
import * as personActionCreators from 'redux/modules/peopleFeed'

const PersonContainer = React.createClass({
	propTypes: {
		personId: PropTypes.string.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		photoUrl: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		handlePersonCollapsed: PropTypes.func.isRequired,
		items: PropTypes.object.isRequired,
		hardwares: PropTypes.object.isRequired,
	},
	componentWillMount () {
		this.personsItems = {}
		this.personItemIds = []
		const items = this.props.items
		const	hardwares = this.props.hardwares
		Object.keys(items).forEach((itemId) => {
			if (items[itemId].personId === this.props.personId) {
				const itemsHardware = hardwares[items[itemId].hardwareId]
				const itemWithHardware = Object.assign(items[itemId], {hardware: itemsHardware})
				this.personsItems = Object.assign(this.personsItems, {[itemId]: itemWithHardware})
				this.personItemIds.push(itemId)
			}
		})
	},
	envokeHandleCollapsed () {
		const newCollapse = !this.props.collapsed
		this.props.handlePersonCollapsed(this.props.personId, newCollapse)
	},
	render () {
		return (
			<Person
				personId={this.props.personId}
				firstName={this.props.firstName}
				lastName={this.props.lastName}
				photoUrl={this.props.photoUrl}
				items={this.personsItems}
				itemIds={this.personItemIds}
				collapsed={this.props.collapsed}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({peopleFeed, items, hardwares}, props) {
	const person = peopleFeed.people[props.personId]
	return {
		personId: person.personId,
		firstName: person.firstName,
		lastName: person.lastName,
		collapsed: person.collapsed,
		photoUrl: person.photo.url,
		items,
		hardwares,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(personActionCreators, dispatch)
)(PersonContainer)
