import React, { PropTypes } from 'react'
import { RaisedButton } from 'material-ui'
import { button } from './styles.css'

AuthButton.propTypes = {
	onAuth: PropTypes.func.isRequired,
	isFetching: PropTypes.bool.isRequired,
}

export default function AuthButton ({ isFetching, onAuth }) {
	return (
		<RaisedButton
			label={isFetching === true
					? 'Loading'
					: 'Submit'}
			primary={true}
			className={button}
			onClick={onAuth} />
	)
}
