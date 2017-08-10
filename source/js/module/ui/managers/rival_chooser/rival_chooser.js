// Main components
const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		Button							= require('module/ui/button/button');

const	InterSchoolsMultipartyRivals	= require('module/ui/managers/rival_chooser/inter_schools_multiparty_rivals'),
		DefaultRivals					= require('module/ui/managers/rival_chooser/default_rivals');

// Helpers
const	TeamHelper						= require('module/ui/managers/helpers/team_helper');

// Styles
const	TeamChooserStyles				= require('../../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const RivalChooser = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode			: React.PropTypes.bool,
		isShowAddTeamButton		: React.PropTypes.bool,
		handleClickAddTeam		: React.PropTypes.func,
		handleClickRemoveTeam	: React.PropTypes.func,
		indexOfDisplayingRival	: React.PropTypes.number
	},
	handleChooseRival: function(rivalId) {
		const rivalIndex = this.getBinding().rivals.toJS().findIndex(r => r.id === rivalId);

		this.getDefaultBinding().set('teamModeView.selectedRivalIndex', Immutable.fromJS(rivalIndex));
	},
	getRivals: function () {
		const event = this.getDefaultBinding().toJS('model');

		if(
			TeamHelper.isInterSchoolsEventForTeamSport(event) &&
			TeamHelper.isMultiparty(event)
		) {
			return (
				<InterSchoolsMultipartyRivals
					binding					= { this.getBinding() }
					isInviteMode			= { this.props.isInviteMode }
					indexOfDisplayingRival	= { this.props.indexOfDisplayingRival }
					handleClickAddTeam		= { this.props.handleClickAddTeam }
					handleClickRemoveTeam	= { this.props.handleClickRemoveTeam }
					handleChooseRival		= { this.handleChooseRival }
				/>
			);
		} else {
			return (
				<DefaultRivals
					binding					= { this.getBinding() }
					isShowAddTeamButton		= { this.props.isShowAddTeamButton }
					indexOfDisplayingRival	= { this.props.indexOfDisplayingRival }
					handleClickAddTeam		= { this.props.handleClickAddTeam }
					handleChooseRival		= { this.handleChooseRival }
				/>
			);
		}
	},
	renderAddRivalButton: function() {
		if(this.props.isShowAddTeamButton) {
			return (
				<Button
					text	= "Add team"
					onClick	= { this.props.handleClickAddTeam }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bRivalChooser">
				{ this.getRivals() }
				{ this.renderAddRivalButton() }
			</div>
		);
	}
});

module.exports = RivalChooser;