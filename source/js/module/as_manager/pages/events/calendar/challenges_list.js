const   React           = require('react'),
        InvitesMixin    = require('module/as_manager/pages/invites/mixins/invites_mixin'),
        Sport           = require('module/ui/icons/sport_icon'),

ChallengesList = React.createClass({
    mixins: [Morearty.Mixin, InvitesMixin],
    getRivalName: function(event, order) {
        var self = this,
            binding = self.getDefaultBinding(),
            eventIndex = binding.get('models').findIndex(function (model) {
                return model.get('id') === event.get('id');
            }),
            eventBinding = binding.sub(['models', eventIndex]),
            type = event.get('type'),
            played = !!event.get('resultId'),
            rivalName = null,
            participantBinding = eventBinding.sub(['participants', order]),
            eventResult = played ? eventBinding.toJS('result.summary.byTeams') : null;


        if (type === 'internal') {
            rivalName = eventBinding.get(['participants', order, 'name']);
            if (played && rivalName && eventResult) {
                rivalName += '[' + eventResult[participantBinding.get('id')] + ']';
            }
        } else if (type === 'houses') {
            rivalName = eventBinding.get(['participants', order, 'house', 'name']);
            if (played && rivalName && eventResult) {
                rivalName += '[' + eventResult[participantBinding.get('id')] + ']';
            }
        } else {
            rivalName = eventBinding.get(['participants', order, 'school', 'name']);

            if (played && rivalName && eventResult) {
                rivalName += '[' + eventResult[participantBinding.get('id')] + ']';
            } else if (!rivalName) {
                rivalName = eventBinding.get(['invites', 0, 'guest', 'name']);
            }
        }

        return rivalName;
    },
    onClickEvent: function(eventId) {
        document.location.hash = 'event/' + eventId;
    },
    getSportIcon:function(sport){
        return <Sport name={sport} className="bIcon_invites" ></Sport>;
    },
    getEvents: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            currentDate = binding.get('calendar.currentDate'),
			sync = binding.get('sync'),
            events = binding.get('models').filter(function (event) {
                var eventDate = new Date(event.get('startTime'));

                return eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear();
            });

        return events.count() ? events.map(function (event) {
            var eventDate = new Date(event.get('startTime')),
                hoverDay = binding.get('calendar.hoverDay') && binding.get('calendar.hoverDay').date,
                isHoverDay = hoverDay &&
                    hoverDay.getMonth() === eventDate.getMonth() &&
                    hoverDay.getDate() === eventDate.getDate(),
                stringDate = self.formatDate(event.get('startTime')),
                sport = self.getSportIcon(event.get('sport').get('name'));

            return <div key={'event-' + event.get('id')} className={isHoverDay ? 'eChallenge mActive' : 'eChallenge'} onClick={self.onClickEvent.bind(null, event.get('id'))}>
                <span className="eChallenge_sport">{sport}</span>
                <span className="eChallenge_date">{stringDate}</span>

                <div className="eChallenge_name">{event.get('name')}</div>
                <div className="eChallenge_rivals">
                    <span className="eChallenge_rivalName">{self.getRivalName(event, 0)}</span>
                    <span>vs</span>
                    <span className="eChallenge_rivalName">{self.getRivalName(event, 1)}</span>
                </div>
            </div>
        }).toArray() : <div className="eChallenge mNotFound">{sync ? "You haven't events on this month." : "Loading..."}</div>;
    },
    render: function() {
        var self = this,
            binding = this.getDefaultBinding();

        return <div className="eEvents_challenges">
            <div className="eChallenge_title">
                <span className="eChallenge_sport">Sport</span>
                <span className="eChallenge_date">Date</span>
                <span className="eChallenge_name">Event Name</span>
                <span className="eChallenge_rivals">Game Type</span>
            </div>
            {self.getEvents()}</div>
    }
});


module.exports = ChallengesList;
