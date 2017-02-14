/**
 * Created by Woland on 20.01.2017.
 */

const	AboutMe				= require('./about_me'),
		UserName			= require('./user_name'),
		UserAchievements	= require('./user_achievements'),
		UserFixtures		= require('./user_fixtures'),
		TeamStats			= require('./team_stats'),
		Loader				= require('module/ui/loader'),
		If 					= require('module/ui/if/if'),
		React				= require('react'),
		Morearty			= require('morearty');

const AchivementStatisticView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		var binding = this.getDefaultBinding(),
			achievements = binding.sub('achievements'),
			isLoading = !achievements.get();
		return (
			<div className={this.props.className}>
				<div className="bUserColumn">
					<div className="eUserColumnData">
						<UserName binding={achievements}/>
						<AboutMe title="About me" binding={achievements}/>
					</div>
				</div>
				<div className="bUserDataColumn">
					<Loader condition={isLoading} />
					<If condition={!isLoading}>
						<div className="eUserDataColumn_wrap" id="jsSubPage">
							<div className="bUserFullInfo mDates">
								<div className="eUserFullInfo_block">
									<h3>Personal Achievements: {achievements.get('numOfGamesScoredIn')}</h3>
									<UserAchievements binding={achievements}/>
								</div>
							</div>
							<div className="bUserFullInfo mDates">
								<div className="eUserFullInfo_block">
									<h3>Team Statistics(Games Won): {achievements.get('numOfGamesWon')}</h3>
									<TeamStats binding={achievements}/>
								</div>
							</div>
							<h3>All Fixtures: {achievements.get('numberOfGamesPlayed')}</h3>
							<UserFixtures binding={achievements}/>
						</div>
					</If>
				</div>
			</div>
		)
	}
});
module.exports = AchivementStatisticView;