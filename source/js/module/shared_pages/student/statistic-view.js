/**
 * Created by Anatoly on 06.09.2016.
 */
const   AboutMe             = require('module/shared_pages/student/view/about_me'),
		UserName            = require('module/shared_pages/student/view/user_name'),
		UserFixtures        = require('module/shared_pages/student/view/user_fixtures'),
		TeamStats           = require('module/shared_pages/student/view/team_stats'),
		Loader       		= require('module/ui/loader'),
		{If}				= require('module/ui/if/if'),
		React               = require('react'),
        Morearty            = require('morearty');

import {AchievementOneChild} from 'module/as_manager/pages/parents_pages/events/achievement/achievement_one_child'

const propz = require('propz');

const StatisticView = React.createClass({
    mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired,
		type: React.PropTypes.string.isRequired
	},
	getStudentId: function() {
		return propz.get(this.getStudentProfile(), ['id']);
	},
	getStudentProfile: function() {
		return this.getDefaultBinding().toJS('achievements');
	},
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
									<AchievementOneChild
										schoolId={this.props.activeSchoolId}
										activeChildId={this.getStudentId()}
										children={[this.getStudentProfile()]}
										binding={binding.sub('achievementOneChild')}
										type={this.props.type}
									/>
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