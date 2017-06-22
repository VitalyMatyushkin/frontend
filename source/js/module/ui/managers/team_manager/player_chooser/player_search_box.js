const React = require('react');

const PlayerSearchBox = React.createClass({
	propTypes: {
		handleChangeSearchText:	React.PropTypes.func.isRequired
	},
	handleChangeSearchText: function(eventDescriptor) {
		const self = this;

		self.props.handleChangeSearchText(eventDescriptor.target.value);
	},
	handleKeyPress: function(eventDescriptor) {
		const self = this;

		if (eventDescriptor.key === 'Enter') {
			self.props.handleChangeSearchText(eventDescriptor.target.value);
		}
	},
	render: function() {
		const self = this;

		return (
			<div className="ePlayerChooser_playerSearchBox">
				<input	className	="ePlayerChooser_playerSearchBoxInput"
						id          ="searchPlayer_input"
						placeholder	="Enter student name"
						onChange	={self.handleChangeSearchText}
						onKeyPress	={self.handleKeyPress}
				/>
			</div>
		);
	}
});

module.exports = PlayerSearchBox;