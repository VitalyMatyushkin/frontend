const	React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty'),

		InvitesMixin			= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventTeamsView			= require('./event_teams_view');

const EventTeams = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			viewPlayers: {
				players: []
			},
			isSync: false
		});
	},
	/* HELPERS */
	getViewPlayersBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:					binding.sub('viewPlayers'),
			event:						self.getBinding('event'),
			points:						self.getBinding('points'),
			mode:						self.getBinding('mode'),
			individualScoreAvailable:	self.getBinding('individualScoreAvailable'),
			isSync:						binding.sub('isSync')
		};
	},
	render: function() {
		const self = this;

		return (
			<EventTeamsView binding={self.getViewPlayersBinding()}/>
		);
	}
});

module.exports = EventTeams;