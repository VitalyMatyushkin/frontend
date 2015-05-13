var LeanerView,
	SVG = require('module/ui/svg'),
	AboutMe = require('module/as_manager/pages/student/view/about_me'),
	UserButtons = require('module/as_manager/pages/student/view/user_buttons'),
	UserName = require('module/as_manager/pages/student/view/user_name'),
	UserPhoto = require('module/as_manager/pages/student/view/user_photo'),
    UserAchievements = require("module/as_manager/pages/student/view/user_achievements"),
    UserFixtures = require('module/as_manager/pages/student/view/user_fixtures'),
    TeamStats = require('module/as_manager/pages/student/view/team_stats'),
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
						Server.studentPoints.get(studentId).then(function(pointsData) {
							leanerData.scorePoints = pointsData.length;
                            leanerData.pointsData = pointsData;
							Server.results.get({id:studentId}).then(function(resultsData){
								leanerData.resultsData = resultsData;
                                Server.studentEvents.get({id:studentId}).then(function(schoolEvent){
                                    leanerData.schoolEvent = schoolEvent;
                                    Server.studentGamesWon.get({id:studentId, include: JSON.stringify([{"invites":["inviter","guest"]},{"participants":["players","house","school"]},{"result":"points"}])}).then(function(gamesWon){
										leanerData.gamesWon = gamesWon;
                                        leanerData.numOfGamesWon = gamesWon.length;
										Server.studentGamesScored.get({id:studentId, include: JSON.stringify([{"invites":["inviter","guest"]},{"participants":["players","house","school"]},{"result":"points"}])}).then(function(gamesScoredIn){
											leanerData.gamesScoredIn = gamesScoredIn;
											leanerData.numOfGamesScoredIn = gamesScoredIn.length;
											Server.studentEvents.get({id:studentId}).then(function(gamesPlayed){
												leanerData.gamesPlayed = gamesPlayed.length;
												binding.set(Immutable.fromJS(leanerData));
											});
										});
                                    })
                                });
							});
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
						<div className="bUserFullInfo mDates">
							<div className="eUserFullInfo_block">
								<h1>Personal Achievements:</h1>
								<UserAchievements binding={binding} />
							</div>
						</div>
						<div className="bUserFullInfo mDates">
							<div className="eUserFullInfo_block">
								<h1>Team Statistics(Games Won):</h1>
								<TeamStats binding={binding} />
							</div>
						</div>
                        <h1>All Fixtures:</h1>
                        <UserFixtures  binding={binding} />
					</div>
				</div>
			</div>
		)
	}
});
module.exports = LeanerView;
