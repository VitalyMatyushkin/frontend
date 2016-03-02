const 	ChallengesList 		= require('module/as_manager/pages/events/calendar/challenges_list'),
		AllChallengesList 	= require('./calendar/all_challenges_list'),
    	CalendarView 		= require('module/ui/calendar/calendar'),
		If 					= require('module/ui/if/if'),
		React 				= require('react'),

EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

        return (
            <div className="eEvents_calendar">
                <CalendarView binding={binding.sub('calendar')} />
				<If condition={binding.get('activeChildId')!=='all'}>
					<ChallengesList binding={binding} />
				</If>
				<If condition={binding.get('activeChildId')==='all'}>
					<AllChallengesList binding={binding} />
				</If>
            </div>
		);
	}
});


module.exports = EventsCalendar;
