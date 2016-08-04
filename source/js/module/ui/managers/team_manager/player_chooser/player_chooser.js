const	React			= require('react'),
		PlayersList		= require('./players_list'),
		PlayerSearchBox	= require('./player_search_box');

const	PlayerChooser	= React.createClass({
	propTypes: {
		students:					React.PropTypes.array.isRequired,
		handleChangeSearchText:		React.PropTypes.func.isRequired,
		handleClickStudent:			React.PropTypes.func.isRequired,
		handleClickAddTeamButton:	React.PropTypes.func.isRequired
	},
	render: function() {
		const self = this;

		return (
			<div className="eTeamWrapper_autocompleteWrapper">
				<div className="bPlayerChooser">
					<PlayerSearchBox handleChangeSearchText={self.props.handleChangeSearchText}/>
					<PlayersList	players={self.props.students}
									handleClickStudent={self.props.handleClickStudent}
					/>
				</div>
				<div	className="ePlayerChooser_addToTeamButton"
						onClick={self.props.handleClickAddTeamButton}
				>
				</div>
			</div>
		);
	}
});

module.exports = PlayerChooser;