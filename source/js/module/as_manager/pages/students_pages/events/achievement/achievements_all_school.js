/**
 * Created by Anatoly on 17.03.2016.
 */

const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),

		EventHelper	= require('../../../../../helpers/eventHelper'),
		Loader		= require('../../../../../ui/loader');

const AchievementsAllSchool = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount:function(){
		const	binding		= this.getDefaultBinding(),
				school	= binding.toJS('school');

		if(school.length){
			this.getData();
		}else{
			this.addBindingListener(binding, 'school', this.getData);
		}
	},
	getData: function(){
		const	binding		= this.getDefaultBinding(),
				school		= binding.toJS('school'),
				ids			= school && school.map(sch => sch.id);

		if(ids){
			window.Server.studentSchoolEventsCount.get().then(data => {
				binding.set('allAchievements', Immutable.fromJS(data));
			});
		}
	},
	renderAllAchievements:function(){
		const	binding			= this.getDefaultBinding(),
				school			= binding.toJS('school'),
				achievements	= binding.toJS('allAchievements');

		let result = (
			<div className="eAchievement_row">
				<Loader condition={true} />
			</div>
		);

		if(school && school.length && achievements) {

			const schoolName = 'All school',
				gamesPlayed = achievements.totalEvents,
				gamesWon = achievements.wonEvents,
				gamesLost = gamesPlayed - gamesWon,
				gamesScored = achievements.scoredEvents;

			result = (
					<div className="eAchievement_row">
						<div
							className="eAchievement_common eAchievement_name">{schoolName}</div>
						<div
							className="eAchievement_common eAchievementGamesPlayed">{gamesPlayed}</div>
						<div className="eAchievement_common eAchievementGamesWon">{gamesWon}</div>
						<div className="eAchievement_common eAchievementGamesLost">{gamesLost}</div>
						<div className="eAchievement_common eAchievementGoalsScored">{gamesScored}</div>
					</div>
				);
		}

		return result;
	},
	render: function () {

		return (
			<div className="eAllAchievements_container">
				<div className="eAchievement_header">
					<div className="eAchievement_common eAchievement_name">School Name</div>
					<div className="eAchievement_common eAchievementGamesPlayed">Games Played</div>
					<div className="eAchievement_common eAchievementGamesWon">Games Won</div>
					<div className="eAchievement_common eAchievementGamesLost">Games Lost</div>
					<div className="eAchievement_common eAchievementGoalsScored">Games Scored</div>
				</div>
				{this.renderAllAchievements()}
			</div>
		)
	}
});

module.exports = AchievementsAllSchool;
