import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Item } from 'components'
import { bindActionCreators } from 'redux'
import * as itemActionCreators from 'redux/modules/items'

const ItemContainer = React.createClass({
	propTypes: {
		serial: PropTypes.string.isRequired,
		hardware: PropTypes.object.isRequired,
		person: PropTypes.object.isRequired,
		note: PropTypes.string.isRequired,
		photo: PropTypes.object,
		hasSubContent: PropTypes.bool.isRequired,
		purchasedDate: PropTypes.string.isRequired,
		itemId: PropTypes.string.isRequired,
		collapsed: PropTypes.bool.isRequired,
		handleItemCollapsed: PropTypes.func.isRequired,
	},
	getYearsOld () {
		const itemDate = new Date(this.props.purchasedDate)
		const currentDate = new Date()
		const timeDiff = Math.abs(currentDate.getTime() - itemDate.getTime())
		const diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365
		return Math.floor(diffYears).toString()
	},
	envokeHandleCollapsed () {
		if (this.props.hasSubContent) {
			const newCollapse = !this.props.collapsed
			this.props.handleItemCollapsed(this.props.itemId, newCollapse)
		}
	},
	render () {
		return (
			<Item
				{...this.props}
				getYearsOld={this.getYearsOld()}
				envokeHandleCollapsed={this.envokeHandleCollapsed}/>
		)
	},
})

function mapStateToProps ({items, peopleFeed, hardwares}, props) {
	// not all items are used at once, so this needs to get only the items on the feed.itemIds
	const item = items[props.itemId]
	return {
		serial: item.serial,
		hasSubContent: item.hasSubContent,
		itemId: item.itemId,
		hardware: hardwares[item.hardwareId],
		person: peopleFeed.people[item.personId],
		note: item.note,
		photo: item.photo,
		purchasedDate: item.purchasedDate,
		collapsed: item.collapsed,
	}
}

export default connect(
	mapStateToProps,
	(dispatch) => bindActionCreators(itemActionCreators, dispatch)
)(ItemContainer)
