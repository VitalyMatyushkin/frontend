import * as React from 'react';
import {Club} from "module/models/club/club";

import 'styles/ui/b_activate_club_confirm_alert.scss';

export interface ActivateClubConfirmAlertProps {
	club: Club
	clubAcceptableUsers: any[]
}

export class ActivateClubConfirmAlert extends React.Component<ActivateClubConfirmAlertProps, {}> {
	notInTeamAcceptedUsersCount(): number {
		let notInTeamAcceptedUsersCount = 0;

		if(typeof this.props.clubAcceptableUsers !== 'undefined') {
			const acceptedUsers = this.props.clubAcceptableUsers.filter(user => user.messageStatus === 'ACCEPTED');

			const notInTeamAcceptedUsers = [];
			acceptedUsers.forEach(acceptedUser => {
				const acceptedUserIndex = this.props.club.participants.findIndex(participant =>
					participant.userId === acceptedUser.id &&
					participant.permissionId === acceptedUser.permissionId
				);

				if(acceptedUserIndex === -1) {
					notInTeamAcceptedUsers.push(acceptedUser);
				}
			});

			notInTeamAcceptedUsersCount = notInTeamAcceptedUsers.length;
		}

		return notInTeamAcceptedUsersCount;
	}
	areThereNotInTeamAcceptedUsers(): boolean {
		return this.notInTeamAcceptedUsersCount() > 0;
	}
	getTextBlock(): React.ReactNode {
		const club = this.props.club;

		let text = null;
		switch (true) {
			case club.participants.length === 0: {
				text = (
					<div className='eActivateClubConfirmAlert_textContainer mSmallText'>
						{'You’re going to activate '}
						<span className='eActivateClubConfirmAlert_boldText'>{this.props.club.name}</span>
						{' with no children.'}
					</div>
				);
				break;
			}
			case club.participants.length < club.maxParticipants && this.areThereNotInTeamAcceptedUsers(): {
				text = (
					<div className='eActivateClubConfirmAlert_textContainer mSmallText'>
						{'You have selected '}
						<span className='eActivateClubConfirmAlert_boldText'>{club.participants.length}</span>
						{' children to participate in '}
						<span className='eActivateClubConfirmAlert_boldText'>{this.props.club.name}</span>
						{'. You still have '}
						<span className='eActivateClubConfirmAlert_boldText'>{club.maxParticipants - club.participants.length}</span>
						{' places available and '}
						<span className='eActivateClubConfirmAlert_boldText'>{this.notInTeamAcceptedUsersCount()}</span>
						{' parents that confirm their children participation.'}
					</div>
				);
				break;
			}
			case club.participants.length < club.maxParticipants && !this.areThereNotInTeamAcceptedUsers(): {
				text = (
					<div className='eActivateClubConfirmAlert_textContainer mSmallText'>
						{'You have selected '}
						<span className='eActivateClubConfirmAlert_boldText'>{club.participants.length}</span>
						{' children to participate in '}
						<span className='eActivateClubConfirmAlert_boldText'>{this.props.club.name}</span>
						{'. You still have '}
						<span className='eActivateClubConfirmAlert_boldText'>{club.maxParticipants - club.participants.length}</span>
						{' places available.'}
					</div>
				);
				break;
			}
			default: {
				text = (
					<div className='eActivateClubConfirmAlert_textContainer mSmallText'>
						{'You’re going to activate '}
						<span className='eActivateClubConfirmAlert_boldText'>{this.props.club.name}</span>
						{'.'}
					</div>
				);
				break;
			}
		}

		return text;
	}
	render() {
		return (
			<div className='bActivateClubConfirmAlert'>
				<div>Are you sure?</div>
				{this.getTextBlock()}
			</div>
		);
	}
}