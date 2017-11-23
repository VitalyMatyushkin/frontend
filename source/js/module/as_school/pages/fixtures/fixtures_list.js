const 	DateTimeMixin 	= require('module/mixins/datetime'),
	{If}				= require('module/ui/if/if'),
		Morearty        = require('morearty'),
		React 			= require('react');

// TODO: Old! Don't use this class.
const FixturesList = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	_getScore: function(fixture) {
		var self = this,
			firstId,
			secondId,
			firstScore,
			secondScore;

		if (!fixture || !fixture.result) return null;

		firstId = fixture.participants[0].id;
		secondId = fixture.participants[1].id;

		if (fixture.result.summary && fixture.result.summary.byTeams) {
			firstScore = fixture.result.summary.byTeams[firstId];
			secondScore = fixture.result.summary.byTeams[secondId];
		}

		return (firstScore === undefined ? '0' : firstScore) + ' : ' + (secondScore === undefined ? '0' : secondScore);
	},
	_getRivelNode: function(participan) {
		var self = this,
			pictures,
			color,
			name;

		if (!participan) return '?';

		pictures = participan.house && participan.house.pic || participan.school && participan.school.pic;
		name = participan.house && participan.house.name || participan.school && participan.school.name;


		// Внутреннее событие
		if (participan.name) {
			name = participan.name;
		}

		if (participan.house) {
			pictures = participan.house.pic;

			if (participan.house.colors && participan.house.colors[0]) {
				color = participan.house.colors[0];
			}
		}

		return (
			<div className="eChallenge_rivalName">
				<span className="eChallenge_rivalPic"><If condition={pictures}><img src={pictures}/></If><If condition={color}><div className="eChallenge_rivalColor" style={{backgroundColor: color}}></div></If></span>
				<span>{name}</span>
			</div>
		);

	},
	_getFixtureNode: function(fixture) {
		var self = this;

		return (
			<a className="bChallenge" href={'/#event?id=' + fixture.id}>
				<div className="eChallenge_in">
					{self._getRivelNode(fixture.participants[0])}

					<div className="eChallenge_rivalInfo">

						<If condition={fixture.result === undefined}>
							<span>
								<div className="eChallenge_hours">{self.getTimeFromIso(fixture.startTime)}</div>
								<div className="eChallenge_sportsName">{fixture.sport.name}</div>
							</span>
						</If>

						<If condition={fixture.result !== undefined}>
							<span>
								<div className="eChallenge_hours">{fixture.sport.name}</div>
								<div className="eChallenge_results mDone">{self._getScore(fixture)}</div>
							</span>
						</If>

						<div className="eChallenge_info">{fixture.type}</div>
					</div>

					{self._getRivelNode(fixture.participants[1])}
				</div>
			</a>
		);

	},
	_getDateNodes: function(datesGroup) {
		var self = this,
			resultSet = [];

		for (var date in datesGroup) {
			resultSet.push(
				<div className="bChallengeDate">
					<div className="eChallengeDate_date">{date}</div>
					<div className="eChallengeDate_list">
						{datesGroup[date]}
					</div>
				</div>
			);
		}

		return resultSet;
	},
	groupByDate: function(data) {
		var self = this,
			datesSet = {};

		data.forEach(function(fixture) {
			var checkDate = self.getDateFromIso(fixture.startTime);

			if (!datesSet[checkDate]) {
				datesSet[checkDate] = [];
			}

			datesSet[checkDate].push(self._getFixtureNode(fixture));
		});

		return self._getDateNodes(datesSet);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			data = binding.toJS();

		if (data && data.length) {
			data = self.groupByDate(data);
		}

		return (
			<div>
				{data}
			</div>
		)
	}
});


module.exports = FixturesList;
