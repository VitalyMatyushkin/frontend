const CLIENT_TO_SERVER_PRICING_MAPPING = {
	'Free'			: "FREE",
	'Per Session'	: "PER_SESSION",
	'Half Term'		: "HALF_TERM",
	'Term'			: "TERM"
};

const SERVER_TO_CLIENT_PRICING_MAPPING = {
	'FREE'			: "Free",
	'PER_SESSION'	: "Per Session",
	'HALF_TERM'		: "Half Term",
	'TERM'			: "Term"
};

const PRICING_ARRAY = [
	'Free',
	'Per Session',
	'Half Term',
	'Term'
];

const PRICING = {
	'FREE'			:'Free',
	'PER_SESSION'	:'Per Session',
	'HALF_TERM'		:'Half Term',
	'TERM'			:'Term'
};

const WEEK_DAYS_MAP = {
	'MONDAY':		'Monday',
	'TUESDAY':		'Tuesday',
	'WEDNESDAY':	'Wednesday',
	'THURSDAY':		'Thursday',
	'FRIDAY':		'Friday',
	'SATURDAY':		'Saturday',
	'SUNDAY':		'Sunday'
};

module.exports.CLIENT_TO_SERVER_PRICING_MAPPING = CLIENT_TO_SERVER_PRICING_MAPPING;
module.exports.SERVER_TO_CLIENT_PRICING_MAPPING = SERVER_TO_CLIENT_PRICING_MAPPING;
module.exports.PRICING_ARRAY = PRICING_ARRAY;
module.exports.PRICING = PRICING;
module.exports.WEEK_DAYS_MAP = WEEK_DAYS_MAP;