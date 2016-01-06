var CalendarYearView,
	React = require('react');

CalendarYearView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return <div className="eCalendar_eYear">
		</div>;
	}
});


module.exports = CalendarYearView;
