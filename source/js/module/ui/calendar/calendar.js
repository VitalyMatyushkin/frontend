/**
 * Created by Anatoly on 07.10.2016.
 */

const 	React			= require('react'),
		MonthCalendar	= require('./month_calendar'),
		Morearty        = require('morearty');

/** Show calendar section: month calendar and events for selected date */
const Calendar = React.createClass({
	mixins:[Morearty.Mixin ],
	propType: {
		onSelect: React.PropTypes.func,
		actions: React.PropTypes.object.isRequired
	},
	componentWillMount: function () {
		const	binding			= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		/** Loading initial data for this month */
		this.props.actions.setCurrentMonth(new Date(), activeSchoolId, binding);
	},

	onSelect:function(date){
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		this.props.actions.setSelectedDate(date, activeSchoolId, binding);

		if(typeof this.props.onSelect === 'function')
			this.props.onSelect(date);
	},
	render: function(){
		const 	self 			= this,
				binding 		= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				todayDate		= binding.get('todayDate'),
				monthDate		= binding.get('monthDate'),
				selectedDate	= binding.get('selectedDate'),
				eventsData		= binding.get('eventsData');

		return (
			<MonthCalendar
				monthDate={monthDate}
				todayDate={todayDate}
				selectedDate={selectedDate}
				onNextMonthClick={ () => self.props.actions.setNextMonth(activeSchoolId, binding) }
				onPrevMonthClick={ () => self.props.actions.setPrevMonth(activeSchoolId, binding) }
				onDateClick={this.onSelect }
				eventsData={eventsData}
			/>
		);
	}
});

module.exports = Calendar;