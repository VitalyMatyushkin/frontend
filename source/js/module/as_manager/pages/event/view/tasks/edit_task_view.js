const	React					= require('react'),

		MultiselectDropdown		= require('../../../../../ui/multiselect-dropdown/multiselect-dropdown'),
		Button					= require('../../../../../ui/button/button'),
		EditTaskViewCssStyle	= require('../../../../../../../styles/ui/b_edit_task_view.scss');

const EditTaskView = React.createClass({
	propTypes: {
		viewMode		: React.PropTypes.array.isRequired,
		task			: React.PropTypes.array.isRequired,
		players			: React.PropTypes.array.isRequired,
		handleClickSave	: React.PropTypes.func.isRequired
	},
	componentWillMount: function() {
		this.setState({
			selectedPlayers	: typeof this.props.task.assignees !== "undefined" ?
				this.convertPlayersToMultiselectFormat(this.props.task.assignees): [],
			text			: this.props.task.text
		});
	},
	getInitialState: function() {
		return {
			selectedPlayers	: [],
			text			: undefined
		};
	},
	getHeaderText: function() {
		switch (this.props.viewMode) {
			case "EDIT":
				return "Change task";
			case "ADD":
				return "Add task";
		}
	},
	convertPlayersToMultiselectFormat: function(players) {
		return players.map(p => {
			p.id = p.userId + p.permissionId;
			p.value = `${p.firstName} ${p.lastName}`;
			return p;
		});
	},
	getPlayersForMultiselect: function(players) {
		return typeof players !== "undefined" ? this.convertPlayersToMultiselectFormat(players) : [];
	},
	handleChangeText: function(eventDescriptor) {
		this.setState({
			text: eventDescriptor.target.value
		});
	},
	handleClickPlayer: function(selectedPlayer) {
		const selectedPlayers = this.state.selectedPlayers;

		const foundSelectedPlayerIndex = selectedPlayers.findIndex(player => player.id === selectedPlayer.id);

		if(foundSelectedPlayerIndex !== -1) {
			selectedPlayers.splice(foundSelectedPlayerIndex, 1);
		} else {
			selectedPlayers.push(selectedPlayer);
		}

		this.setState({
			selectedPlayers: selectedPlayers
		});
	},
	handleClickSave: function() {
		this.props.handleClickSave(
			{
				text			: this.state.text,
				selectedPlayers	: this.state.selectedPlayers
			}
		);
	},
	render: function() {
		return (
			<div className="bEditTaskView">
				<div className="eEditTaskView_header">
					{this.getHeaderText()}
				</div>
				<div className="eEditTaskView_body">
					<div className="eEditTaskView_descriptionTextFieldLabel">
						Task: description
					</div>
					<textarea	className	= "eEditTaskView_descriptionTextField"
								placeholder	= "Description"
								onChange	= {this.handleChangeText}
					>
						{this.props.task.text}
					</textarea>
				</div>
				<div className="eEditTaskView_footer">
					<div className="eEditTaskView_multiselectWrapper">
						<MultiselectDropdown	items			= {this.getPlayersForMultiselect(this.props.players)}
												selectedItems	= {this.state.selectedPlayers}
												handleClickItem	= {this.handleClickPlayer}
						/>
					</div>
					<Button	extraStyleClasses	= {'mSaveTask'}
							onClick				= {this.handleClickSave}
							text				= {'Save'}
					/>
				</div>
			</div>
		);
	}
});

module.exports = EditTaskView;