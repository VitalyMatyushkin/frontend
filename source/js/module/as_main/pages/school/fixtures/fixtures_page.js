var FixturesPage,
	SVG = require('module/ui/svg'),
	FixturesList = require('module/as_manager/pages/events/events_challenges');

FixturesPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			eventsRouting: {},
			teams: [],
			sports: {
				models: [],
				sync: false
			},
			models: [],
			sync: false,
			newEvent: {}
		});
	},
	componentWillMount: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding(),
			sportsBinding = binding.sub('sports');

		if (!activeSchoolId) {
			console.error('School id is not set');

			return false;
		}

		window.Server.sports.get().then(function (data) {
			sportsBinding
				.atomically()
				.set('sync', true)
				.set('models', Immutable.fromJS(data))
				.commit();
		});

		window.Server.eventsBySchoolId.get({
			schoolId: activeSchoolId
		}).then(function (data) {
			binding
				.atomically()
				.set('models', Immutable.fromJS(data))
				.set('sync', true)
				.commit();
		});

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>

				<FixturesList binding={binding} />

				<div className="bChallengeDate">
					<div className="eChallengeDate_date">Sa 17 April 2015</div>
					<div className="eChallengeDate_list">
						<div className="bChallenge">
							<div className="eChallenge_in">
								<div className="eChallenge_rivalName">
									<span className="eChallenge_rivalPic"><img
										src="http://i.imgur.com/9br7NSU.jpg"/></span>
									<span>Handcross Park School</span></div>

								<div className="eChallenge_rivalInfo">
									<div className="eChallenge_hours">07:01</div>
									<div className="eChallenge_sportsName">Football</div>
									<div className="eChallenge_info">inter-schools</div>
								</div>
								<div className="eChallenge_rivalName">
									<span className="eChallenge_rivalPic"><img
										src="http://i.imgur.com/pv22j1O.jpg"/></span>
									<span>Great Walstead School</span></div>
							</div>
						</div>

						<div className="bChallenge">
							<div className="eChallenge_in">
								<div className="eChallenge_rivalName">
									<span>BOYS U14C</span></div>

								<div className="eChallenge_rivalInfo">
									<div className="eChallenge_hours">15:21</div>
									<div className="eChallenge_sportsName">Football</div>
									<div className="eChallenge_info">inter-schools</div>
								</div>
								<div className="eChallenge_rivalName">
									<span>BOYS U14B</span></div>
							</div>
						</div>

					</div>
				</div>

			</div>
		)
	}
});


module.exports = FixturesPage;
