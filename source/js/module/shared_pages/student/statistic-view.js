/**
 * Created by Anatoly on 06.09.2016.
 */
const   AboutMe             = require('module/shared_pages/student/view/about_me'),
		UserName            = require('module/shared_pages/student/view/user_name'),
		UserAchievements    = require("module/shared_pages/student/view/user_achievements"),
		UserFixtures        = require('module/shared_pages/student/view/user_fixtures'),
		TeamStats           = require('module/shared_pages/student/view/team_stats'),
		Loader       		= require('module/ui/loader'),
		If 					= require('module/ui/if/if'),
		React               = require('react'),
        Morearty            = require('morearty');

const StatisticView = React.createClass({
    mixins: [Morearty.Mixin],
    render: function () {
        const 	binding			= this.getDefaultBinding(),
				achievements	= binding.sub('achievements'),
				isLoading		= !achievements.get();

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
module.exports = StatisticView;
