const	React				= require('react');

const	PlayersList			= require('./players_list'),
		PlayerSearchBox		= require('./player_search_box'),
		AddPlayerTeamButton	= require('./add_player_team_button');

const{If}				= require('../../../if/if'),
		Loader				= require('./../../../loader');

const PlayerChooser = React.createClass({
	propTypes: {
		students:					React.PropTypes.array.isRequired,
		handleChangeSearchText:		React.PropTypes.func.isRequired,
		handleClickStudent:			React.PropTypes.func.isRequired,
		handleClickAddTeamButton:	React.PropTypes.func.isRequired,
		isSearch:					React.PropTypes.bool.isRequired,
		isAddTeamButtonBlocked:		React.PropTypes.bool.isRequired
	},
	render: function() {
		const self = this;

		const isSearch = !!this.props.isSearch;

		return (
			<div className="eTeamWrapper_autocompleteWrapper">
				<div className="bPlayerChooser">
					<PlayerSearchBox handleChangeSearchText={self.props.handleChangeSearchText}/>
					<If condition={isSearch}>
						<Loader condition={true}/>
					</If>
					<If condition={!isSearch}>
						<PlayersList	players				= { self.props.students }
										handleClickStudent	= { self.props.handleClickStudent }
						/>
					</If>
				</div>
				<AddPlayerTeamButton	isAddTeamButtonBlocked		={ this.props.isAddTeamButtonBlocked }
										handleClickAddTeamButton	={ this.props.handleClickAddTeamButton }
				/>
			</div>
		);
	}
});

module.exports = PlayerChooser;