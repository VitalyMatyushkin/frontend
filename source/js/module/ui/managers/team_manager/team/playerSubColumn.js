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
			<div className="eTeam_playerItem mSub" onClick={this.handleClick}>
				<input	onChange	= { this.handleCheckBoxClick }
						type		= "checkbox"
						checked		= { this.isChecked() }
				/>
			</div>
		);
	}
});

module.exports = PlayerSubColumn;