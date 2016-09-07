import React, { PropTypes } from 'react'
import { Avatar, IconButton, Chip, Button } from 'react-toolbox/lib'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { item, edit, name, hardware, leftSide, avatar, small, col1, statusWarning, statusReplace, status, card, chips, nameChip } from './styles.scss'

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
				subtitle={(() => `${hardware.model}`)()}/>
			{
				// photo !== undefined
				// ? <CardMedia
				// 	aspectRatio='wide'
				// 	image={photo}/>
				// : ''
			}
			<CardTitle
				title='Title goes here'
				subtitle='Subtitle here'/>
			<CardText className={chips}>
				<Chip className={nameChip}><span>{person.firstName} {person.lastName}</span></Chip>
				<div className={status}>
					{(() => {
						// Calculating Item's status
						if (getYearsOld === '0') { return (<Chip><span>{'< '}{1}{' year old'}</span></Chip>) }
						else if (getYearsOld === '1') { return (<Chip><span>{getYearsOld}{' year old'}</span></Chip>) }
						else if (getYearsOld >= '3' && getYearsOld < '5' && hardware.isComputer) { return (<Chip className={statusWarning}><span>{getYearsOld}{' years old!'}</span></Chip>) }
						else if (getYearsOld >= '5' && hardware.isComputer) { return (<Chip className={statusReplace}><span>{getYearsOld}{' years old!'}</span></Chip>) }
						else { return (<Chip><span>{getYearsOld}{' years old'}</span></Chip>) }
					})()}
				</div>
			</CardText>
			<CardActions>
				<Button label='Expand' />
				<Button label='Edit' />
			</CardActions>
		</Card>
	)
	// return (
	// 	<li className={item} onClick={handleCollapsed}>
	// 		<div className={leftSide}>
	// 			<div className={col1}>
	// 				<Avatar className={avatar}><img src={hardware.photo.url} /></Avatar>
	//
	// 			</div>
	// 			<div>
	// 				<span className={small}>{'#'}{serial}</span>
	// 				<br />
	// 				<span className={hardware}>{hardware.make} {hardware.model}</span>
	// 				<br />
	// 				<div>
	// 					<span className={small}>{purchasedAtDate}</span>
	// 					<br />
	// 					<div className={status}>
	// 						{(() => {
	// 							// Calculating Item's status
	// 							if (hardware.isComputer === true) {
	// 								if (getYearsOld >= '5') {
	// 									return (<span className={statusReplace}>This computer was purchased more than {getYearsOld} years ago. It needs to be replaced!</span>)
	// 								} else if (getYearsOld >= '3') {
	// 									return (<span className={statusWarning}>This computer was purchased more than {getYearsOld} years ago. You should think about replacing it soon.</span>)
	// 								} else if (getYearsOld >= '1') {
	// 									return (<span className={small}>This computer was purchased more than {getYearsOld} year(s) ago.</span>)
	// 								} else {
	// 									return (<span className={small}>This computer was purchased less than a year ago.</span>)
	// 								}
	// 							} else if (getYearsOld >= '1') {
	// 								return (<span className={small}>This item was purchased more than {getYearsOld} year(s) ago.</span>)
	// 							} else {
	// 								return (<span className={small}>This item was purchased less than a year ago.</span>)
	// 							}
	// 						})()}
	// 					</div>					</div>
	// 			</div>
	// 		</div>
	// 		<IconButton icon='edit' className={edit} />
	// 	</li>
	// )
}
