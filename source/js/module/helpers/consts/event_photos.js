const ACCESS_PRESETS_SERVER_VALUE = {
	'PUBLIC'				: 'PUBLIC',
	'PRIVATE'				: 'PRIVATE',
	'PARTICIPANT_PARENTS'	: 'PARTICIPANT_PARENTS'
};

const ACCESS_PRESETS_SERVER_VALUE_TO_CLIENT_VALUE = {
	'PUBLIC'				: 'public',
	'PRIVATE'				: 'private',
	'PARTICIPANT_PARENTS'	: 'participant parents'
};

const ACCESS_PRESETS_CLIENT_VALUE_TO_SERVER_VALUE = {
	'public'				: 'PUBLIC',
	'private'				: 'PRIVATE',
	'participant parents'	: 'PARTICIPANT_PARENTS'
};

module.exports.ACCESS_PRESETS_SERVER_VALUE					= ACCESS_PRESETS_SERVER_VALUE;
module.exports.ACCESS_PRESETS_SERVER_VALUE_TO_CLIENT_VALUE	= ACCESS_PRESETS_SERVER_VALUE_TO_CLIENT_VALUE;
module.exports.ACCESS_PRESETS_CLIENT_VALUE_TO_SERVER_VALUE	= ACCESS_PRESETS_CLIENT_VALUE_TO_SERVER_VALUE;