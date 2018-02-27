
export enum USER_TYPE {
	'PARENT' = 'PARENT',
	'STUDENT' =	'STUDENT'
}

export enum MESSAGE_KIND {
	'CLUB_PARTICIPANT_INVITE' = 'ClubParticipantInviteMessage',
	'INVITATION' = 'EventInvitationMessage',
	'REFUSAL' = 'EventParticipationRefusalMessage',
	'AVAILABILITY' = 'EventParticipationMessage'
}

export enum MESSAGE_TYPE {
	'INBOX' = 'INBOX',
	'OUTBOX' = 'OUTBOX',
	'ARCHIVE' = 'ARCHIVE'
}

export enum MESSAGE_READ_STATUS {
	'READ' = 'READ',
	'NOT_READ' = 'NOT_READ'
}

export enum MESSAGE_INVITATION_STATUS {
	'ACCEPTED' = 'ACCEPTED',
	'REJECTED' = 'REJECTED',
	'NOT_READY' = 'NOT_READY',
	'CANCELED' = 'CANCELED'
}

export enum MESSAGE_INVITATION_STATUS_MAP {
	'NOT_SEND' = 'Not sent',
	'ACCEPTED' = 'Accepted',
	'REJECTED' = 'Declined',
	'NOT_READY' = 'Pending',
	'GOT_IT' = 'Got it'
}

export enum MESSAGE_INVITATION_ACTION_TYPE {
	'ACCEPT' = 'ACCEPT',
	'DECLINE' = 'DECLINE',
	'GOT_IT' = 'GOT_IT'
}