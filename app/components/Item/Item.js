import React, { PropTypes } from 'react'
import { FontIcon } from 'react-toolbox/lib'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { statusWarning, statusReplace, status, card, chips, nameChip, gear, notEmptyExpansion, emptyExpansion } from './styles.scss'

Item.propTypes = {
	itemPerson: PropTypes.object.isRequired,
	serial: PropTypes.string.isRequired,
	itemHardware: PropTypes.object.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object,
	collapsed: PropTypes.bool.isRequired,
	getYearsOld: PropTypes.string.isRequired,
	envokeHandleCollapsed: PropTypes.func.isRequired,
}

export default function Item (props) {
	return (
		<Card style={{width: '250px', maxWidth: '100%'}} className={card} onClick={props.envokeHandleCollapsed}>
			<FontIcon value='settings' className={gear}/>
			<CardTitle
				avatar={props.itemHardware.photo.url}
				title={props.serial}
				subtitle={(() => props.itemHardware.isComputer ? `${props.itemHardware.model}` : `${props.itemHardware.make} ${props.itemHardware.model}`)()}/>
			<CardText className={chips}>
				<span className={nameChip}>{(() => `${props.itemPerson.firstName} ${props.itemPerson.lastName}`)()}</span>
				<div className={status}>
					{(() => {
						// Calculating Item's age
						if (props.getYearsOld === '0') {
							return (<span>{'< '}{1}{' year old'}</span>)
						} else if (props.getYearsOld === '1') {
							return (<span>{props.getYearsOld}{' year old'}</span>)
						} else if (props.getYearsOld >= '3' && props.getYearsOld < '5' && props.itemHardware.isComputer) {
							return (<span className={statusWarning}>{props.getYearsOld}{' years old!'}</span>)
						} else if (props.getYearsOld >= '5' && props.itemHardware.isComputer) {
							return (<span className={statusReplace}>{props.getYearsOld}{' years old!'}</span>)
						} else {
							return (<span>{props.getYearsOld}{' years old'}</span>)
						}
					})()}
				</div>
			</CardText>
			{!props.collapsed
				? <CardText>
						{props.itemHardware.description
							? <p><strong>Hardware Description:</strong><br />{props.itemHardware.description}</p>
							: ''}
						{props.notes
							? <p><strong>Item Notes:</strong><br />{props.notes}</p>
							: ''}
					</CardText>
				: ''}
		</Card>
	)
}

// notes
// item photo
// make – computers-only
// hardware description
// person email
