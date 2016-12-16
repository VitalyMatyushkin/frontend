const	InvitesMixin			= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventTeamsView			= require('./event_teams_view'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty');

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
	componentWillMount: function() {
		const self = this;

		self.loadPlayers();
		self._addListeners();
	},
	/* HELPERS */
	/**
	 * Add listeners to data
	 * @private
	 */
	_addListeners: function() {
		const self = this;

		self.addSyncListener();
	},
	/**
	 * Add listener to isSync flag.
	 * @private
	 */
	addSyncListener: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// reload players from server if isSync is false.
		binding.sub('isSync').addListener(descriptor => !descriptor.getCurrentValue() && self.loadPlayers());
	},
	/**
	 * Load team players from server
	 * @private
	 */
	loadPlayers: function() {
		const self = this;

		const event = self.getBinding('event').toJS();

		if(event && TeamHelper.isNonTeamSport(event)) {
			self.setNonTeamPlayersToBinding(event);
		} else {
			self.setTeamPlayersFromEventToBinding(event);
		}
	},
	setNonTeamPlayersToBinding: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.schoolEvent.get(
				{
					schoolId:	this.props.activeSchoolId,
					eventId:	event.id
				}
			)
			.then(event => {
				self.getBinding('event').set(
					'individualsData',
					Immutable.fromJS(event.individualsData)
				);
				binding
					.atomically()
					.set('viewPlayers.players',	Immutable.fromJS(event.individualsData))
					.set('isSync',				Immutable.fromJS(true))
					.commit();
			});
	},
	setTeamPlayersFromEventToBinding: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.schoolEvent.get(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			}
		).then(updEvent => {
			self.getBinding('event').set(
				'teamsData',
				Immutable.fromJS(updEvent.teamsData)
			);
			binding
				.atomically()
				.set('viewPlayers.players',	Immutable.fromJS(updEvent.teamsData.map(tp => tp.players)))
				.set('isSync',				Immutable.fromJS(true))
				.commit();
		});
	},
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
	getPlayerPerformanceBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:	binding.sub('viewPlayers'),
			event:		self.getBinding('event'),
			points:		self.getBinding('points'),
			mode:		self.getBinding('mode'),
			isSync:		binding.sub('isSync')
		};
	},
	render: function() {
		const self = this;

		return (
			<EventTeamsView binding={self.getViewPlayersBinding()} />
		);
	}
});

module.exports = EventTeams;