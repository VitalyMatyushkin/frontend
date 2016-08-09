const React = require('react');

const TeamName = React.createClass({
	propTypes: {
		handleChangeName:	React.PropTypes.func,
		name:				React.PropTypes.string
	},
	handleChangeTeamName: function(eventDescriptor) {
		const self = this;

		self.props.handleChangeName(eventDescriptor.target.value);
	},
	render: function() {
		const self = this;

		return (
			<div className="bTeamName">
				<div className="eTeamName_nameContainer">
					<input	className="eTeamName_nameForm"
							type={'text'}
							placeholder={'Enter team name'}
							onChange={self.handleChangeTeamName}
							value={self.props.name}
					/>
				</div>
			</div>
		);
	}
});

module.exports = TeamName;