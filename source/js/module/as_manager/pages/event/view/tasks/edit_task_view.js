const	React					= require('react'),

		PencilButton			= require('../../../../../ui/pencil_button'),
		CrossButton				= require('../../../../../ui/cross_button'),
		MultiselectDropdown		= require('../../../../../ui/multiselect-dropdown/multiselect-dropdown'),
		Button					= require('../../../../../ui/button/button'),
		EditTaskViewCssStyle	= require('../../../../../../../styles/ui/b_edit_task_view.scss');

const EditEditTaskView = React.createClass({
	propTypes: {
		task		: React.PropTypes.array.isRequired,
		players		: React.PropTypes.array.isRequired
	},
	componentWillMount: function() {
		this.setState({
			selectedPlayers	: this.convertPlayersToMultiselectFormat(this.props.task.players),
			text			: this.props.task.text
		});
	},
	getInitialState: function() {
		return {
			selectedPlayers	: [],
			text			: undefined
		};
	},
	convertPlayersToMultiselectFormat: function(players) {
		return players.map(p => {
			p.value = `${p.firstName} ${p.lastName}`;
			return p;
		});
	},
	getPlayers: function(players) {
		return this.convertPlayersToMultiselectFormat(players);
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
			selectedPlayers.push(selectedPlayer.id);
		}

		this.setState({
			selectedPlayers: selectedPlayers
		});
	},
	render: function() {
		return (
			<div className="bEditTaskView">
				<div className="eEditTaskView_header">
					Change task
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
						<MultiselectDropdown	items			= {this.getPlayers(this.props.players)}
												selectedItems	= {this.state.selectedPlayers}
												handleClickItem	= {this.handleClickPlayer}
						/>
					</div>
					<Button text={'Save'}/>
				</div>
			</div>
		);
	}
});

module.exports = EditEditTaskView;