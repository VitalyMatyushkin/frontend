const React = require('react');

const PlayerIsCaptainColumn = React.createClass({
	propTypes: {
		isChecked:					React.PropTypes.bool,
		handleClickPlayerIsCaptain:	React.PropTypes.func.isRequired
	},

	isChecked: function() {
		return typeof this.props.isChecked !== 'undefined' ? this.props.isChecked : false;
	},
	handleCheckBoxClick: function(eventDescriptor) {
		this.props.handleClickPlayerIsCaptain(eventDescriptor.target.checked);
		eventDescriptor.stopPropagation();
	},
	handleClick: function(eventDescriptor) {
		eventDescriptor.stopPropagation();
	},

	render: function() {
		return (
			<td className="col-md-1">
				<input	onChange	= { this.handleCheckBoxClick }
						id 			= "captain_checkbox"
						type		= "checkbox"
						checked		= { this.isChecked() }
				/>
			</td>
		);
	}
});

module.exports = PlayerIsCaptainColumn;