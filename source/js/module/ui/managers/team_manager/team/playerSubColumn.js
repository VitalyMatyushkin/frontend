const React = require('react');

const PlayerSubColumn = React.createClass({
	propTypes: {
		isChecked:				React.PropTypes.bool.isRequired,
		handleClickPlayerSub:	React.PropTypes.func.isRequired
	},
	handleCheckBoxClick: function(eventDescriptor) {
		const self = this;

		self.props.handleClickPlayerSub(eventDescriptor.target.checked);
	},
	render: function() {
		const self = this;

		return (
			<div className="eTeam_playerItem mSub">
				<input	onClick={self.handleCheckBoxClick}
						type="checkbox"
						checked={self.props.isChecked}
				/>
			</div>
		);
	}
});

module.exports = PlayerSubColumn;