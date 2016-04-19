const EventHelper = {
	clientEventTypeToServerClientTypeMapping: {
		'inter-schools':	'EXTERNAL_SCHOOLS',
		'houses':			'INTERNAL_HOUSES',
		'internal':			'INTERNAL_TEAMS'
	},
	serverClientTypeClientEventTypeToMapping: {
		'EXTERNAL_SCHOOLS':	'inter-schools',
		'INTERNAL_HOUSES':	'houses',
		'INTERNAL_TEAMS':	'internal'
	}
};

module.exports = EventHelper;