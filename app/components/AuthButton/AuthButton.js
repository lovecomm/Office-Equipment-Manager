import React, { PropTypes } from 'react'
import { RaisedButton } from 'material-ui'
import { button } from './styles.css'

AuthButton.propTypes = {
	isFetching: PropTypes.bool.isRequired,
}

export default function AuthButton ({ isFetching }) {
	return (
		<RaisedButton
			label={isFetching === true
					? 'Loading'
					: 'Submit'}
			primary={true}
			className={button}
			type='submit' />
	)
}
