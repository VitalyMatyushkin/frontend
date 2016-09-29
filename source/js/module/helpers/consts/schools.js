const PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE = {
	"Public Available":	"PUBLIC_AVAILABLE",
	"Protected":		"PROTECTED",
	"Disabled":			"DISABLED"
};

const PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE = {
	"PUBLIC_AVAILABLE":	"Public Available",
	"PROTECTED":		"Protected",
	"DISABLED":			"Disabled"
};

const PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY = [
	"PUBLIC_AVAILABLE",
	"PROTECTED",
	"DISABLED"
];

const PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY = [
	"Public Available",
	"Protected",
	"Disabled"
];

const DEFAULT_PUBLIC_ACCESS_SCHOOL_CLIENT_VALUE = PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE['PUBLIC_AVAILABLE'];

module.exports.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE	= PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;
module.exports.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE	= PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE;
module.exports.PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY		= PUBLIC_SCHOOL_STATUS_SERVER_VALUE_ARRAY;
module.exports.PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY		= PUBLIC_SCHOOL_STATUS_CLIENT_VALUE_ARRAY;

module.exports.DEFAULT_PUBLIC_ACCESS_SCHOOL_CLIENT_VALUE	= DEFAULT_PUBLIC_ACCESS_SCHOOL_CLIENT_VALUE;
