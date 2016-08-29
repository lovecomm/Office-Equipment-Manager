import React, { PropTypes } from 'react'
import { Button } from 'react-toolbox/lib'

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
			flat={true}
			ripple={true}
			raised={true}
			type='submit' />
	)
}
