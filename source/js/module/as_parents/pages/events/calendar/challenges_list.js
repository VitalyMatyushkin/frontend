var ChallengesList,
    React = require('react'),
    ReactDOM = require('reactDom'),
    InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin');

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
        return events.count() ? events.map(function (event, eventIndex) {
            var eventDate = new Date(event.get('startTime')),
                hoverDay = binding.get('calendar.hoverDay') && binding.get('calendar.hoverDay').date,
                isHoverDay = hoverDay &&
                    hoverDay.getMonth() === eventDate.getMonth() &&
                    hoverDay.getDate() === eventDate.getDate(),
                stringDate = self.formatDate(event.get('startTime'));

            return <div key={eventIndex} className={isHoverDay ? 'eChallenge eChallenge_all mActive' : 'eChallenge eChallenge_all'}>
                <div className="eChallenge_basic eChallenge_marginTopBottom">
                    <span className="eChallenge_date">{stringDate}</span>
                    <span className="eChallenge_type">{event.get('type')}</span>
                </div>
                <div className="eChallenge_name eChallenge_marginTopBottom">{event.get('name')}</div>
                <div className="eChallenge_rivals">
                    <span className="eChallenge_rivalName">{self.getRivalName(event, 0)}</span>
                    <span className="eChallenge_rivalName">{self.getRivalName(event, 1)}</span>
                </div>
            </div>
        }).toArray() : <div className="eChallenge mNotFound">{sync ? "You haven't events on this month." : "Loading..."}</div>;
    },
    render: function() {
        var self = this,
            binding = this.getDefaultBinding();
        return (
            <div className="eEvents_challenges">
                <h3 style={{marginBottom:10+'px'}}>Individual View</h3>
                {self.getEvents()}
            </div>
        );
    }
});


module.exports = ChallengesList;
