const	React				= require('react');

const	{ PlayersList }		= require('module/ui/managers/team_manager/children_booking_booked_children_player_chooser/players_list'),
		PlayerSearchBox		= require('module/ui/managers/team_manager/player_chooser_components/player_search_box'),
		AddPlayerTeamButton	= require('module/ui/managers/team_manager/player_chooser_components/add_player_team_button');

const	{ If }				= require('module/ui/if/if'),
		Loader				= require('module/ui/loader');

const ChildrenBookingBookedChildrenPlayerChooser = React.createClass({
	propTypes: {
		PlayerChoosersTabsModel:	React.PropTypes.object.isRequired,
		students:					React.PropTypes.array.isRequired,
		handleChangeSearchText:		React.PropTypes.func.isRequired,
		handleClickStudent:			React.PropTypes.func.isRequired,
		handleClickAddTeamButton:	React.PropTypes.func.isRequired,
		isSearch:					React.PropTypes.bool.isRequired,
		isAddTeamButtonBlocked:		React.PropTypes.bool.isRequired
	},
	render: function() {
		const isSearch = !!this.props.isSearch;

		return (
			<div>
				<div className="bPlayerChooser mChildrenBooking">
					<PlayerSearchBox handleChangeSearchText = { this.props.handleChangeSearchText } />
					<If condition = { isSearch } >
						<Loader condition = { true } />
					</If>
					<If condition = { !isSearch } >
						<PlayersList
							players				= { this.props.students }
							handleClickStudent	= { this.props.handleClickStudent }
						/>
					</If>
				</div>
				<AddPlayerTeamButton
					isAddTeamButtonBlocked		= { this.props.isAddTeamButtonBlocked }
					handleClickAddTeamButton	= { this.props.handleClickAddTeamButton }
				/>
			</div>
		);
	}
});

module.exports = ChildrenBookingBookedChildrenPlayerChooser;