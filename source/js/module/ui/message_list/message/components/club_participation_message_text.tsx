import * as React from 'react';
import * as ClubsConst from 'module/helpers/consts/clubs';
import { DateHelper } from 'module/helpers/date_helper';
import * as propz from "propz";

const InviteStyles = require('styles/pages/events/b_invite.scss');

export interface ClubParticipationMessageTextProps {
	message: any
}

export class ClubParticipationMessageText extends React.Component<ClubParticipationMessageTextProps, {}> {
	getFullName() {
		const firstName = propz.get(this.props.message, ['playerDetailsData', 'firstName'], undefined);
		const lastName = propz.get(this.props.message, ['playerDetailsData', 'lastName'], undefined);

		return `${firstName}  ${lastName}`;
	}

	render() {
		return (
			<div className='eClubParticipationMessage_text'>
				<h4>
					To reserve a place for {this.getFullName()}, click the 'Book now' below button
				</h4>
			</div>
		);
	}
}