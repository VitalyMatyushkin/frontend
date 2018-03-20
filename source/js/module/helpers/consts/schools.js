const PUBLIC_SCHOOL_STATUS_SERVER = {
	"PUBLIC_AVAILABLE":	"PUBLIC_AVAILABLE",
	"PROTECTED":		"PROTECTED",
	"DISABLED":			"DISABLED"
};

const PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE = {
	"Allowed":			"PUBLIC_AVAILABLE",
	"Protected":		"PROTECTED",
	"Disabled":			"DISABLED"
};

const PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE = {
	"PUBLIC_AVAILABLE":	"Allowed",
	"PROTECTED":		"Protected",
	"DISABLED":			"Disabled"
};

const PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY = [
	"PUBLIC_AVAILABLE",
	"PROTECTED",
	"DISABLED"
];

const PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY = [
	"Allowed",
	"Protected",
	"Disabled"
];

const DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE = 'DISABLED';

const SCHOOL_SUBSCRIPTION_PLAN = {
	FULL: 'FULL',
	LITE: 'LITE'
};

const STATUS = {
	ACTIVE: 				'ACTIVE',
	INACTIVE: 				'INACTIVE',
	SUSPENDED: 				'SUSPENDED',
	EMAIL_NOTIFICATIONS: 	'EMAIL_NOTIFICATIONS',
	REMOVED: 				'REMOVED'
};
	/*{ ACTIVE: 'ACTIVE' },
	{ text: 'Inactive', 			value: 'INACTIVE' },
	{ text: 'Suspended', 			value: 'SUSPENDED' },
	{ text: 'Email Notifications', 	value: 'EMAIL_NOTIFICATIONS' }
];*/

//Options for element dropdown in school form
const STATUS_OPTIONS = [
	{ text: 'Active', 				value: 'ACTIVE' },
	{ text: 'Inactive', 			value: 'INACTIVE' },
	{ text: 'Suspended', 			value: 'SUSPENDED' },
	{ text: 'Email Notifications', 	value: 'EMAIL_NOTIFICATIONS' }
];

const PUBLIC_STUDENT_VIEW_OPTIONS = [
	{ text: 'Shorten Last Name only (Brian S.)', 		value: 'SHORTEN_LASTNAME_ONLY' },
	{ text: 'Shorten First Name and Last Name (B.S.)', 	value: 'SHORTEN_FIRSTNAME_AND_LASTNAME' }
];

const AGE_GROUPS_NAMING_OPTIONS = [
	{ text: 'English', 	value: 'ENGLISH'},
	{ text: 'Scottish', value: 'SCOTTISH'},
	{ text: 'U6-U19', 	value: 'U6-U19'},
	{ text: 'US', 	value: 'US'}
];

const INVITE_ACTION_OPTIONS = [
	{ text: 'Manual Mode', 				value: 'MANUAL' },
	{ text: 'Auto Accept (default)', 	value: 'AUTO_ACCEPT' },
	{ text: 'Auto Reject', 				value: 'AUTO_REJECT' }
];

// English: Reception, Y1..Y13 (14 age group)
// Scottish: P1..P7, S1..S6 (13 age group, Y13 does not exist)
// U6-U19: U6..U19 (14 age group)
const AGE_GROUPS = {
	'ENGLISH': 	['Reception', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y10', 'Y11', 'Y12', 'Y13'],
	'SCOTTISH': ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'NotExist'],
	'U6-U19': 	['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19'],
	'US': 		['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
};

const SUBSCRIPTION_PLAN_OPTIONS = [
	{text: 'Full', value: 'FULL'},
	{text: 'Lite', value: 'LITE'}
];

const CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY = [
	{ text: 'String', 		value: 'STRING' },
	{ text: 'Number', 		value: 'NUMBER' },
	{ text: 'Boolean', 		value: 'BOOLEAN' },
	{ text: 'Enum', 		value: 'ENUM' }
];

const CONSENT_REQUEST_TEMPLATE_FIELD_TYPE = {
	STRING: 	'STRING',
	NUMBER: 	'NUMBER',
	BOOLEAN: 	'BOOLEAN',
	ENUM: 		'ENUM'
};

const CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY_OF_STRING = [
	'STRING',
	'NUMBER',
	'BOOLEAN',
	'ENUM'
];

module.exports.PUBLIC_SCHOOL_STATUS_SERVER							= PUBLIC_SCHOOL_STATUS_SERVER;

module.exports.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE			= PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;
module.exports.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE			= PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE;
module.exports.PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY				= PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY;
module.exports.PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY				= PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY;

module.exports.DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE			= DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE;

module.exports.SCHOOL_SUBSCRIPTION_PLAN								= SCHOOL_SUBSCRIPTION_PLAN;

module.exports.STATUS_OPTIONS 										= STATUS_OPTIONS;
module.exports.PUBLIC_STUDENT_VIEW_OPTIONS 							= PUBLIC_STUDENT_VIEW_OPTIONS;
module.exports.AGE_GROUPS_NAMING_OPTIONS 							= AGE_GROUPS_NAMING_OPTIONS;
module.exports.INVITE_ACTION_OPTIONS 								= INVITE_ACTION_OPTIONS;
module.exports.SUBSCRIPTION_PLAN_OPTIONS 							= SUBSCRIPTION_PLAN_OPTIONS;

module.exports.AGE_GROUPS 											= AGE_GROUPS;

module.exports.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE 					= CONSENT_REQUEST_TEMPLATE_FIELD_TYPE;
module.exports.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY 			= CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY;
module.exports.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY_OF_STRING 	= CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY_OF_STRING;

module.exports.STATUS 												= STATUS;