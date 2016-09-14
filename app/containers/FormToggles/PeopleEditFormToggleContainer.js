import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as itemsFormActionCreators from 'redux/modules/peopleEditForm'
import { PeopleEditFormToggle } from 'components'

const PeopleEditFormToggleContainer = React.createClass({
	propTypes: {
		person: PropTypes.object.isRequired,
		initiatePeopleEditForm: PropTypes.func.isRequired,
	},
	handleOpenEditForm () {
		this.props.initiatePeopleEditForm(this.props.person.personId)
	},
	render () {
		return (
			<PeopleEditFormToggle handleOpenEditForm={this.handleOpenEditForm} person={this.props.person}/>
		)
	},
})

function mapDispatchToProps (dispatch) {
	return bindActionCreators(itemsFormActionCreators, dispatch)
}

export default connect((() => {})(), mapDispatchToProps)(PeopleEditFormToggleContainer)
