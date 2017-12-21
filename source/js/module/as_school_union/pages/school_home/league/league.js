/**
 * Created by vitaly on 22.11.17.
 */
const	React		= require('react'),
		Morearty	= require('morearty');

const	LeagueSportSelect		= require('./league_sport_select'),
		LeagueTable				= require('./league_table/league_table'),
		{SchoolUnionActions}	= require('module/as_school_union/school_union_actions');

const	SchoolUnionSeasonScoresStyles	= require('../../../../../../styles/ui/b_school_union_league.scss');

const League = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const 	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding();
		
		binding.sub('currentLeagueSport').addListener(eventDescriptor => {
			const sportId = eventDescriptor.getCurrentValue().toJS().id;
			SchoolUnionActions.getLeagueScores(binding, activeSchoolId, sportId);
		});
	},
	
	renderSportSelector: function() {
		const binding = this.getDefaultBinding();
		return (
			<LeagueSportSelect binding={binding}/>
		);
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