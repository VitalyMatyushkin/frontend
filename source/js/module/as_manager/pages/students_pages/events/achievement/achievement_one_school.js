/**
 * Created by Anatoly on 17.03.2016.
 */
const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),

		AchievementStatisticView	= require('./view/achievement-statistic-view'),
		StudentHelper				= require('module/helpers/studentHelper');

const AchievementOneSchool = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const binding = this.getDefaultBinding();
		this.activeSchoolId = binding.get('activeSchoolId');

		this.updateViewOnActiveSchoolIdChange();
	},
	updateViewOnActiveSchoolIdChange:function(){
		const binding = this.getDefaultBinding();

		const schoolId = binding.get('activeSchoolId');
		binding.set('achievements', null);

		if(!schoolId) {
			document.location.hash = 'events/calendar/all';
		} else if(schoolId && schoolId !=='all') {
			StudentHelper.getStudentProfile(schoolId)
				.then(studentData => {
					binding.set('achievements', Immutable.fromJS(studentData));
				});
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();

		if(this.activeSchoolId !== binding.get('activeSchoolId')){
			this.reRender = true;
			this.updateViewOnActiveSchoolIdChange();
			this.activeSchoolId = binding.get('activeSchoolId');
		}

		return (
			<AchievementStatisticView binding={binding} />
		)
	}
});
module.exports = AchievementOneSchool;
