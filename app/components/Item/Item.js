import React, { PropTypes } from 'react'
import { Button } from 'react-toolbox/lib'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { statusWarning, statusReplace, status, chips, fullWidthPhoto, cardActions } from 'sharedStyles/cards.scss'
import { EditMenuContainer } from 'containers'

Item.propTypes = {
	itemId: PropTypes.string.isRequired,
	serial: PropTypes.string.isRequired,
	person: PropTypes.object.isRequired,
	hardware: PropTypes.object.isRequired,
	hasSubContent: PropTypes.bool.isRequired,
	note: PropTypes.string.isRequired,
	photo: PropTypes.object,
	purchasedDate: PropTypes.string.isRequired,
	collapsed: PropTypes.bool.isRequired,
	getYearsOld: PropTypes.string.isRequired,
	envokeHandleCollapsed: PropTypes.func.isRequired,
}

export default function Item (props) {
	return (
		<Card>
			<CardTitle
				avatar={props.hardware.photo.url}
				subtitle={props.serial}
				title={(() => `${props.hardware.make} ${props.hardware.model}`)()}/>
			<CardText className={chips}>
				<span>{(() => `${props.person.firstName} ${props.person.lastName}`)()}</span>
				<div className={status}>
					{(() => {
						// Calculating Item's age
						if (props.getYearsOld === '0') {
							return (<span>{'< '}{1}{' year old'}</span>)
						} else if (props.getYearsOld === '1') {
							return (<span>{props.getYearsOld}{' year old'}</span>)
						} else if (props.getYearsOld >= '3' && props.getYearsOld < '5' && props.hardware.isComputer) {
							return (<span className={statusWarning}>{props.getYearsOld}{' years old!'}</span>)
						} else if (props.getYearsOld >= '5' && props.hardware.isComputer) {
							return (<span className={statusReplace}>{props.getYearsOld}{' years old!'}</span>)
						} else {
							return (<span>{props.getYearsOld}{' years old'}</span>)
						}
					})()}
				</div>
			</CardText>
			{props.hasSubContent && !props.collapsed
				? <div>
						{props.photo.name !== ''
						? <CardMedia
								aspectRatio='wide'
								className={fullWidthPhoto}
								image={props.photo.url}/>
						: ''}
						<CardText>
							{props.hardware.description
								? <div><h4>Hardware Description:</h4><p>{props.hardware.description}</p></div>
								: ''}
							{props.note
								? <div><h4>Item Note:</h4><p>{props.note}</p></div>
								: ''}
						</CardText>
					</div>
				: ''}
				<CardActions className={cardActions}>
					{props.hasSubContent
					? <Button label={(() => props.collapsed ? 'Show More' : 'Show Less')()} onClick={props.envokeHandleCollapsed}/>
					: ''}
					<EditMenuContainer id={props.itemId} type='item' />
				</CardActions>
		</Card>
	)
}
