const	If 				= require('module/ui/if/if'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		Sport           = require('module/ui/icons/sport_icon'),
		Morearty		= require('morearty'),
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
				pic !== undefined ?
					<img className="eEventRivals_pic"
						 src={pic}
						 alt={participant.get('name')}
						 title={participant.get('name')}
						/>
					:
					<div className="eEventRivals_text">{participant.get('name')}</div>
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
		return <Sport name={sport} className="bIcon_invites" />;
	},
	getCountPoint: function (order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		let points = 0;

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
	_renderTeamLeftSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				participants	= binding.toJS('participants'),
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return self._renderTeamByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
		) {
			return self._renderTeamByOrder(1);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return self._renderTeamByOrder(0);
		}
	},
	_renderTeamRightSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				participants	= binding.toJS('participants'),
				activeSchoolId	= self.getActiveSchoolId();

		// if inter school event and participant[0] is our school
		if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return self._renderTeamByOrder(0);
		// if inter school event and participant[1] is our school
		} else if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return self._renderTeamByOrder(1);
		// if inter school event and opponent school is not yet accept invitation
		} else if(
			participants.length === 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._renderTeamByOrder(1);
		// if it isn't inter school event
		} else if (
			participants.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._renderTeamByOrder(1);
		}
	},
	_renderTeamByOrder: function(order) {
		const self = this;

		return (
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(order)}</div>
				<div className="eEventRival_name" title={self.getName(order)}>{self.getName(order)}</div>
			</div>
		);
	},
	_renderCountPointLeftSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				participants	= binding.toJS('participants'),
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return self.getCountPoint(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
		) {
			return self.getCountPoint(1);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return self.getCountPoint(0);
		}
	},
	_renderCountPointRightSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				participants	= binding.toJS('participants'),
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return self.getCountPoint(0);
		} else if (
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return self.getCountPoint(1);
		} else if (
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self.getCountPoint(1);
		}
	},
	_renderPoints: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(binding.toJS('model.status') === "NOT_FINISHED" && binding.toJS('mode') !== 'closing') {
			return (
				<div className="eEventResult_score">
					<div className="eEventResult_point">
						<span>-</span>
						<span className="eEventResult_colon"> : </span>
						<span>-</span>
					</div>
				</div>
			);
		} else if(binding.toJS('model.status') === "FINISHED" || binding.toJS('mode') === 'closing') {
			return (
				<div className="eEventResult_score">
					<div className="eEventResult_point">
						<span>{self._renderCountPointLeftSide(0)}</span>
						<span className="eEventResult_colon"> : </span>
						<span>{self._renderCountPointRightSide(1)}</span>
					</div>
				</div>
			);
		}
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
						{self._renderTeamLeftSide()}
						<div className="bEventResult">
							{self._renderPoints()}

							<div className="eEventSport">
								<span className="eEventSport_icon">{sportIcon}</span>
								<span className="eEventSport_name">{sportName}</span>
							</div>
						</div>
						{self._renderTeamRightSide()}
					</div>
					<div className="eEventInfo_type">
						{eventType}
					</div>
				</div>
		);
	}
});


module.exports = EventRival;
