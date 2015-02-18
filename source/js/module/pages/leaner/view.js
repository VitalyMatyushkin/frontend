var LeanerView,
	SVG = require('module/ui/svg');

LeanerView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			data = binding.toJS();
		 console.log(data)
		return (
			<div>
				<div className="bUserColumn">

					<div className="bUserPhoto mIsMe">
						<img src={binding.get('avatar')} className="eUserPhoto_image" />
					</div>

					<div className="eUserColumnData">
						<div>
							<div className="bUserName">{binding.get('firstName')} {binding.get('lastName')}</div>
							<div className="bAboutList">
								<h6>About me</h6>

								<div className="eAboutList_item"><SVG icon="icon_home" /> SCHOOL_NAME</div>
								<div className="eAboutList_item"><SVG icon="icon_user-tie" /> {binding.get('age')}</div>
								<div className="eAboutList_item"><SVG icon="icon_trophy" /> 0</div>
								<div className="eAboutList_item"><SVG icon="icon_teams" /> HOUSE_NAME</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bUserDataColumn">

					<div className="eUserDataColumn_wrap" id="jsSubPage">
						<div>
							<div className="bUserButtons">
								<div className="bButton">Send message</div>
								<div className="bButton">Invite to the house</div>
								<div className="bButton">Invite to an event</div>
							</div>


							<div className="bUserFullInfo">
								<div className="eUserFullInfo_block">
									<div className="eUserFullInfo_name">Winnings:</div>
									<div className="eUserFullInfo_text">value</div>
								</div>
							</div>

							<div className="bUserFullInfo">
								<div className="eUserFullInfo_block">
									<div className="eUserFullInfo_name">Events:</div>
									<div className="eUserFullInfo_text">value</div>
								</div>
							</div>


						</div>
					</div>
				</div>
			</div>
		)
	}
});


module.exports = LeanerView;
