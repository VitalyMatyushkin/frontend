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

module.exports.PUBLIC_SCHOOL_STATUS_SERVER					= PUBLIC_SCHOOL_STATUS_SERVER;

module.exports.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE	= PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;
module.exports.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE	= PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE;
module.exports.PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY		= PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY;
module.exports.PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY		= PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY;

module.exports.DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE	= DEFAULT_PUBLIC_ACCESS_SCHOOL_SERVER_VALUE;