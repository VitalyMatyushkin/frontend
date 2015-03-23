var If = require('module/ui/if/if'),
	SVG = require('module/ui/svg'),
	InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
	AutocompleteTeam = require('module/ui/managers/autocompleteTeam'),
	EventTeams;

EventTeams = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	removePlayer: function (order, playerId) {
		var self = this,
			binding = self.getDefaultBinding(),
			players = binding.sub(['players', order]);

		players.update(function (data) {
			return data.filter(function (model) {
				return model.get('id') !== playerId;
			});
		});
	},
	getPlayersByTeamOrder: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('event.type'),
			participant = binding.sub(['participants', order]),
			players = binding.get(['players', order]),
			activeSchoolId = self.getActiveSchoolId(),
			isOwner = type === 'inter-schools' ? participant.get('schoolId') === activeSchoolId : true;

		return players ? players.map(function (player) {
			return <div className="bPlayer mMini">
				<img className="ePlayer_avatar" src={player.get('avatar')} alt={player.get('name')} title={player.get('name')} />
				<span className="ePlayer_name"><span>{player.get('firstName')}</span> <span>{player.get('lastName')}</span></span>
				<If condition={binding.get('mode') === 'edit' && isOwner}>
					<span className="ePlayer_remove" onClick={self.removePlayer.bind(null, order, player.get('id'))}>
						<SVG icon="icon_trash" />
					</span>
				</If>
			</div>;
		}) : null;
	},
	getAutoComplete: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('event.type'),
			activeSchoolId = self.getActiveSchoolId(),
			isOwner = type === 'inter-schools' ?  binding.get(['participants', order, 'schoolId']) === activeSchoolId : true,
			completeBinding = {
				default: binding,
				rival: binding.sub(['participants', order]),
				players: binding.sub(['players', order])
			};

		return isOwner && binding.get('mode') === 'edit' ? <AutocompleteTeam binding={completeBinding} /> : null;
	},
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
			rivals = binding.get('rivals');

		return <div className="bEventTeams">
			<div className="bEventTeams_team">
				{self.getAutoComplete(0)}
				{self.getPlayersByTeamOrder(0)}
			</div>
			<div className="bEventTeams_team">
				<If condition={binding.get('participants').count() > 1}>
					<div>
						{self.getAutoComplete(1)}
						{self.getPlayersByTeamOrder(1)}
					</div>
				</If>
				<If condition={binding.get('participants').count() === 1}>
					<div>opponent waiting...</div>
				</If>
			</div>
        </div>;
	}
});


module.exports = EventTeams;
