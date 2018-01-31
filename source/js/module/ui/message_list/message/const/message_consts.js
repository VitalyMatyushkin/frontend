const USER_TYPE = {
	'PARENT':	'PARENT',
	'STUDENT':	'STUDENT'
};

const MESSAGE_KIND = {
	'CLUB_PARTICIPANT_INVITE':	'ClubParticipantInviteMessage',
	'INVITATION':				'EventInvitationMessage',
	'REFUSAL':					'EventParticipationRefusalMessage',
	'AVAILABILITY':				'EventParticipationMessage'
};

const MESSAGE_TYPE = {
	'INBOX':	'INBOX',
	'OUTBOX':	'OUTBOX',
	'ARCHIVE':	'ARCHIVE'
};

const MESSAGE_READ_STATUS = {
	'READ':		'READ',
	'NOT_READ':	'NOT_READ'
};

const MESSAGE_INVITATION_STATUS = {
	'ACCEPTED':		'ACCEPTED',
	'REJECTED':		'REJECTED',
	'NOT_READY':	'NOT_READY',
	'CANCELED':		'CANCELED'
};

const MESSAGE_INVITATION_STATUS_MAP = {
	'NOT_SEND':     'Not sent',
	'ACCEPTED':		'Accepted',
	'REJECTED':		'Declined',
	'NOT_READY':	'Pending',
	'GOT_IT':		'Got it'
};

const MESSAGE_INVITATION_ACTION_TYPE = {
	'ACCEPT':	'ACCEPT',
	'DECLINE':	'DECLINE',
	'GOT_IT':	'GOT_IT'
};

module.exports.USER_TYPE						= USER_TYPE;
module.exports.MESSAGE_KIND						= MESSAGE_KIND;
module.exports.MESSAGE_TYPE						= MESSAGE_TYPE;
module.exports.MESSAGE_READ_STATUS				= MESSAGE_READ_STATUS;
module.exports.MESSAGE_INVITATION_STATUS		= MESSAGE_INVITATION_STATUS;
module.exports.MESSAGE_INVITATION_ACTION_TYPE	= MESSAGE_INVITATION_ACTION_TYPE;
module.exports.MESSAGE_INVITATION_STATUS_MAP	= MESSAGE_INVITATION_STATUS_MAP;