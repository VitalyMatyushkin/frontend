const   React           = require('react'),
        Sport           = require('module/ui/icons/sport_icon'),
        Immutable       = require('immutable'),
        ChallengeModel	= require('module/ui/challenges/challenge_model'),
        classNames      = require('classnames'),
        DateHelper      = require('module/helpers/date_helper'),

ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    sameDay: function (d1, d2) {
        d1 = d1 instanceof Date ? d1 : new Date(d1);
        d2 = d2 instanceof Date ? d2 : new Date(d2);

        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
    onClickChallenge: function (eventId) {
        document.location.hash = 'event/' + eventId;
    },
    getSportIcon:function(sport){
        return <Sport name={sport} className="bIcon_invites" ></Sport>;
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
            const   activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
                    model           = new ChallengeModel(event.toJS(), activeSchoolId),
                    sportIcon       = self.getSportIcon(model.sport);

            return (
                <div key={model.id} className="bChallenge" onClick={self.onClickChallenge.bind(null, model.id)}>
                    <span className="eChallenge_sport">{sportIcon}</span>
                    <span className="eChallenge_event" title={model.name}>{model.name}</span>
                    <div className="eChallenge_hours">{model.time}</div>
                    <div className="eChallenge_in">
                        <span className="eChallenge_firstName" title={model.rivals[0]}>{model.rivals[0]}</span>
                        <p>vs</p>
                        <span className="eChallenge_secondName" title={model.rivals[1]}>{model.rivals[1]}</span>
                    </div>
                    <div className={classNames({eChallenge_results:true, mDone:model.played})}>{model.score}</div>
                </div>
            );
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
            var date = DateHelper.getDate(datetime);

            return (
                <div key={dtIndex} className="bChallengeDate">
                    <div className="eChallengeDate_wrap">
                        <div className="eChallengeDate_date">{date}</div>
                        <div className="eChallengeDate_list">{self.getEvents(datetime)}</div>
                    </div>
                </div>
            );
        }).toArray() : <div className="eUserFullInfo_block">No fixtures to report on this child</div>;
    },
	render: function () {
        var self = this,
            challenges = self.getDates();
		return (
            <div>
                <div className="bChallenges">
                    <div className="eChallenge_title">
                        <span className="eChallengeDate_date">Date</span>
                        <div className="bChallenge">
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
