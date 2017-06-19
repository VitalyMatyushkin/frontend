const ScoreTableHelper = {
	OVERALL_RESULTS:	'Overall results',
	NETBALL:			'Netball',
	useDefaultScoreTable: function(sport) {
		return sport.name === this.NETBALL;
	}
};

module.exports = ScoreTableHelper;