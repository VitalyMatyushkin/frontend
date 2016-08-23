const   React           = require('react'),
        Sport           = require('module/ui/icons/sport_icon'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        ChallengeModel  = require('module/ui/challenges/challenge_model'),
        classNames      = require('classnames'),
        EventHelper     = require('module/helpers/eventHelper'),
        TeamHelper      = require('./../../ui/managers/helpers/team_helper'),
        DateHelper      = require('module/helpers/date_helper'),
        MoreartyHelper  = require('module/helpers/morearty_helper');

const ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    sameDay: function (d1, d2) {
        d1 = d1 instanceof Date ? d1 : new Date(d1);
        d2 = d2 instanceof Date ? d2 : new Date(d2);

        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
    onClickChallenge: function (eventId) {
        document.location.hash = 'event/' + eventId + '?tab=teams';
    },
    getSportIcon:function(sport){
        return <Sport name={sport} className="bIcon_invites" ></Sport>;
    },
    getEvents: function (date) {
        const   self    = this,
                binding = this.getDefaultBinding();

        let result = [];

        if(binding.toJS('sync')) {
            const eventsByDate = binding.get('models').filter(event => {
                return self.sameDay(
                    new Date(event.get('startTime')),
                    new Date(date));
            });

            result = eventsByDate.map(event => {
                const   activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
                        model           = new ChallengeModel(event.toJS(), activeSchoolId),
                        sportIcon       = self.getSportIcon(model.sport);

                return (
                    <div key={model.id} className="bChallenge" onClick={self.onClickChallenge.bind(null, model.id)}>
                        <span className="eChallenge_sport">{sportIcon}</span>
                        <span className="eChallenge_event" title={model.name}>{model.name}</span>
                        <div className="eChallenge_hours">{model.time}</div>
                        {self.renderGameTypeColumn(event.toJS(), model)}
                        <div className={classNames({eChallenge_results:true, mDone:model.played})}>{model.score}</div>
                    </div>
                );
            }).toArray();
        }

        return result;
    },
    renderGameTypeColumn: function(event, model) {
        const	self	= this;
        let		result	= null;

        if(EventHelper.isEventWithOneIndividualTeam(event)) {
            result = (
                <div className="eChallenge_in">
                    {"Individual Game"}
                </div>
            );
        } else {
            const   leftSideRivalName   = self._getRivalNameLeftSide(event, model.rivals),
                    rightSideRivalName  = self._getRivalNameRightSide(event, model.rivals);

            result = (
                <div className="eChallenge_in">
                    <span className="eChallenge_firstName" title={leftSideRivalName}>{leftSideRivalName}</span>
                    <p>vs</p>
                    <span className="eChallenge_secondName" title={rightSideRivalName}>{rightSideRivalName}</span>
                </div>
            );
        }

        return result;
    },
    _getRivalNameLeftSide: function(event, rivals) {
        const self = this;

        const   eventType       = event.eventType,
                participants    = event.teamsData,
                activeSchoolId  = MoreartyHelper.getActiveSchoolId(self);

        //if(TeamHelper.isNonTeamSport(event)) {
        //    switch (eventType) {
        //        case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
        //            const foundRival = rivals.find(r => r.id === activeSchoolId);
		//
        //            return foundRival ? foundRival.name : 'n/a';
        //        case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
        //            return rivals[0].name;
        //    }
        //} else if(
        //    eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        //    participants[0].schoolId === activeSchoolId
        //) {
        //    return rivals.find(rival => rival.id === participants[0].id).name;
        //} else if(
        //    eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        //    participants[1].schoolId === activeSchoolId
        //) {
        //    return rivals.find(rival => rival.id === participants[1].id).name;
        //} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
        //    return rivals.find(rival => rival.id === participants[0].id).name;
        //}

        if(TeamHelper.isNonTeamSport(event)) {
            switch (eventType) {
                case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
                    const foundRival = rivals.find(r => r.id === self.activeSchoolId);

                    return foundRival ? foundRival.name : 'n/a';
                case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
                    return rivals[0].name;
            }
        } else if(
            eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
            participants.length === 0
        ) {
            return 'n/a';
        } else if (
            eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
            participants.length === 1 &&
            participants[0].schoolId !== self.activeSchoolId
        ) {
            return 'n/a';
        } else if (
            eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
            participants[0].schoolId === self.activeSchoolId
        ) {
            return rivals.find(rival => rival.id === participants[0].id).name;
        } else if(
            eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
            participants[1].schoolId === self.activeSchoolId
        ) {
            return rivals.find(rival => rival.id === participants[1].id).name;
        } else if (
            participants.length === 1 &&
            eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        ) {
            return rivals.find(rival => rival.id === participants[0].id).name;
        } else if (
            (
                participants.length === 0 ||
                participants.length === 1
            ) &&
            eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        ) {
            return 'n/a';
        } else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
            return rivals.find(rival => rival.id === participants[0].id).name;
        }
    },
    _getRivalNameRightSide: function(event, rivals) {
        const self = this;

        const   eventType		= event.eventType,
                participants	= event.teamsData,
                activeSchoolId  = MoreartyHelper.getActiveSchoolId(self);

        //if(TeamHelper.isNonTeamSport(event)) {
        //    switch (eventType) {
        //        case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
        //            const foundRival = rivals.find(r => r.id !== activeSchoolId);
		//
        //            return foundRival ? foundRival.name : 'n/a';
        //        case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
        //            return rivals[1].name;
        //    }
        //} else if ( // if inter school event and participant[0] is our school
        //    participants.length > 1 &&
        //    eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        //    participants[0].schoolId !== activeSchoolId
        //) {
        //    return rivals.find(rival => rival.id === participants[0].id).name;
        //    // if inter school event and participant[1] is our school
        //} else if (
        //    participants.length > 1 &&
        //    eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        //    participants[1].schoolId !== activeSchoolId
        //) {
        //    return rivals.find(rival => rival.id === participants[1].id).name;
        //    // if inter school event and opponent school is not yet accept invitation
        //} else if(
        //    participants.length === 1 &&
        //    eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        //) {
        //    return rivals.find(rival => rival.id === event.invitedSchools[0].id).name;
        //    // if it isn't inter school event
        //} else if (
        //    participants.length > 1 &&
        //    eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        //) {
        //    return rivals.find(rival => rival.id === participants[1].id).name;
        //}

        if(TeamHelper.isNonTeamSport(event)) {
            switch (eventType) {
                case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
                    const foundRival = rivals.find(r => r.id !== self.activeSchoolId);

                    return foundRival ? foundRival.name : 'n/a';
                case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
                    return rivals[1].name;
            }
        } else if(
            eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
            participants.length === 0
        ) {
            return rivals.find(rival => rival.id === event.invitedSchools[0].id).name;
        } else if (// if inter school event and participant[0] is our school
        participants.length > 1 &&
        eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        participants[0].schoolId !== self.activeSchoolId
        ) {
            return rivals.find(rival => rival.id === participants[0].id).name;
        } else if (// if inter school event and participant[1] is our school
        participants.length > 1 &&
        eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        participants[1].schoolId !== self.activeSchoolId
        ) {
            return rivals.find(rival => rival.id === participants[1].id).name;
        } else if(// if inter school event and opponent school is not yet accept invitation
        participants.length === 1 &&
        eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        ) {
            return rivals.find(rival => rival.id === event.invitedSchools[0].id).name;
        } else if (// if it isn't inter school event
        participants.length > 1 &&
        eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        ) {
            return rivals.find(rival => rival.id === participants[1].id).name;
        } else if (
            (
                participants.length === 0 ||
                participants.length === 1
            ) &&
            eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
        ) {
            return 'n/a';
        }

    },
    getDates: function () {
        const   self    = this,
                binding = self.getDefaultBinding();

        let result;

        if(binding.toJS('sync')) {
            const dates = binding.get('models').reduce(function (memo, val) {
                var date = Date.parse(val.get('startTime')),
                    any = memo.some(function (d) {
                        return self.sameDay(date, d);
                    });

                if (!any) {
                    memo = memo.push(date);
                }

                return memo;
            }, Immutable.List());

            if(dates.count() === 0) {
                result = (
                    <div className="eUserFullInfo_block">No fixtures to report on this child</div>
                );
            } else {
                result = dates.sort().map((datetime,dtIndex) => {
                    const date = DateHelper.getDate(datetime);

                    return (
                        <div key={dtIndex} className="bChallengeDate">
                            <div className="eChallengeDate_wrap">
                                <div className="eChallengeDate_date">{date}</div>
                                <div className="eChallengeDate_list">{self.getEvents(datetime)}</div>
                            </div>
                        </div>
                    );
                }).toArray();
            }
        }

        return result;
    },
	render: function () {
        const   self = this,
                challenges = self.getDates();
		return (
            <div>
                <div className="bChallenges">
                    <div className="eChallenge_title">
                        <span className="eChallengeDate_date">Date</span>
                        <div className="bChallenge mTitle">
                            <span className="eChallenge_sport">Sport</span>
                            <span className="eChallenge_event">Event Name</span>
                            <span className="eChallenge_hours">Time</span>
                            <span className="eChallenge_in">Game Type</span>
                            <span className="eChallenge_results">Score</span>
                        </div>
                    </div>
                    {challenges}
                </div>
            </div>
        );
	}
});


module.exports = ChallengesView;
