const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	RouterView	= require('module/core/router'),
		Route		= require('module/core/route'),
		{SubMenu}	= require('module/ui/menu/sub_menu');

const	{ClubMainInfoEdit}                = require('module/as_manager/pages/clubs/clubs_main_info_edit'),
		{ClubChildrenEdit}				= require('module/as_manager/pages/clubs/clubs_children_edit/clubs_children_edit'),
		{ClubsChildrenBookingWrapper}	= require("module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_wrapper"),
		ActivateClub					= require('module/as_manager/pages/clubs/activate_club/activate_club');

const	LoaderStyle			= require('styles/ui/loader.scss');

const ClubEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount:function() {
		this.createAndSetMenuItems();
	},
	createAndSetMenuItems: function () {
		const binding = this.getDefaultBinding();

		const clubId = this.getCurrentClubId();

		const menuItems = [
			{
				href:	'/#clubs/clubList',
				name:	'← club list',
				key:	'back'
			},
			{
				href:	`/#clubs/editMainInfo?id=${clubId}`,
				name:	'Main info',
				key:	'Main_info',
				routes:	[`/#clubs/editMainInfo?id=${clubId}`]
			},
			{
				href:	`/#clubs/editChildren?id=${clubId}`,
				name:	'Students',
				key:	'Students',
				routes:	[`/#clubs/editChildren?id=${clubId}`]
			},
			{
				href:	`/#clubs/activateClub?id=${clubId}`,
				name:	'Activate club',
				key:	'Activate_club',
				routes:	[`/#clubs/activateClub?id=${clubId}`]
			}
		];

		binding.set('subMenuItems', Immutable.fromJS(menuItems));
	},
	getCurrentClubId: function () {
		return this.getMoreartyContext().getBinding().sub('routing.parameters').toJS().id;
	},
	render: function(){
		const binding = this.getDefaultBinding();
		const globalBinding = this.getMoreartyContext().getBinding();
		const clubId = this.getCurrentClubId();
		const activeSchoolId = this.props.activeSchoolId;

		return (
			<div>
				<SubMenu
					binding= {
						{
							default:		binding.sub('clubsEditRouting'),
							itemsBinding:	binding.sub('subMenuItems')
						}
					}
				/>
				<div className="bSchoolMaster">
					<RouterView
						routes	= { binding.sub('clubsEditRouting') }
						binding	= { globalBinding }
					>
						<Route
							path 			= "/clubs/editMainInfo"
							binding 		= { binding.sub('clubsMainInfoEdit') }
							component 		= { ClubMainInfoEdit }
							activeSchoolId	= { activeSchoolId }
							clubId			= { clubId }
						/>
						<Route
							path			= "/clubs/editChildren"
							binding			= { binding.sub('clubsChildrenEdit') }
							component		= { ClubChildrenEdit }
							activeSchoolId	= { activeSchoolId }
							clubId			= { clubId }
						/>
						<Route
							path			= "/clubs/activateClub"
							binding			= { binding.sub('activateClub') }
							component		= { ActivateClub }
							activeSchoolId	= { activeSchoolId }
							clubId			= { clubId }
						/>
						<Route
							path			= "/clubs/booking"
							binding			= { binding.sub('clubsBooking') }
							activeSchoolId	= { this.props.activeSchoolId }
							component		= { ClubsChildrenBookingWrapper }
							clubId			= { clubId }
						/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = ClubEditPage;