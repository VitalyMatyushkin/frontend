const   React       = require('react'),
        Immutable   = require('immutable');

const ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    sameDay: function (d1, d2) {
        d1 = d1 instanceof Date ? d1 : new Date(d1);
        d2 = d2 instanceof Date ? d2 : new Date(d2);

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
        return eventsByDate.map(function (event, evtIndex) {
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
                secondPoint,
                comment;
            if(eventBinding.get('result') && eventBinding.get('result.comment')){
                comment = eventBinding.get('result.comment');
            }else{
                comment = "There are no comments on this fixture";
            }
            if (type === 'inter-schools') {
                firstName = eventBinding.get('participants.0.school.name')!== undefined ? eventBinding.get('participants.0.school.name'):'Participant not set';
                firstPic = eventBinding.get('participants.0.school.pic');
                secondName = eventBinding.get('participants.1.school.name')!==undefined ? eventBinding.get('participants.1.school.name'):'Participant not set';
                secondPic = eventBinding.get('participants.1.school.pic');
            } else if (type === 'houses') {
                firstName = eventBinding.get('participants.0.house.name');
                secondName = eventBinding.get('participants.1.house.name');
                firstPic = eventBinding.get('participants.0.school.pic');
                secondPic = eventBinding.get('participants.1.school.pic');
            } else if (type === 'internal') {
                firstName = eventBinding.get('participants.0.name');
                secondName = eventBinding.get('participants.1.name');
                firstPic = eventBinding.get('participants.0.school.pic');
                secondPic = eventBinding.get('participants.1.school.pic');
            }

            if (event.get('resultId')) {
                firstPoint = eventBinding.get('result.summary.byTeams.' + eventBinding.get('participants.0.id')) || 0;
                secondPoint = eventBinding.get('result.summary.byTeams.' + eventBinding.get('participants.1.id')) || 0;
            }

            return <div key={evtIndex} className="bChallenge"
                        onClick={self.onClickChallenge.bind(null, event.get('id'))}
                        id={'challenge-' + event.get('id')}
                >
                <div className="eChallenge_hours">{hours + ':' + minutes}</div>

                <div className="eChallenge_in">
                    <div className="eChallenge_firstName">
                        {firstName}
                    </div>
                    <p>vs</p>

                    <div className="eChallenge_secondName">
                        {secondName}
                    </div>
                </div>
						<div className={'eChallenge_results' + (event.get('resultId') ? ' mDone' : '') }>{event.get('resultId') ? [firstPoint, secondPoint].join(':') : '- : -'}</div>

            </div>;
        }).toArray();
    },
    getDates: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            dates = binding.get('models').reduce(function (memo, val) {
                var date = Date.parse(val.get('startTime')),
                    any = memo.some(function (d) {
                        return self.sameDay(date, d);
                    });

                if (!any) {
                    memo = memo.push(date);
                }

                return memo;
            }, Immutable.List());
        return dates.count() !== 0 ? dates.sort().map(function (datetime,dtIndex) {
            var date = new Date(datetime),
                daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                monthNames = [ "01", "02", "03", "04", "05", "06",
                "07", "08", "09", "10", "11", "12" ],
                dayOfWeek = date.getDay();

            return <div key={dtIndex} className="bChallengeDate">
                <div className="eChallengeDate_wrap">
                <div className="eChallengeDate_date">
						{date.getDate() + '.' +
						monthNames[date.getMonth()] + '.' +
							date.getFullYear()}
                </div>
                <div className="eChallengeDate_list">{self.getEvents(datetime)}</div>
            </div>
            </div>;
        }).toArray() : <div className="eUserFullInfo_block">No fixtures to report on this child</div>;
    },
	render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            challenges = self.getDates();
		return <div>
            <div className="bChallenges">
                <div className="eChallenge_title">
                    <span className="eChallengeDate_date">Date</span>
                    <span className="eChallenge_hours">Time</span>
                    <span className="eChallenge_in">Game Type</span>
                    <span className="eChallenge_results">Score</span>
                </div>
                {challenges}</div>
        </div>;
	}
});


module.exports = ChallengesView;
