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
    getPointsByStudent: function (playerId) {
        var self = this,
            binding = self.getDefaultBinding(),
            points =  binding.sub('points'),
            filtered = points.get().filter(function (point) {
                return point.get('studentId') === playerId;
            });

        return filtered.count();
    },
    addPoint: function (order, playerId) {
        var self = this,
            binding = self.getDefaultBinding(),
            type = binding.get('event.type'),
            participant = binding.sub(['participants', order]),
            pointsBinding =  binding.sub('points');

        pointsBinding.update(function (points) {
            return points.push(Immutable.fromJS({
                studentId: playerId,
                participantId: participant.get('id'),
                sportId: binding.get('model.sportId'),
                eventId: binding.get('model.id')
            }));
        });
    },
    removePoint: function (order, playerId) {
        var self = this,
            binding = self.getDefaultBinding(),
            type = binding.get('event.type'),
            pointsBinding =  binding.sub('points');

        pointsBinding.update(function (points) {
            var index = points.findLastIndex(function (point) {
                return point.get('studentId') === playerId;
            });

            if (index !== -1) {
                return points.filter(function (point, index) {
                    return index !== index;
                });
            } else {
                return points;
            }
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
                <If condition={binding.get('mode') !== 'finish' && isOwner}>
                    <img className="ePlayer_avatar" src={player.get('avatar')} alt={player.get('name')} title={player.get('name')} />
                </If>
                <If condition={binding.get('mode') === 'finish' && isOwner}>
                    <div>
                        <span className="ePlayer_minus" onClick={self.removePoint.bind(null, order, player.get('id'))}>
                            <SVG icon="icon_minus" />
                        </span>
                        <span className="ePlayer_score">{self.getPointsByStudent(player.get('id'))}</span>
                    </div>
                </If>
				<span className="ePlayer_name"><span>{player.get('firstName')}</span> <span>{player.get('lastName')}</span></span>
				<If condition={binding.get('mode') === 'edit' && isOwner}>
					<span className="ePlayer_remove" onClick={self.removePlayer.bind(null, order, player.get('id'))}>
						<SVG icon="icon_trash" />
					</span>
				</If>
                <If condition={binding.get('mode') === 'finish' && isOwner}>
                    <span className="ePlayer_plus" onClick={self.addPoint.bind(null, order, player.get('id'))}>
                        <SVG icon="icon_plus" />
                    </span>
                </If>
			</div>;
		}).toArray() : null;
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
