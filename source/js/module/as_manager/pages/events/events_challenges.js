var ChallengesView;

ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    sameDay: function (d1, d2) {
        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
	addZeroToFirst: function (num) {
		return String(num).length === 1 ? '0' + num : num;
	},
    onClickChallenge: function (eventId) {
        document.location.hash = 'event/' + eventId;
    },
    getCountPoint: function (points, participantId) {
        var self = this;

        return points.filter(function (point) {
            return point.get('participantId') === participantId;
        }).count();
    },
    getEvents: function (date) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate = binding.get('models').filter(function (event) {
                return self.sameDay(
                        new Date(event.get('startTime')),
                        new Date(date));
            });

        return eventsByDate.map(function (event) {
            var eventDateTime = new Date(event.get('startTime')),
                eventIndex = binding.get('models').findIndex(function (evt) {
                    return evt.get('id') === event.get('id');
                }),
                eventBinding = binding.sub(['models', eventIndex]),
				hours = self.addZeroToFirst(eventDateTime.getHours()),
				minutes = self.addZeroToFirst(eventDateTime.getMinutes()),
                type = event.get('type'),
                firstName,
                secondName,
				firstPic,
				secondPic,
                firstPoint,
                secondPoint;

            if (type === 'inter-schools') {
				//http://i.imgur.com/9br7NSU.jpg
                firstName = eventBinding.get('participants.0.school.name');
                secondName = !binding.get('model.resultId') ? eventBinding.get('invites.0.guest.name') : eventBinding.get('participants.1.school.name');

				firstPic = eventBinding.get('participants.0.school.pic');
				secondPic = eventBinding.get('participants.1.school.pic') || eventBinding.get('invites.0.guest.pic');

            } else if (type === 'houses') {
                firstName = eventBinding.get('participants.0.house.name');
                secondName = eventBinding.get('participants.1.house.name');
            } else if (type === 'internal') {
                firstName = eventBinding.get('participants.0.name');
                secondName = eventBinding.get('participants.1.name');
            }

            if (event.get('resultId')) {
                firstPoint = eventBinding.get('result.summary.byTeams.' + eventBinding.get('participants.0.id')) || 0;
                secondPoint = eventBinding.get('result.summary.byTeams.' + eventBinding.get('participants.1.id')) || 0;
            }

            return <div className="bChallenge" onClick={self.onClickChallenge.bind(null, event.get('id'))} id={'challenge-' + event.get('id')}>
                <div className="eChallenge_in">
                    <div className="eChallenge_rivalName">
					{firstPic ? <span className="eChallenge_rivalPic"><img src={firstPic} /></span> : ''}
					{firstName}
					</div>

					<div className="eChallenge_rivalInfo">
						<div className="eChallenge_hours">{hours + ':' + minutes}</div>

						<div className={'eChallenge_results' + (event.get('resultId') ? ' mDone' : '') }>{event.get('resultId') ? [firstPoint, secondPoint].join(':') : '? : ?'}</div>

						<div className="eChallenge_info">{event.get('type')}</div>
					</div>

					<div className="eChallenge_rivalName">{secondName}</div>
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

            return <div className="bChallengeDate">
                <div className="eChallengeDate_date">
						{daysOfWeek[dayOfWeek] + ' ' +
						date.getDate() + ' ' +
						monthNames[date.getMonth()] + ' ' +
							date.getFullYear()}
                </div>
                <div className="eChallengeDate_list">{self.getEvents(datetime)}</div>
            </div>;
        }).toArray() : null;
    },
	render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            challenges = self.getDates();

		return <div>
            <div className="bChallenges">{challenges}</div>
        </div>;
	}
});


module.exports = ChallengesView;
