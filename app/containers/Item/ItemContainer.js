import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Item } from 'components'
import { bindActionCreators } from 'redux'
import * as itemActionCreators from 'redux/modules/items'

const ItemsContainer = React.createClass({
	propTypes: {
		serial: PropTypes.string.isRequired,
		itemHardware: PropTypes.object.isRequired,
		itemPerson: PropTypes.object.isRequired,
		notes: PropTypes.string.isRequired,
		photo: PropTypes.object,
		purchasedAtDate: PropTypes.string.isRequired,
		itemId: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		handleCollapsed: PropTypes.func.isRequired,
	},
	getYearsOld () {
		const itemDate = new Date(this.props.purchasedAtDate)
		const currentDate = new Date()
		const timeDiff = Math.abs(currentDate.getTime() - itemDate.getTime())
		const diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365
		return Math.floor(diffYears).toString()
	},
	envokeHandleCollapsed () {
		const newCollapse = !this.props.collapsed
		this.props.handleCollapsed(this.props.itemId, newCollapse)
	},
	expandedContentStyles () {
		if (this.props.itemHardware.description === '' && this.props.notes === '') {
			return {padding: 0}
		} else { return {} }
	},
	render () {
		return (
			<Item
				{...this.props}
				getYearsOld={this.getYearsOld()}
				expandedContentStyles={this.expandedContentStyles()}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({items, people, hardware}, props) {
	const item = items[props.itemId]
	return {
		serial: item.serial,
		itemId: item.itemId,
		itemHardware: hardware[item.itemHardwareId],
		itemPerson: people[item.itemPersonId],
		notes: item.notes,
		photo: item.photo,
		purchasedAtDate: item.purchasedAtDate,
		collapsed: item.collapsed,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(itemActionCreators, dispatch)
)(ItemsContainer)
