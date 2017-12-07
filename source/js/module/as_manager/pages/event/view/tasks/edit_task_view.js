const	React					= require('react'),

		{If}					= require('../../../../../ui/if/if'),
		MultiselectDropdown		= require('module/ui/multiselect-dropdown/multiselect_dropdown'),
		{Button}				= require('../../../../../ui/button/button'),
		EditTaskViewCssStyle	= require('../../../../../../../styles/ui/b_edit_task_view.scss');

const EditTaskView = React.createClass({
	propTypes: {
		tasksCount			: React.PropTypes.number.isRequired,
		viewMode			: React.PropTypes.string.isRequired,
		task				: React.PropTypes.object.isRequired,
		players				: React.PropTypes.array.isRequired,
		handleClickSave		: React.PropTypes.func.isRequired,
		handleClickCancel	: React.PropTypes.func.isRequired
	},
	componentWillMount: function() {
		this.setState({
			selectedPlayers			: typeof this.props.task.assignees !== "undefined" ?
				this.convertPlayersToMultiselectFormat(this.props.task.assignees): [],
			text					: this.props.task.text,
			isShowValidationText	: false
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
				return "Change job";
			case "ADD":
				return "Add job";
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
		if(typeof this.state.text !== 'undefined' && this.state.text !== "") {
			this.props.handleClickSave(
				{
					text			: this.state.text,
					selectedPlayers	: this.state.selectedPlayers
				}
			);
		}
	},
	onFocus: function() {
		this.setState({
			isShowValidationText: false
		});
	},
	onBlur: function() {
		this.setState({
			isShowValidationText: this.state.text === "" || typeof this.state.text === 'undefined'
		});
	},
	render: function() {
		return (
			<div className="bEditTaskView">
				<div className="eEditTaskView_header">
					{this.getHeaderText()}
				</div>
				<div className="eEditTaskView_body">
					<div className="eEditTaskView_descriptionTextFieldLabel">
						Job description
					</div>
					<textarea	className	= "eEditTaskView_descriptionTextField"
								placeholder	= "Description"
								value		= {this.state.text}
								onChange	= {this.handleChangeText}
								onFocus		= {this.onFocus}
								onBlur		= {this.onBlur}
					/>
					<If condition={this.state.isShowValidationText}>
						<p className="eEditTaskView_validationText">
							Please enter job description
						</p>
					</If>
				</div>
				<div className="eEditTaskView_footer">
					<div className="eEditTaskView_multiselectWrapper">
						<MultiselectDropdown	items			= {this.getPlayersForMultiselect(this.props.players)}
												selectedItems	= {this.state.selectedPlayers}
												handleClickItem	= {this.handleClickPlayer}
						/>
					</div>
					<If condition={this.props.tasksCount > 0}>
						<div	className	= "bButton mCancel mMarginRightFixed"
								onClick		= {this.props.handleClickCancel}
						>
							Cancel
						</div>
					</If>
					<div	className	= "bButton"
							onClick		= {this.handleClickSave}
					>
						Save
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EditTaskView;