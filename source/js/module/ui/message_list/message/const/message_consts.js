const MESSAGE_KIND = {
	'INVITATION':	'INVITATION',
	'REFUSAL':		'REFUSAL'
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

const MESSAGE_INVITATION_ACTION_TYPE = {
	'ACCEPT':	'ACCEPT',
	'DECLINE':	'DECLINE',
	'GOT_IT':	'GOT_IT'
};

module.exports.MESSAGE_KIND						= MESSAGE_KIND;
module.exports.MESSAGE_TYPE						= MESSAGE_TYPE;
module.exports.MESSAGE_READ_STATUS				= MESSAGE_READ_STATUS;
module.exports.MESSAGE_INVITATION_STATUS		= MESSAGE_INVITATION_STATUS;
module.exports.MESSAGE_INVITATION_ACTION_TYPE	= MESSAGE_INVITATION_ACTION_TYPE;