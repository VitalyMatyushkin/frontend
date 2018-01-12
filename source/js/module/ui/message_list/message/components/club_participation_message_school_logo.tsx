import * as React from 'react';

import * as MessageHelper from "module/ui/message_list/message/helpers/message_helper";
import * as propz from "propz";

const Style = require('styles/ui/b_club_participation_message.scss');

export interface ClubParticipationMessageSchoolLogoProps {
	message: object
}

export function ClubParticipationMessageSchoolLogo(props: ClubParticipationMessageSchoolLogoProps) {
	let schoolLogoStyle = {
		backgroundImage: `url(/images/no_logo.jpg)`
	};

	const school = MessageHelper.getSchool(props.message);

	const pic = propz.get(school, ['pic'], undefined);
	if(typeof pic !== 'undefined'){
		schoolLogoStyle.backgroundImage = `url(${pic})`;
	}

	return (
		<div className="eClubParticipationMessage_headerImg" style={schoolLogoStyle}/>
	);
}