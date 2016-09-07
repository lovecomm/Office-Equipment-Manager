import React, { PropTypes } from 'react'
import { Button } from 'react-toolbox/lib'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { statusWarning, statusReplace, status, card, chips, nameChip } from './styles.scss'

Item.PropTypes = {
	serial: PropTypes.string.isRequired,
	person: PropTypes.object.isRequired,
	hardware: PropTypes.object.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object,
	collapsed: PropTypes.bool.isRequired,
	purchasedAtDate: PropTypes.string.isRequired,
	getYearsOld: PropTypes.string.isRequired,
	handleCollapsed: PropTypes.func.isRequired,
}

export default function Item ({serial, hardware, person, notes, photo, purchasedAtDate, getYearsOld, handleCollapsed}) {
	console.log(handleCollapsed)
	console.log('photo', photo)
	return (
		<Card style={{width: '250px'}} className={card}>
			<CardTitle
				avatar={hardware.photo.url}
				title={(() => `#${serial}`)()}
				subtitle={(() => hardware.isComputer ? `${hardware.model}` : `${hardware.make} ${hardware.model}`)()}/>
			<CardText className={chips}>
				<span className={nameChip}>{person.firstName}{' '}{person.lastName}</span>
				<div className={status}>
					{(() => {
						// Calculating Item's status
						if (getYearsOld === '0') { return (<span>{'< '}{1}{' year old'}</span>) }
						else if (getYearsOld === '1') { return (<span>{getYearsOld}{' year old'}</span>) }
						else if (getYearsOld >= '3' && getYearsOld < '5' && hardware.isComputer) { return (<span className={statusWarning}>{getYearsOld}{' years old!'}</span>) }
						else if (getYearsOld >= '5' && hardware.isComputer) { return (<span className={statusReplace}>{getYearsOld}{' years old!'}</span>) }
						else { return (<span>{getYearsOld}{' years old'}</span>) }
					})()}
				</div>
			</CardText>
			<CardActions>
				<Button label='Expand' />
				<Button label='Edit' />
			</CardActions>
		</Card>
	)
}
