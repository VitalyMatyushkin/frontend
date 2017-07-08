// Main components
const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		Button							= require('module/ui/button/button');

const	InterSchoolsMultipartyRivals	= require('module/ui/managers/rival_chooser/inter_schools_multiparty_rivals'),
		DefaultRivals					= require('module/ui/managers/rival_chooser/default_rivals');

// Helpers
const	EventHelper						= require('module/helpers/eventHelper');

// Styles
const	TeamChooserStyles				= require('../../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const RivalChooser = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isShowRivals			: React.PropTypes.bool,
		isShowAddTeamButton		: React.PropTypes.bool,
		handleClickAddTeam		: React.PropTypes.func,
		indexOfDisplayingRival	: React.PropTypes.number
	},
	handleChooseRival: function(rivalIndex) {
		this.getBinding('selectedRivalIndex').set(Immutable.fromJS(rivalIndex));
	},
	getRivals: function () {
		const event = this.getDefaultBinding().toJS('model');

		if(EventHelper.isInterSchoolsEvent(event) && event.sportModel.multiparty) {
			return (
				<InterSchoolsMultipartyRivals
					binding					= { this.getBinding() }
					isShowRivals			= { this.props.isShowRivals }
					isShowAddTeamButton		= { this.props.isShowAddTeamButton }
					indexOfDisplayingRival	= { this.props.indexOfDisplayingRival }
					handleClickAddTeam		= { this.props.handleClickAddTeam }
					handleChooseRival		= { this.handleChooseRival }
				/>
			);
		} else {
			return (
				<DefaultRivals
					binding					= { this.getBinding() }
					isShowRivals			= { this.props.isShowRivals }
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