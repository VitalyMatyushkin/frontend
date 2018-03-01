const PLATFORM_CLIENT_ARRAY = [
	'Web',
	'iOS',
	'Android',
	'Other'
];

// const PLATFORM_CLIENT_ARRAY = [
// 	{
// 		id:		'IOS',
// 		value:	'iOS'
// 	},
// 	{
// 		id:		'ANDROID',
// 		value:	'Android'
// 	},
// 	{
// 		id:		'OTHER',
// 		value:	'Other'
// 	}
// ];

const PLATFORM_SERVER_TO_CLIENT_MAP = {
	'WEB':		'Web',
	'IOS':		'iOS',
	'ANDROID':	'Android',
	'OTHER':	'Other'
};

const PLATFORM_CLIENT_TO_SERVER_MAP = {
	'Web':		'WEB',
	'iOS':		'IOS',
	'Android':	'ANDROID',
	'Other':	'OTHER'
};

module.exports.PLATFORM_CLIENT_ARRAY			= PLATFORM_CLIENT_ARRAY;
module.exports.PLATFORM_CLIENT_TO_SERVER_MAP	= PLATFORM_CLIENT_TO_SERVER_MAP;
module.exports.PLATFORM_SERVER_TO_CLIENT_MAP	= PLATFORM_SERVER_TO_CLIENT_MAP;
