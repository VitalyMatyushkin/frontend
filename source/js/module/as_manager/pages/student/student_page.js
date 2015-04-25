var LeanerView,
	SVG = require('module/ui/svg'),
	AboutMe = require('module/as_manager/pages/student/view/about_me'),
	UserButtons = require('module/as_manager/pages/student/view/user_buttons'),
	UserName = require('module/as_manager/pages/student/view/user_name'),
	UserPhoto = require('module/as_manager/pages/student/view/user_photo'),
    UserAchievements = require("module/as_manager/pages/student/view/user_achievements"),
    UserFixtures = require('module/as_manager/pages/student/view/user_fixtures'),
    fixData;

LeanerView = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			studentId = globalBinding.get('routing.parameters.id'),
			leanerData = {};
		// Костыль, пока не будет ясности с путями хранения данных
		studentId && window.Server.student.get(studentId).then(function (data) {
			leanerData = data;
			// Лютый костыль, пока не будет метода с полными данными
			Server.form.get(data.formId).then(function(classData) {
				leanerData.classData = classData;
				Server.house.get(data.houseId).then(function(houseData) {
					leanerData.houseData = houseData;
					Server.school.get(data.schoolId).then(function(schoolData) {
						leanerData.schoolData = schoolData;
						binding.set(Immutable.fromJS(leanerData));
						Server.studentPoints.get(studentId).then(function(pointsData) {
							console.log(pointsData);
						});
					});
				});

			});

		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			data = binding.toJS();
		return (
			<div>
				<div className="bUserColumn">
					<UserPhoto binding={binding} />
					<div className="eUserColumnData">
						<UserName binding={binding} />
						<AboutMe title="About me" binding={binding} />
   					</div>
				</div>
				<div className="bUserDataColumn">
					<div className="eUserDataColumn_wrap" id="jsSubPage">
						<UserButtons />
                        <UserAchievements />
						<div className="bUserFullInfo mDates">
							<div className="eUserFullInfo_block">
								<div className="eUserFullInfo_name bLinkLike">Team Statistics:</div>
							</div>
						</div>
                        <UserFixtures  binding={binding} />
					</div>
				</div>
			</div>
		)
	}
});
module.exports = LeanerView;
