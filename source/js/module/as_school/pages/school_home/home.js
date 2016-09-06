/**
 * Created by bridark on 31/07/15.
 */
const   HomeHeader      = require('./home_header'),
        HomeFixture     = require('./home_fixtures'),
        HomeNews        = require('./home_news'),
        HomeCalender    = require('./home_calendar'),
        React           = require('react'),
        Morearty        = require('morearty'),
		Immutable		= require('immutable'),
        HomeBlog        = require('./home_carousel');

const SchoolHomePage = React.createClass({
    mixins: [Morearty.Mixin],

	componentWillMount: function(){
    	// setting default to binding if nothing set yet
		const 	eventsBinding = this.getDefaultBinding().sub('events'),
				defaultTodayDate 	= new Date(),
				defaultMonthDate 	= new Date(defaultTodayDate.getFullYear(), defaultTodayDate.getMonth()),
				defaultSelectedDate	= new Date(),
				defaultDistinctEventDatesData = {
					isSync: false,
					dates: []
				},
				defaultSelectedDateEventsData = {
					isSync: false,
					events: []
				};

		eventsBinding.set('todayDate', defaultTodayDate);
		eventsBinding.set('monthDate', defaultMonthDate);
		eventsBinding.set('selectedDate', defaultSelectedDate);
		eventsBinding.set('distinctEventDatesData', Immutable.fromJS(defaultDistinctEventDatesData));
		eventsBinding.set('selectedDateEventsData',	Immutable.fromJS(defaultSelectedDateEventsData));
	},

	loadMonthDistinctEventDatesToBinding: function(monthDate){
		const 	eventsBinding	= this.getDefaultBinding().sub('events'),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				monthStartDate	= new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
				monthEndDate	= new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

		eventsBinding.set('distinctEventDatesData.isSync', false);

		const filter = {
			limit: 100,
			where: {
				startTime: {
					$gte: 	monthStartDate,
					$lt: 	monthEndDate
				},
				status: {
					$in: ['ACCEPTED', 'FINISHED']
				}
			}
		};

		window.Server.publicSchoolEventDates.get({ schoolId: activeSchoolId}, { filter: filter }).then( events => {
			eventsBinding.set('distinctEventDatesData.dates', Immutable.fromJS(events.dates));
			eventsBinding.set('distinctEventDatesData.isSync', true);
		});

	},
    render: function(){
        const   self    = this,
                binding = self.getDefaultBinding();

		this.loadMonthDistinctEventDatesToBinding(new Date());

        return (
            <div className="eSchoolHomePage">
                <HomeHeader binding={binding}/>
                <div className="eSchoolBodyWrapper">
                    <HomeCalender binding={binding} />
                    <HomeFixture binding={binding} />
                    <HomeNews binding={binding}/>
                    <HomeBlog binding={binding}  />
                </div>
                <div className="eSchoolHomeFooter">
                    <img src = "images/logo.png"></img>
                    &copy;All Rights Reserved, SquadInTouch.com  SquadInTouch.com &trade;
                </div>
            </div>
        );
    }
});

module.exports = SchoolHomePage;