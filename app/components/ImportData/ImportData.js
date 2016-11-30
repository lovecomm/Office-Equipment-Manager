import React from 'react'
import { Button, Snackbar } from 'react-toolbox'
import { button, imageInput, snackBarContentWrapper } from './styles.scss'

export default function ImportData (props) {
	return (
		<Snackbar
			active={true}
      action='Import'
      onClick={() => console.log('clicked')}
      type='accept'>
			<div className={snackBarContentWrapper}>
				<div className={button}>
					<Button raised={true} label='Select .csv file' primary={true}></Button>
					<input type='file' required={true} className={imageInput} onChange={(e) => console.log(e.target.files[0])}/>
				</div>
				<span>{'Filename goes here'}</span>
			</div>
		</Snackbar>
  )
}
//props.updateHardwareFormPhoto(e.target.files[0])
