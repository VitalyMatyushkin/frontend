var LeanerView,
	SVG = require('module/ui/svg'),
	AboutMe = require('module/as_manager/pages/pupil/view/about_me'),
	UserButtons = require('module/as_manager/pages/pupil/view/user_buttons'),
	UserName = require('module/as_manager/pages/pupil/view/user_name'),
	UserPhoto = require('module/as_manager/pages/pupil/view/user_photo');

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
							console.log(pointsData)
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


						<div className="bUserFullInfo">
							<div className="eUserFullInfo_block">
								<div className="eUserFullInfo_name">Winnings:</div>
								<div className="eUserFullInfo_text bLinkLike">Football match with Cannys House 5:2</div>
								<div className="eUserFullInfo_text bLinkLike">Football match with Ladouys Winders House 10:9</div>
							</div>
						</div>

						<div className="bUserFullInfo mDates">
							<div className="eUserFullInfo_block">
								<div className="eUserFullInfo_name bLinkLike">Events:</div>
								<div className="eUserFullInfo_text bLinkLike"><div className="eUserFullInfo_date">23.03.2015</div> football match with Cannys House</div>
								<div className="eUserFullInfo_text mImportant bLinkLike"><div className="eUserFullInfo_date">01.04.2015</div> football match with Cannys House</div>
								<div className="eUserFullInfo_text bLinkLike"><div className="eUserFullInfo_date">17.03.2015</div> football match with Cannys House</div>
							</div>
						</div>


						<div className="bUserFullInfo">
							<div className="eUserFullInfo_block">
								<div className="eUserFullInfo_name bLinkLike">Trener notes:</div>
								<div className="eUserFullInfo_text">Be stronger!</div>
							</div>
						</div>


					</div>
				</div>
			</div>
		)
	}
});


module.exports = LeanerView;
