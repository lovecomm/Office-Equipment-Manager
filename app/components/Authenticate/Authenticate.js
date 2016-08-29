import React, { PropTypes } from 'react'
import { container, title } from './styles.css'
import { AuthButton } from 'components'
import { Input } from 'react-toolbox/lib';

Authenticate.propTypes = {
	error: PropTypes.string.isRequired,
	isFetching: PropTypes.bool.isRequired,
	onAuth: PropTypes.func.isRequired,
	handleFormData: PropTypes.func.isRequired,
}

export default function Authenticate ({error, isFetching, onAuth, handleFormData}) {
	return (
		<div className={container} style={{
			// backgroundColor: palette.primary3Color,
			// color: palette.primaryBlack,
		}}>
			<div className={title}>Please Sign In</div>
			<br />
			<form style={{textAlign: 'center'}} onChange={handleFormData} onSubmit={onAuth}>
				<Input
					type='email'
					label='Email'
					name='email'
					required={true}
					floating={true}/>
				<Input
					type='password'
					name='password'
					label='Password'
					required={true}
					floating={true}/>
				<br />
				<AuthButton isFetching={isFetching} />
			</form>
			{error ? <p style={{
				// color: palette.primaryDanger
			}}>{error}</p> : null}
		</div>
	)
}
