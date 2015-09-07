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
    getPointsByStudent: function (playerId, participantId) {
        var self = this,
            binding = self.getDefaultBinding(),
            points =  binding.sub('points'),
            filtered = points.get().filter(function (point) {
                return point.get('studentId') === playerId && point.get('participantId') === participantId;
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
                eventId: binding.get('model.id'),
                score: 1
            }));
        });
    },
    removePoint: function (order, playerId) {
        var self = this,
            binding = self.getDefaultBinding(),
            type = binding.get('event.type'),
            pointsBinding =  binding.sub('points');

        pointsBinding.update(function (points) {
            var firstIndex = points.findLastIndex(function (point) {
                return point.get('studentId') === playerId;
            });

            if (firstIndex !== -1) {
                return points.filter(function (point, index) {
                    return index !== firstIndex;
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
            var isMale = player.get('user').get('gender') === 'male',
				points = self.getPointsByStudent(player.get('id'), participant.get('id')) || 0;

            return <div className="bPlayer mMini">
                <If condition={binding.get('mode') !== 'closing' && isOwner}>
                    <span className="ePlayer_gender">{isMale ? <SVG icon="icon_man" /> : <SVG icon="icon_woman" />}</span>
                </If>
				<div>
					{!binding.get('model.resultId') && binding.get('mode') === 'closing' ? <span className="ePlayer_minus" onClick={self.removePoint.bind(null, order, player.get('id'))}>
                            <SVG icon="icon_minus" />
                        </span> : null}
					<If condition={binding.get('model.resultId') || binding.get('mode') === 'closing'}>
						<span className="ePlayer_score">{points}</span>
					</If>
				</div>
				<span className="ePlayer_name"><span>{player.get('user').get('firstName')}</span> <span>{player.get('user').get('lastName')}</span></span>
				<If condition={binding.get('mode') === 'edit_squad' && isOwner}>
					<span className="ePlayer_remove" onClick={self.removePlayer.bind(null, order, player.get('id'))}>
						<SVG icon="icon_trash" />
					</span>
				</If>
                <If condition={binding.get('mode') === 'closing' && isOwner && !binding.get('model.resultId')}>
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

		return isOwner && binding.get('mode') === 'edit_squad' && !binding.get('model.resultId') ?
            <AutocompleteTeam binding={completeBinding} /> : null;
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
					<div>awaiting opponent...</div>
				</If>
			</div>
        </div>;
	}
});


module.exports = EventTeams;
