import React, { PropTypes } from 'react'
import { TextField } from 'material-ui'
import { container, title } from './styles.css'
import { AuthButton } from 'components'

Authenticate.propTypes = {
	palette: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	onAuth: PropTypes.func.isRequired,
	handleFormData: PropTypes.func.isRequired,
}

export default function Authenticate ({palette, error, isFetching, onAuth, handleFormData}){
	return (
		<div className={container} style={{
			backgroundColor: palette.primary3Color,
			color: palette.primaryBlack,
		}}>
			<div className={title}>Please Sign In</div>
			<br />
			<form style={{textAlign: 'center'}} onChange={handleFormData} onSubmit={onAuth}>
				<TextField
					type='email'
					hintText='Email'
					name='email'
					required='true'
					floatingLabelText='Email' />
				<TextField
					type='password'
					name='password'
					hintText='Password'
					required='true'
					floatingLabelText='Password'/>
				<br />
				<AuthButton isFetching={isFetching} />
			</form>
			{error ? <p style={{color: palette.primaryDanger}}>{error}</p> : null}
		</div>
	)
}
