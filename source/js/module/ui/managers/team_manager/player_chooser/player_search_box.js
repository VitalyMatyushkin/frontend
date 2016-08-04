const React = require('react');

const PlayerSearchBox = React.createClass({
	propTypes: {
		handleChangeSearchText:	React.PropTypes.func.isRequired
	},
	handleChangeSearchText: function(eventDescriptor) {
		const self = this;

		self.props.handleChangeSearchText(eventDescriptor.target.value);
	},
	render: function() {
		const self = this;

		return (
			<div className="ePlayerChooser_playerSearchBox">
				<input	className	="ePlayerChooser_playerSearchBoxInput"
						placeholder	="Enter student name"
						onChange	={self.handleChangeSearchText}
				/>
			</div>
		);
	}
});

module.exports = PlayerSearchBox;