const React = require('react');

const PlayerSubColumn = React.createClass({
	propTypes: {
		isChecked:				React.PropTypes.bool,
		handleClickPlayerSub:	React.PropTypes.func.isRequired
	},

	isChecked: function() {
		return typeof this.props.isChecked !== 'undefined' ? this.props.isChecked : false;
	},
	handleCheckBoxClick: function(eventDescriptor) {
		this.props.handleClickPlayerSub(eventDescriptor.target.checked);
		eventDescriptor.stopPropagation();
	},
	handleClick: function(eventDescriptor) {
		eventDescriptor.stopPropagation();
	},

	render: function() {
		return (
			<td
				className	= "col-md-1"
				onClick		= { this.handleClick }
			>
				<input	onChange	= { this.handleCheckBoxClick }
						id  		= "sub_checkbox"
						type		= "checkbox"
						checked		= { this.isChecked() }
				/>
			</td>
		);
	}
});

module.exports = PlayerSubColumn;