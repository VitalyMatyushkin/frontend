/**
 * Created by vitaly on 22.11.17.
 */
const	React							= require('react'),
		Immutable						= require('immutable'),
		Morearty						= require('morearty'),
		LeagueSportSelect				= require('./league_sport_select'),
		ScoreHelper 					= require('./score_helper'),
		LeagueTable						= require('./score_table/league_table'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../styles/ui/b_school_union_league.scss');

const 	leagueSports 					= require('./league_sports_helper');

const League = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const activeSchoolId = this.getMoreartyContext().getBinding().get('activeSchoolId');
		
		const binding = this.getDefaultBinding();
		binding.atomically()
			.set('currentLeagueSport',	undefined)
			.set('isSyncLeagueSports',	false)
			.set('emptyLeague', true)
			.commit();
		
		const filterSport = {
			filter: {
				limit: 1000,
				where: {
					$or: []
				}
			}
		};

		leagueSports.forEach(sport => filterSport.filter.where.$or.push({name: sport}));

		window.Server.publicSchoolSports.get(activeSchoolId, filterSport)
			.then(sports => {
				const 	sportIds = sports.map(s => s.id),
						filterEvent = {
							filter: {
								limit: 1000,
								where: {
									status: {
										$in: ['FINISHED']
									},
									inviterSchoolId: activeSchoolId,
									$or: []
								}
							}
						};
				sportIds.forEach(sportId => filterEvent.filter.where.$or.push({sportId: sportId}));

				window.Server.publicSchoolEvents.get(activeSchoolId, filterEvent)
					.then(events => {
						const sportIdsFromEvent = events.map(e => e.sportId);
						const resultSports = sports.filter(s => sportIdsFromEvent.indexOf(s.id) !== -1);
						
						if (resultSports.length > 0) {
							binding.atomically()
								.set('leagueSports', Immutable.fromJS(resultSports))
								.set('currentLeagueSport', Immutable.fromJS(resultSports[0]))
								.set('leagueEvents', Immutable.fromJS(events))
								.set('isSyncLeagueSports', true)
								.set('emptyLeague', false)
								.commit();
						}
					});
			});
		
		binding.sub('currentLeagueSport').addListener(eventDescriptor => {
			const 	sportId = binding.get('isSyncLeagueSports') ? eventDescriptor.getCurrentValue().toJS().id : null;
			
			if (sportId !== null) {
				const 	events = binding.toJS('leagueEvents'),
						eventFilteredBySport = events.filter(event => event.sportId === sportId);
				window.Server.publicSchoolUnionSchools.get(activeSchoolId)
					.then(schools => {
						const schoolsId = schools.map(schools => schools.id);
						const scoresData = [];
						schoolsId.forEach(schoolId => {
							eventFilteredBySport.forEach((event, index) => {
								if (this.isSchoolConsistInEvent(schoolId, event)) {
									const 	schoolName 	= ScoreHelper.getSchoolNameFromEvent(schoolId, event),
											winGame 	= ScoreHelper.getWinGame(schoolId, event),
											drawGame 	= ScoreHelper.getDrawGame(schoolId, event),
											loseGame 	= ScoreHelper.getLoseGame(schoolId, event),
											points 		= ScoreHelper.getPoints(winGame, drawGame, loseGame),
											gf 			= ScoreHelper.getGF(schoolId, event),
											ga 			= ScoreHelper.getGA(schoolId, event),
											gd 			= ScoreHelper.getGD(gf, ga),
											playGame 	= ScoreHelper.getPlayGame(event);

									scoresData.push({
										schoolName: schoolName,
										'P': 		playGame,
										'W': 		winGame,
										'D': 		drawGame,
										'L': 		loseGame,
										'GF': 		gf,
										'GA': 		ga,
										'GD': 		gd,
										'Points': 	points
									});
								}
							});
						});
						const 	schoolsName 			= scoresData.map(scoreData => scoreData.schoolName),
								schoolsNameUniqArray 	= ScoreHelper.uniqueArray(schoolsName);

						//Transform array:
						//[schoolName] => [{schoolName: schoolName, P: 0}]
						const schoolsNameUniq = schoolsNameUniqArray.map(schoolName => {
							return {
								schoolName: schoolName,
								'P': 		0,
								'W': 		0,
								'D': 		0,
								'L': 		0,
								'GF': 		0,
								'GA': 		0,
								'GD': 		0,
								'Points': 	0
							}
						});

						schoolsNameUniq.forEach(schoolNameUniq => {
							scoresData.forEach(scoreData => {
								if (schoolNameUniq.schoolName === scoreData.schoolName) {
									schoolNameUniq.P 		= Number(schoolNameUniq.P) + Number(scoreData.P);
									schoolNameUniq.W 		= Number(schoolNameUniq.W) + Number(scoreData.W);
									schoolNameUniq.D 		= Number(schoolNameUniq.D) + Number(scoreData.D);
									schoolNameUniq.L 		= Number(schoolNameUniq.L) + Number(scoreData.L);
									schoolNameUniq.GF 		= Number(schoolNameUniq.GF) + Number(scoreData.GF);
									schoolNameUniq.GA 		= Number(schoolNameUniq.GA) + Number(scoreData.GA);
									schoolNameUniq.GD 		= Number(schoolNameUniq.GD) + Number(scoreData.GD);
									schoolNameUniq.Points 	= Number(schoolNameUniq.Points) + Number(scoreData.Points);
								}
							})
						});
						
						binding.set('leagueScores', Immutable.fromJS(schoolsNameUniq));
					});
			}
		});
		
	},
	
	isSchoolConsistInEvent: function(schoolId, event){
		return event.invitedSchoolIds.some(invitedSchoolId => invitedSchoolId === schoolId)
	},
	
	renderSportSelector: function() {
		const binding = this.getDefaultBinding();
		
		if(binding.get('isSyncLeagueSports')) {
			return (
				<LeagueSportSelect binding={binding}/>
			);
		} else {
			return null;
		}
	},
	
	renderScoreTable: function() {
		const binding = this.getDefaultBinding();
		if (typeof binding.toJS('leagueScores') !== 'undefined') {
			return (
				<LeagueTable
					scores={ binding.toJS('leagueScores') }
				/>
			);
		} else {
			return null;
		}
	},
	
	render: function(){
		return (
			<div className="bSchoolUnionLeague">
				<h1 className="eSchoolUnionLeague_title">League Tables</h1>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="eSchoolUnionLeague_body">
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

module.exports = League;