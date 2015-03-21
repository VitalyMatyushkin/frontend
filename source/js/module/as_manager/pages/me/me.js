var UserPageView,
	SVG = require('module/ui/svg');

UserPageView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		var self = this;

		return (
		<div>
			<div className="bUserColumn">

				<div className="bUserPhoto mIsMe">
					<img src="https://pp.vk.me/c406618/v406618740/7dcc/OLE_m5fbo4M.jpg" className="eUserPhoto_image" />
				</div>

				<div className="eUserColumnData">
					<div>
						<div className="bUserName">Mikhail Superstar</div>
						<div className="bAboutList">
							<h6>About me</h6>

							<div className="eAboutList_item"><SVG icon="icon_home" /> London</div>
							<div className="eAboutList_item"><SVG icon="icon_user-tie" /> Forward</div>
							<div className="eAboutList_item"><SVG icon="icon_trophy" /> 17</div>
							<div className="eAboutList_item"><SVG icon="icon_teams" /> Spoonkers</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bUserDataColumn">
				<div className="bSubMenu mClearFix">
					<a href="/23/info" className="eSubMenu_item mActive">My profile</a>
					<a href="/23/gallery" className="eSubMenu_item">My team</a>
					<a href="/23/friends" className="eSubMenu_item">My events</a>
					<a href="/23/visitors" className="eSubMenu_item">My friends</a>
					<a href="/23/about" className="eSubMenu_item">Messages</a>
				</div>

				<div className="eUserDataColumn_wrap" id="jsSubPage">
					<div>
						<div className="bUserButtons">
							<div className="bButton">Send message</div>
							<div className="bButton">Add to friends</div>
							<div className="bButton">Invite to the team</div>
							<div className="bButton">Invite to an event</div>
						</div>


						<div className="bUserFullInfo">
							<div className="eUserFullInfo_block">
								<div className="eUserFullInfo_name">Проживание:</div>
								<div className="eUserFullInfo_text">живу с родителями</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
        )
	}
});

module.exports = UserPageView;



