const	If 				= require('module/ui/if/if'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		Sport           = require('module/ui/icons/sport_icon'),
		React			= require('react');

const EventRival = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPic: function (order) {
		const	self = this,
				binding = self.getDefaultBinding(),
				eventType = binding.get('model.eventType'),
				participant = binding.sub(['participants', order]);
		let		pic = null;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(order === 0) {
					pic = binding.get('model.inviterSchool.pic');
				} else if(order === 1) {
					pic = binding.get('model.invitedSchool.pic');
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				pic = participant.get('house.pic');
				break;
		};

		return (
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['internal'] ?
				<img	className="eEventRivals_pic"
						src={pic}
						alt={participant.get('name')}
						title={participant.get('name')}
				/>
				: null
		);
	},
	getName: function (order) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				eventType	= binding.get('model.eventType'),
				participant	= binding.sub(['participants', order]);
		let		name		= null;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(order === 0) {
					name = binding.get('model.inviterSchool.name');
				} else if(order === 1) {
					name = binding.get('model.invitedSchool.name');
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				name = participant.get('house.name');
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				name = participant.get('name');
				break;
		}

		return name;
	},
	getSportIcon:function(sport){
		return <Sport name={sport} className="bIcon_invites" ></Sport>;
	},
	getCountPoint: function (order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		let points;

		if(event.result) {
			const eventSummary = EventHelper.getTeamsSummaryByEventResult(event.result);

			// get event result by team id
			const teamId = binding.get(`participants.${order}.id`);
			points = eventSummary[teamId];
			if(!points && self._isTeamHaveZeroPoints(teamId, event, eventSummary)) {
				// event doesn't has points in resultObject if team has zero points in event
				points = 0;
			}
		}

		return points;
	},
	/**
	 * Return TRUE if team has zero points in event
	 * @private
	 */
	_isTeamHaveZeroPoints: function(teamId, event, eventSummary) {
		return !eventSummary[teamId] && event.status === EventHelper.EVENT_STATUS.FINISHED;
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivals		= binding.get('rivals'),
				sportName	= binding.get('sport.name'),
				sportIcon	= self.getSportIcon(sportName),
				eventType	= EventHelper.serverEventTypeToClientEventTypeMapping[binding.get('model.eventType')];

		return (
				<div className="bEventInfo">
					<div className="bEventRivals">
						<div className="bEventRival">
							<div className="eEventRival_rival">{self.getPic(0)}</div>
							<div className="eEventRival_name" title={self.getName(0)}>{self.getName(0)}</div>
						</div>
						<div className="bEventResult">
							<If condition={binding.get('model.status') === "NOT_FINISHED" && binding.get('mode') !== 'closing'}>
								<div className="eEventResult_score">
									<div className="eEventResult_point">
										<span>-</span>
										<span className="eEventResult_colon"> : </span>
										<span>-</span>
									</div>
								</div>
							</If>
							<If condition={binding.get('model.status') === "FINISHED" || binding.get('mode') === 'closing'}>
								<div className="eEventResult_score">
									<div className="eEventResult_point">
										<span>{self.getCountPoint(0)}</span>
										<span className="eEventResult_colon"> : </span>
										<span>{self.getCountPoint(1)}</span>
									</div>
								</div>
							</If>

							<div className="eEventSport">
								<span className="eEventSport_icon">{sportIcon}</span>
								<span className="eEventSport_name">{sportName}</span>
							</div>
						</div>
						<div className="bEventRival">
							<div className="eEventRival_rival">{self.getPic(1)}</div>
							<div className="eEventRival_name" title={self.getName(1)}>{self.getName(1)}</div>
						</div>
					</div>
					<div className="eEventInfo_type">
						{eventType}
					</div>
				</div>
		);
	}
});


module.exports = EventRival;
