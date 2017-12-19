const React			= require('react');

const TeamErrorItem	= require('../../../../../../styles/ui/b_team_error_item.scss');

const ErrorItem = React.createClass({
	propTypes: {
		errorText: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<tr>
				<th scope="row">
					{ this.props.number }
				</th>
				<td className="bTeamErrorItem col-md-8">
					{this.props.errorText}
				</td>
				<td className="col-md-4">
				</td>
			</tr>
		);
	}
});

module.exports = ErrorItem;