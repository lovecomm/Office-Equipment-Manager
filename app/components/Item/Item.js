import React, { PropTypes } from 'react'
import { FontIcon } from 'react-toolbox/lib'
import { Card, CardMedia, CardTitle, CardText } from 'react-toolbox/lib/card'
import { statusWarning, statusReplace, status, chips, gear, fullWidthPhoto} from './styles.scss'

Item.propTypes = {
	itemPerson: PropTypes.object.isRequired,
	serial: PropTypes.string.isRequired,
	itemHardware: PropTypes.object.isRequired,
	hasSubContent: PropTypes.bool.isRequired,
	notes: PropTypes.string.isRequired,
	photo: PropTypes.object,
	collapsed: PropTypes.bool.isRequired,
	getYearsOld: PropTypes.string.isRequired,
	envokeHandleCollapsed: PropTypes.func.isRequired,
	cardClass: PropTypes.string.isRequired,
}

export default function Item (props) {
	return (
		<Card style={{width: '250px'}} className={props.cardClass} onClick={props.envokeHandleCollapsed}>
			<FontIcon value='settings' className={gear}/>
			<CardTitle
				avatar={props.itemHardware.photo.url}
				title={props.serial}
				subtitle={(() => `${props.itemHardware.make} ${props.itemHardware.model}`)()}/>
			<CardText className={chips}>
				<span>{(() => `${props.itemPerson.firstName} ${props.itemPerson.lastName}`)()}</span>
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
			{props.hasSubContent && !props.collapsed
				? <div>
						{props.photo
						? <CardMedia
								aspectRatio='wide'
								className={fullWidthPhoto}
								image={props.photo.url}/>
						: ''}
						<CardText>
							{props.itemHardware.description
								? <div><h4>Hardware Description:</h4><p>{props.itemHardware.description}</p></div>
								: ''}
							{props.notes
								? <div><h4>Item Note:</h4><p>{props.notes}</p></div>
								: ''}
						</CardText>
					</div>
				: ''}
		</Card>
	)
}
