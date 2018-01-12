import * as React from 'react';

import * as propz from "propz";

import { Map } from 'module/ui/map/map2';

const Style = require('styles/ui/b_club_participation_message.scss');
const InviteStyles	= require('styles/pages/events/b_invite.scss');
const Bootstrap = require('styles/ui/b_club_participation_message.scss');

interface ClubParticipationMessageVenueModel {
	postcodeId: string,
	point: object
}

export interface ClubParticipationMessageVenueProps {
	venue: ClubParticipationMessageVenueModel
}

export class ClubParticipationMessageVenue extends React.Component<ClubParticipationMessageVenueProps, {}> {
	render() {
		const postcodeId = propz.get(this.props.venue, ['postcodeId'], undefined);
		const point = propz.get(this.props.venue, ['point'], undefined);

		const venueArea = typeof postcodeId !== 'undefined' ?
			<Map point={point} /> :
			<span className="eInvite_venue">Venue to be defined</span>;

		return (
			<div className="eInvite_map">{venueArea}</div>
		);
	}
}