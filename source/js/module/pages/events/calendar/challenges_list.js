var ChallengesList;

ChallengesList = React.createClass({
    mixins: [Morearty.Mixin],
    getEvents: function () {
        var self = this,
            binding = this.getDefaultBinding(),
            currentDate = binding.get('calendar.currentDate'),
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
                stringDate = (eventDate.getMonth() + 1) + '/' + eventDate.getDate() + '/' + eventDate.getFullYear();

            return <div className={isHoverDay ? 'eChallenge mActive' : 'eChallenge'}>
                <span className="eChallenge_date">{stringDate}</span>
                <span className="eChallenge_name">{event.get('name')}</span>
            </div>
        }).toArray() : <div className="eChallenge mNotFound">You haven't events on this month.</div>;
    },
    render: function() {
        var self = this,
            binding = this.getDefaultBinding();

        return <div className="eEvents_challenges">{self.getEvents()}</div>
    }
});


module.exports = ChallengesList;
