var CalendarMonthView;

CalendarMonthView = React.createClass({
	mixins: [Morearty.Mixin],
    propType: {
        onSelect: React.PropTypes.func
    },
	range: function (end) {
		var arr = [],
			start = 0;

		for (var i = start; i < end; i++) {
			arr.push(i);
		}
		return arr;
	},
	daysInMonth: function (month, year) {
		return new Date(year, month + 1, 0).getDate();
	},
	getDayOfWeek: function (day, month, year) {
		return new Date(year, month, day).getDay();
	},
	equalDates: function (first, second) {
		return first.getTime() == second.getTime();
	},
	onMouseEnterDay: function (day) {
		this.getDefaultBinding().set('hoverDay', day);
	},
	onMouseLeaveDay: function () {
		this.getDefaultBinding().set('hoverDay', null);
	},
    countEventInDay: function (date) {
        var self = this,
            binding = this.getMoreartyContext().getBinding().sub('events'),
            filteredModels = binding.get('models').filter(function (model) {
                var parsedDate = new Date(model.get('startTime')),
                    startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
                return startDate.getTime() === date.getTime();
            });

        return filteredModels;
    },
	getDays: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			date = binding.get('currentDate'),
			month = date.getMonth(),
			year = date.getFullYear(),
			daysInMonth = self.daysInMonth(month, year),
			daysInPrevMonth = self.daysInMonth(month - 1, year),
			firstMonthDayOfWeek = self.getDayOfWeek(1, month, year),
			//lastMonthDayOfWeek = self.getDayOfWeek(daysInMonth, month, year),
			days = [];

		// добиваем дни от начала
		if (firstMonthDayOfWeek > 0) {
			for (var i = 0; i <= firstMonthDayOfWeek; i += 1) {
				days.unshift({
					day: daysInPrevMonth - i,
                    date: new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month -1, daysInPrevMonth - i),
                    prev: true
				});
			}
		}

		// вливаем дни
		for (var j = 1; j <= daysInMonth; j += 1) {
			days.push({
				day: j,
                date: new Date(year, month, j),
                events: self.countEventInDay(new Date(year, month, j))
			});
		}

		// вливаем дни в конец
		if (days.length % 7 > 0) {
			for (var t = 0, len = (7 - (days.length % 7)); t < len; t += 1) {
				days.push({
					day: t + 1,
                    date: new Date(year, month + 1, t + 1),
                    next: true
				});
			}
		}


		return days
	},
    onClickPrevButton: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            date = binding.get('currentDate'),
            year = date.getFullYear(),
            month = date.getMonth(),
            prevYear = month === 0 ? year -1 : year,
            prevMonth = month === 0 ? 11 : month -1;

        binding.set('currentDate', new Date(prevYear, prevMonth, 1));
    },
    onSelectDay: function (day) {
        var self = this,
			binding = self.getDefaultBinding(),
			currentDate = binding.get('currentDate'),
			year = currentDate.getFullYear(),
			month = currentDate.getMonth();

		if (year === day.date.getFullYear() && month === day.date.getMonth()) {
			binding.set('selectDay', day);

			if (self.props.onSelect) {
				self.props.onSelect(day.date);
			}
		}
    },
    onClickNextButton: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            date = binding.get('currentDate'),
            year = date.getFullYear(),
            month = date.getMonth(),
            nextYear = month === 11 ? year + 1 : year,
            nextMonth = month === 11 ? 0 : month + 1;

        binding.set('currentDate', new Date(nextYear, nextMonth, 1));
    },
	renderRow: function (row, days) {
		var self = this,
            binding = this.getDefaultBinding(),
            date = binding.get('currentDate'),
			hoverDay = binding.get('hoverDay'),
            selectDay = binding.get('selectDay'),
			now = new Date(),
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		return <div className="eMonth_row">{days.map(function (day, i) {
            var classes = classNames({
				eMonth_day: true,
				mToday: self.equalDates(day.date, today),
				mPrev: day.prev || false,
                mNext: day.next || false,
				mFirst: i === 0,
				mHover: hoverDay && self.equalDates(day.date, hoverDay.date),
                mActive: day.events && day.events.count() > 0,
                mSelect: selectDay && self.equalDates(day.date, selectDay.date)
			});

			return <span
                className={classes}
                onClick={self.onSelectDay.bind(null, day)}
                onMouseLeave={self.onMouseLeaveDay}
                onMouseEnter={self.onMouseEnterDay.bind(null, day)}>{day.day}</span>;
		})}</div>;
	},
	renderDaysOfWeek: function () {
		var daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

		return <div className="eMonth_row mWeeks">{daysOfWeek.map(function (name) {
			return <span className="eMonth_day mWeekName">{name}</span>;
		})}</div>;
	},
    renderNavBar: function () {
        var self = this,
            binding = this.getDefaultBinding(),
            currentMonthName = binding.get('monthNames.' + binding.get('currentDate').getMonth());

            return <div className="eCalendar_navBar">
            <span className="eCalendar_item" onClick={self.onClickPrevButton}>←</span>
            <span className="eCalendar_item mNameMonth">{currentMonthName} - {binding.get('currentDate').getFullYear()}</span>
            <span className="eCalendar_item" onClick={self.onClickNextButton}>→</span>
        </div>;
    },
	render: function() {
		var self = this,
			days = self.getDays(),
			countRows = days.length / 7;

		return <div className="eCalendar_eMonth">
            {self.renderNavBar()}
			{self.renderDaysOfWeek()}
			{self.range(countRows).map(function(row) {
				return self.renderRow(row, days.slice(row * 7, row * 7 + 7));
			})}
		</div>;
	}
});


module.exports = CalendarMonthView;
