const	React							= require('react'),
		Immutable						= require('immutable'),
		Morearty						= require('morearty'),
		ScoreTable						= require('./score_table/score_table'),
		SportSelector					= require('./sport_selector'),
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

		window.Server.publicSchoolSports.get('57b6c9a6dd69264b6c5ba82d', filter)
			.then(sports => {
				const favoriteSports = this.filterFavoriteSports(sports);

				let resultSports;
				if(favoriteSports.length > 0) {
					resultSports = favoriteSports;
				} else {
					resultSports = sports;
				}

				binding.atomically()
					.set('sports',			Immutable.fromJS(resultSports))
					.set('currentSport',	Immutable.fromJS(resultSports[0]))
					.set('isSyncSports',	true)
					.commit();
			});

		this.getDefaultBinding().sub('currentSport').addListener(eventDescriptor => {
			const sportId = binding.get('isSyncSports') ? eventDescriptor.getCurrentValue().toJS().id : null;
			
			if (sportId !== null) {
				window.Server.publicSchoolUnionStats.get({schoolUnionId: activeSchoolId}, {
					filter: {
						where: {
							sportId: sportId
						}
					}
				}).then(scores => {
					binding.atomically()
					.set('scores',			Immutable.fromJS(scores))
					.commit();
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
				<ScoreTable scores={binding.toJS('scores')}/>
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