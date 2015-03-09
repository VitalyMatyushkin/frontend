var Panel = require('./panel'),
    ChallengesView;

ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    sameDay: function (d1, d2) {
        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
	addZeroToFirst: function (num) {
		return String(num).length === 1 && String(num).indexOf('0') !== 0 ? '0' + num : num;
	},
    onClickChallenge: function (eventId) {
        document.location.hash = 'events/view?id=' + eventId;
    },
    getEvents: function (date) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate = binding.get('models').filter(function (event) {
                return self.sameDay(
                    new Date(event.get('startTime')),
                    new Date(date)
                );
            });

        return eventsByDate.map(function (event) {
            var eventDateTime = new Date(event.get('startTime')),
				hours = self.addZeroToFirst(eventDateTime.getHours()),
				minutes = self.addZeroToFirst(eventDateTime.getMinutes());

            return <div className="eChallenge" onClick={self.onClickChallenge.bind(null, event.get('id'))} id={'challenge-' + event.get('id')}>
                <div className="eChallenge_name">
                    <span className="eChallenge_rivalName">{event.get('name').split('vs')[0]}</span>
                    <span className="eChallenge_time">{hours + ':' + minutes}</span>
                    <span className="eChallenge_rivalName">{event.get('name').split('vs')[1]}</span>
                </div>
                <div className="eChallenge_info">
                    <span className="eChallenge_rivalsType">{'rivals: ' + event.get('rivalsType') + ';'}</span>
                    <span className="eChallenge_status">{'status: ' + event.get('status')}</span>
                </div>
            </div>;
        }).toArray();
    },
    getDates: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            dates = binding.get('models').reduce(function (memo, val) {
                var date = Date.parse(val.get('startTime'));

                if (memo.indexOf(date) === -1) {
                    memo = memo.push(date);
                }

                return memo;
            }, Immutable.fromJS([]));


        return dates.count() !== 0 ? dates.sort().map(function (datetime) {
            var date = new Date(datetime),
                daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ],
                dayOfWeek = date.getDay();

            return <div className="bChallenges_eDate">
                <div className="eDate_header">
                    {daysOfWeek[dayOfWeek] + ' ' +
                    date.getDate() + ' ' +
                    monthNames[date.getMonth()] + ' ' +
                        date.getFullYear()}
                </div>
                <div className="eDate_list">{self.getEvents(datetime)}</div>
            </div>;
        }).toArray() : null;
    },
	render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            challenges = self.getDates();

		return <div className="bEvents">
            <Panel binding={binding} />
            <div className="bChallenges">{challenges}</div>
        </div>;
	}
});


module.exports = ChallengesView;
