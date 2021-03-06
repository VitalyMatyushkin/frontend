const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	SchoolUnionTeamView	= require('./school_union_team_view'),
		InvitesMixin		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper');

const PublicEventTeams = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			viewPlayers: {
				players: []
			},
			isSync: false
		});
	},
	componentWillMount: function() {
		this.setPlayers();
	},
	componentDidMount: function(){
		this.addBindingListener(this.getBinding('event'), this.setPlayers);
	},
	/* HELPERS */
	/**
	 * Load team players from server
	 * @private
	 */
	setPlayers: function() {
		const event = this.getBinding('event').toJS();

		if(event && TeamHelper.isNonTeamSport(event)) {
			this.setNonTeamPlayersToBinding(event);
		} else {
			this.setTeamPlayersFromEventToBinding(event);
		}
	},
	setNonTeamPlayersToBinding: function(event) {
		const binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('viewPlayers.players',	Immutable.fromJS(event.individualsData))
			.set('isSync',				Immutable.fromJS(true))
			.commit();
	},
	setTeamPlayersFromEventToBinding: function(event) {
		const binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('viewPlayers.players',	Immutable.fromJS(event.teamsData.map(tp => tp.players)))
			.set('isSync',				Immutable.fromJS(true))
			.commit();
	},
	getViewPlayersBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default						: binding.sub('viewPlayers'),
			event						: this.getBinding('event'),
			points						: this.getBinding('points'),
			mode						: this.getBinding('mode'),
			individualScoreAvailable	: this.getBinding('individualScoreAvailable'),
			isSync						: binding.sub('isSync')
		};
	},
	render: function() {
		return (
			<SchoolUnionTeamView binding={this.getViewPlayersBinding()}/>
		);
	}
});

module.exports = PublicEventTeams;