const	React							= require('react'),
		Immutable						= require('immutable'),
		Morearty						= require('morearty'),
		ScoreTable						= require('./score_table/score_table'),
		SportSelector					= require('./sport_selector'),
		ScoreTableHelper				= require('module/as_school_union/pages/school_home/scores/score_table/helpers/score_table_helper'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../styles/ui/b_school_union_season_scores.scss');

const Scores = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const activeSchoolId = this.getMoreartyContext().getBinding().get('activeSchoolId');

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

		window.Server.publicSchoolSports.get(activeSchoolId, filter)
			.then(sports => {
				//const favoriteSports = this.filterFavoriteSports(sports);
				//
				//let resultSports;
				//if(favoriteSports.length > 0) {
				//	resultSports = favoriteSports;
				//} else {
				//	resultSports = sports;
				//}

				// TODO It's temporary.
				const resultSports = sports.filter(s => s.isFavorite || s.name === ScoreTableHelper.NETBALL || s.name === ScoreTableHelper.OVERALL_RESULTS);

				// TODO It's temporary
				// up 'Overall Results' sport to first place
				const index = resultSports.findIndex(s => s.name === ScoreTableHelper.OVERALL_RESULTS);
				if(index !== -1) {
					resultSports.unshift(
						resultSports.splice(index, 1)[0]
					);
				}

				binding.atomically()
					.set('sports',			Immutable.fromJS(resultSports))
					.set('currentSport',	Immutable.fromJS(resultSports[0]))
					.set('isSyncSports',	true)
					.commit();
			});

		binding.sub('currentSport').addListener(eventDescriptor => {
			const 	activeSchoolId = this.getMoreartyContext().getBinding().get('activeSchoolId'),
					sportId = binding.get('isSyncSports') ? eventDescriptor.getCurrentValue().toJS().id : null;

			if (sportId !== null) {
				window.Server.publicSchoolUnionStats.get({schoolUnionId: activeSchoolId}, {
					filter: {
						where: {
							sportId: sportId
						}
					}
				}).then(scores => {
					if(binding.toJS('currentSport').name === 'Netball') {
						for(let schoolId in scores) {
							const scoreData = scores[schoolId];

							scoreData.points = 3 * scoreData.won + 2 * scoreData.drew + scoreData.lost;
						}
					}

					binding.set('scores', Immutable.fromJS(scores));
				});
			}

		});
	},
	filterFavoriteSports: function(sports) {
		return sports.filter(s => s.isFavorite);
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
		if (typeof binding.toJS('scores') !== 'undefined') {
			return (
				<ScoreTable
					sport	= { binding.toJS('currentSport') }
					scores	= { binding.toJS('scores') }
				/>
			);
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<div className="bSchoolUnionSeasonScores">
					<h1 className="eSchoolUnionSeasonScores_title">Season Scores</h1>
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