var CalendarMonthView = require('./calendar_month'),
	CalendarView;

CalendarView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var date = new Date();

		return Immutable.fromJS({
			date: date,
			mode: 'months',
			hoverDay: null,
            monthNames: [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ]
		});
	},
    onClickPrevButton: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            date = binding.get('date'),
            year = date.getFullYear(),
            month = date.getMonth(),
            prevYear = month === 0 ? year -1 : year,
            prevMonth = month === 0 ? 11 : month -1;

        binding.set('date', new Date(prevYear, prevMonth, 1));
    },
    onClickNextButton: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            date = binding.get('date'),
            year = date.getFullYear(),
            month = date.getMonth(),
            nextYear = month === 11 ? year + 1 : year,
            nextMonth = month === 11 ? 0 : month + 1;

        binding.set('date', new Date(nextYear, nextMonth, 1));
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			calendarBinding = binding,
			currentMode = calendarBinding.get('mode'),
            currentMonthName = binding.get('monthNames.' + calendarBinding.get('date').getMonth()),
			currentView;

		if (currentMode === 'months') {
			currentView = <CalendarMonthView binding={calendarBinding} />
		} else {
			currentView = <CalendarMonthView binding={calendarBinding} />
		}

		return <div className="bCalendar">
            <div className="eCalendar_navBar">
                <span className="eCalendar_item" onClick={self.onClickPrevButton}>prev</span>
                <span className="eCalendar_item mNameMonth">{currentMonthName} - {binding.get('date').getFullYear()}</span>
                <span className="eCalendar_item" onClick={self.onClickNextButton}>next</span>
            </div>
			{currentView}
		</div>;
	}
});


module.exports = CalendarView;
