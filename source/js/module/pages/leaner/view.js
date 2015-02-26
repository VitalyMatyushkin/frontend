var LeanerView,
	SVG = require('module/ui/svg'),
	AboutMe = require('module/pages/leaner/view/about_me'),
	UserButtons = require('module/pages/leaner/view/user_buttons'),
	UserName = require('module/pages/leaner/view/user_name'),
	UserPhoto = require('module/pages/leaner/view/user_photo');

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
					<UserPhoto binding={binding} />

					<div className="eUserColumnData">
						<UserName binding={binding} />
						<AboutMe binding={binding} />
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
