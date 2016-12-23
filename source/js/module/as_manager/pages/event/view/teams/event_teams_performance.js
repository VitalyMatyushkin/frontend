const	React						= require('react'),
		Morearty					= require('morearty'),

		EventTeamsPerformanceView	= require('./event_teams_performance_view');

const EventTeamsPerformance = React.createClass({
	mixins: [Morearty.Mixin],
	getPlayerPerformanceBinding: function() {
		const	binding	= this.getDefaultBinding();

		return {
			default:	binding.sub('viewPlayers'),
			event:		this.getBinding('event'),
			points:		this.getBinding('points'),
			mode:		this.getBinding('mode'),
			isSync:		binding.sub('isSync')
		};
	},
	render: function() {
		const self = this;

		return (
			<EventTeamsPerformanceView binding={self.getPlayerPerformanceBinding()} />
		);
	}
});

module.exports = EventTeamsPerformance;