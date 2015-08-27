var OneEvent,
	DateTimeMixin = require('module/mixins/datetime'),
	If = require('module/ui/if/if'),
	EventAlbums = require('module/as_manager/pages/event/view/event_albums');

OneEvent = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	_getScore: function(participantId) {
		var self = this,
			binding = self.getDefaultBinding(),
			fixture = binding.toJS(),
			score;

		if (!participantId || !fixture) {
			return null;
		}

		if (fixture.result && fixture.result.summary && fixture.result.summary.byTeams) {
			score = fixture.result.summary.byTeams[participantId];
		}

		return (score === undefined ? '0' : score);
	},
	_getRivelNode: function(participan) {
		var self = this,
			pictures,
			color,
			name;

		if (!participan) {
			return '?';
		}

		pictures = participan.house && participan.house.pic || participan.school && participan.school.pic;
		name = participan.house && participan.house.name || participan.school && participan.school.name;


		// Внутреннее событие
		if (participan.name) {
			name = participan.name;
		}

		if (participan.house) {
			pictures = participan.house.pic;

			if (participan.house.colors && participan.house.colors[0]) {
				color = participan.house.colors[0];
			}
		}

		return (
			<div className="eOneEvent_playerData">
				<div className="eOneEvent_playerPic"><If condition={pictures}><img src={pictures}/></If><If condition={color && !pictures}><div className="eOneEvent_playerColor" style={{backgroundColor: color}}></div></If></div>
				<div className="eOneEvent_playerName">{name}</div>
				<div className="eOneEvent_result">{self._getScore(participan.id)}</div>
			</div>
		);

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			fixture = binding.toJS();

		if (!fixture || !fixture.participants) {
			return null;
		}

		return (
			<div className="bOneEvent">
				<div className="eOneEvent_name">Event results</div>

				<div className="eOneEvent_info">
					<div classNameName="eOneEvent_hours">Date and time: {self.getDateFromIso(fixture.startTime) + ' ' + self.getTimeFromIso(fixture.startTime)}</div>
					<div classNameName="eOneEvent_sportsName">Sport: {fixture.sport.name}</div>
				</div>

				<div className="eOneEvent_players">
					<div className="eOneEvent_player mLeft">
						{self._getRivelNode(fixture.participants[0])}
					</div>
					<div className="eOneEvent_player mRight">
						{self._getRivelNode(fixture.participants[1])}
					</div>
				</div>

				<If condition={fixture.album}>
					<div>
						<div className="eOneEvent_name">Event album</div>
						<EventAlbums binding={binding} />
					</div>
				</If>

			</div>
		)
	}
});


module.exports = OneEvent;