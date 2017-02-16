const React			= require('react');

const TeamErrorItem	= require('../../../../../../styles/ui/b_team_error_item.scss');

const ErrorItem = React.createClass({
	propTypes: {
		errorText: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<div className="bTeamErrorItem">
				{this.props.errorText}
			</div>
		);
	}
});

module.exports = ErrorItem;