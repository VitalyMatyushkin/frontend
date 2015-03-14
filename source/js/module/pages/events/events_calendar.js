var ChallengesList = require('./calendar/challenges_list'),
    CalendarView = require('module/ui/calendar/calendar'),
	EventsCalendar;

EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            teamsBinding = rootBinding.sub('teams'),
            eventsBinding = rootBinding.sub('events');

        window.Server.teamsBySchoolId.get(activeSchoolId).then(function (data) {
            teamsBinding.set(Immutable.fromJS({
                sync: true,
                models: data
            }));

            eventsBinding.merge(Immutable.fromJS({
                models: data.map(function (team) {
                    return team.events[0];
                }).reduce(function (memo, val) {
                    var filtered = memo.filter(function (mem) {
                        return mem.id === val.id;
                    });

                    if (filtered.length === 0) {
                        memo.push(val);
                    }

                    return memo;
                }, []),
                sync: true
            }));
        });
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

        return (
            <div className="eEvents_calendar">
                <CalendarView binding={binding.sub('calendar')} />
                <ChallengesList binding={binding} />
            </div>
		);
	}
});


module.exports = EventsCalendar;
