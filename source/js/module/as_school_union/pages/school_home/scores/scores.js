const	React							= require('react'),
		Immutable						= require('immutable'),
		Morearty						= require('morearty'),
		ScoreTable						= require('./score_table/score_table'),
		SportSelector					= require('./sport_selector'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../styles/ui/b_school_union_season_scores.scss');

const Scores = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const binding = this.getDefaultBinding();
		binding.atomically()
			.set('currentSport',	undefined)
			.set('isSyncSports',	false)
			.commit();

		const filter = {
			filter: {
				limit: 1000 //TODO: holy crap
			}
		};

		window.Server.sports.get(filter)
			.then(sports => {
				binding.atomically()
					.set('sports',			Immutable.fromJS(sports))
					.set('currentSport',	Immutable.fromJS(sports[0]))
					.set('isSyncSports',	true)
					.commit();
			});

		this.getDefaultBinding().sub('currentSport').addListener(eventDescriptor => {
			const activeSchoolId = this.getMoreartyContext().getBinding().get('activeSchoolId');

			window.Server.publicSchoolUnionStats.get({schoolUnionId: activeSchoolId}, {
				filter: {
					where: {
						sportId: eventDescriptor.getCurrentValue().toJS().id
					}
				}
			}).then(scores => {
				binding.atomically()
					.set('scores',			Immutable.fromJS(scores))
					.commit();
			});
		});
	},
	renderSportSelector: function() {
		const binding = this.getDefaultBinding();

		if(binding.get('isSyncSports')) {
			return (
				<SportSelector binding={binding}/>
			);
		} else {
			return null;
		}
	},
	renderScoreTable: function() {
		const binding = this.getDefaultBinding();

		return (
			<ScoreTable scores={binding.toJS('scores')}/>
		);
	},
	render: function(){
		return (
			<div className="bSchoolUnionSeasonScores">
				<div className="eSchoolFixtureTab eNews_tab">
					<h1>Season Scores</h1>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="eSchoolUnionSeasonScores_body">
								{this.renderSportSelector()}
								{this.renderScoreTable()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Scores;