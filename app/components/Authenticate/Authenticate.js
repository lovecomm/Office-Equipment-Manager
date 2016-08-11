import React, { PropTypes } from 'react'
import { TextField, RaisedButton } from 'material-ui'
import { container, title, button } from './styles.css'

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
					hintText='Password Field'
					floatingLabelText='Password'
					type='password' />
				<br />
				<RaisedButton label='Submit' primary={true} className={button} />
			</form>
			{error ? <p style={{color: palette.primaryDanger}}>{error}</p> : null}
		</div>
	)
}
