import React, { PropTypes } from 'react'
import { TextField } from 'material-ui'
import { container, title } from './styles.css'
import { AuthButton } from 'components'

Authenticate.propTypes = {
	palette: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	onAuth: PropTypes.func.isRequired,
}

export default function Authenticate ({palette, error, isFetching, onAuth}) {
	return (
		<div className={container} style={{
			backgroundColor: palette.primary3Color,
			color: palette.primaryBlack,
		}}>
			<div className={title}>Please Sign In</div>
			<br />
			<form style={{textAlign: 'center'}} >
			<TextField
				hintText='Email'
				floatingLabelText='Email' />
				<TextField
					hintText='Password'
					floatingLabelText='Password'
					type='password' />
				<br />
				<AuthButton isFetching={isFetching} onAuth={onAuth} />
			</form>
			{error ? <p style={{color: palette.primaryDanger}}>{error}</p> : null}
		</div>
	)
}
