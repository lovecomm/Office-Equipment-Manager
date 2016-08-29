import React, { PropTypes } from 'react'
import { Button } from 'react-toolbox/lib'
import { button } from './styles.css'

AuthButton.propTypes = {
	isFetching: PropTypes.bool.isRequired,
}

export default function AuthButton ({ isFetching }) {
	return (
		<Button
			label={isFetching === true
					? 'Loading'
					: 'Submit'}
			primary={true}
			ripple={true}
			floating={true}
			className={button}
			type='submit' />
	)
}
