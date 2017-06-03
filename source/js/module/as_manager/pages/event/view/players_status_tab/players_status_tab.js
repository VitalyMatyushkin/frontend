const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		Promise 			= require('bluebird'),
		PlayerStatusTable	= require('module/ui/player_status_table/player_status_table');

const Performance = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getPlayers: function() {
		return [
			{name: "Stanley Lemke", status: "Accept"},
			{name: "Johnson Brown", status: "Decline"}
		];
	},
	render: function() {
		return (
			<PlayerStatusTable
				players={this.getPlayers()}/>
		);
	}
});

module.exports = Performance;