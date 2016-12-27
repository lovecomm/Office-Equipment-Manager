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
		this.attachRelatedData()
	},
	componentWillReceiveProps () {
		this.attachRelatedData()
	},
	attachRelatedData () {
		const items = this.props.items
		const	hardwares = this.props.hardwares
		this.personsItems = {}
		this.personItemIds = []
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

function mapStateToProps ({peopleFeed, itemsFeed, hardwaresFeed}, props) {
	// let person = peopleFeed.people[props.personId]
	return {
		personId: props.person.personId,
		firstName: props.person.firstName,
		lastName: props.person.lastName,
		collapsed: props.person.collapsed,
		photoUrl: props.person.photo.url,
		items: itemsFeed.items,
		hardwares: hardwaresFeed.hardwares,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(personActionCreators, dispatch)
)(PersonContainer)
