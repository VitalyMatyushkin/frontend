const React = require('react');

const PlayerPositionColumn = React.createClass({
	propTypes: {
		selectedPositionId:			React.PropTypes.string,
		positions: 					React.PropTypes.array.isRequired,
		handleChangePlayerPosition:	React.PropTypes.func.isRequired
	},
	handleChangePlayerPosition: function(eventDescriptor) {
		const self = this;

		self.props.handleChangePlayerPosition(eventDescriptor.target.value);
	},
	renderPositions: function() {
		const self = this;

		return self.props.positions.map((position, index) =>
			<option key={`${position._id}`} value={position._id}>{position.name}</option>
		);
	},
	render: function() {
		const self = this;

		const selectedPositionId = self.props.selectedPositionId;

		return (
			<div className="eTeam_playerItem mSelector mPosition">
				<select	className	= "eTeam_positionSelector"
						id  		= "teamPosition_select"
						value		= {selectedPositionId}
						onChange	= {self.handleChangePlayerPosition}
				>
					<option	key		= "not-selected-player-position"
							value	= { undefined }
					>
						not selected
					</option>
					{ self.renderPositions() }
				</select>
			</div>
		);
	}
});

module.exports = PlayerPositionColumn;