/**
 * Created by Anatoly on 17.03.2016.
 */

const React = require('react');
const Morearty = require('morearty');
const Immutable = require('immutable');
const Loader = require('../../../../../ui/loader');

const {AchievementAllSchools} = require('module/as_manager/pages/parents_pages/events/achievement/achievements_all_schools');

const AchievementsAllSchoolWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		return (
			<AchievementAllSchools
				binding={this.getDefaultBinding().sub('achievementAllSchool')}
				schools={this.getDefaultBinding().toJS('school')}
				student={this.getDefaultBinding().toJS('school')}
			/>
		);
	}
});

module.exports = AchievementsAllSchoolWrapper;
