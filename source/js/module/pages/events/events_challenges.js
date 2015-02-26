var ChallengesView;

ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    equalDates: function (first, second) {
        return first.getTime() == second.getTime();
    },
    getEvents: function (date) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate = binding.get('models').filter(function (event) {
                var eventDateTime = new Date(event.get('startTime'));
                return self.equalDates(
                    new Date(eventDateTime.getFullYear(), eventDateTime.getMonth(), eventDateTime.getDate()),
                    date
                );
            });

        return eventsByDate.count() ? eventsByDate.map(function (event) {
            var eventDateTime = new Date(event.get('startTime')),
                rivalFirst = <span clasName="eChallenge_rivalName">{event.get('name').split('vs')[0]}</span>,
                rivalSecond = <span clasName="eChallenge_rivalName">{event.get('name').split('vs')[1]}</span>,
                eventTime = <span className="eChallenge_time">{eventDateTime.getHours() + ':' + eventDateTime.getMinutes()}</span>;

            return <div className="eChallenge">
                <span className="eChallenge_name">{rivalFirst} {eventTime} {rivalSecond}</span>
                <span className="eChallenge_rivalsType">{event.get('rivalsType')}</span>
                <span className="eChallenge_status">{event.get('status')}</span>
            </div>;
        }).toArray() : null;
    },
    getDates: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            dates = binding.get('models').reduce(function (memo, val, index) {
                var date = new Date(val.get('startTime')),
                    onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                if (memo.indexOf(onlyDate.getTime()) === -1) {
                    memo = memo.push(onlyDate.getTime());
                }

                return memo;
            }, Immutable.fromJS([]));


        return dates.count() !== 0 ? dates.map(function (datetime) {
            var date = new Date(datetime),
                daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ],
                dayOfWeek = date.getDay();

            return <div className="bChallenges_eDate">
                <div className="eDate_header">
                    {daysOfWeek[dayOfWeek] + ' ' +
                    date.getDate() + ' ' +
                    monthNames[date.getMonth()]}
                </div>
                <div className="eDate_list">{self.getEvents(date)}</div>
            </div>;
        }).toArray() : null;
    },
	render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            challenges = self.getDates();

		return <div className="bChallenges">{challenges}</div>;
	}
});


module.exports = ChallengesView;
