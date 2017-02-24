const EventHelper = {
	clientEventTypeToServerClientTypeMapping: {
		'inter-schools':	'EXTERNAL_SCHOOLS',
		'houses':			'INTERNAL_HOUSES',
		'internal':			'INTERNAL_TEAMS'
	},
	serverEventTypeToClientEventTypeMapping: {
		'EXTERNAL_SCHOOLS':	'inter-schools',
		'INTERNAL_HOUSES':	'houses',
		'INTERNAL_TEAMS':	'internal'
	},
	fartherThenItems: [
		{id: 'UNLIMITED', text:'Unlimited'},
		{id: '10M', value: 10, text: '10 miles'},
		{id: '20M', value: 20, text: '20 miles'},
		{id: '30M', value: 30, text: '30 miles'},
		{id: '40M', value: 40, text: '40 miles'},
		{id: '50M', value: 50, text: '50 miles'}
	]
};

module.exports = EventHelper;