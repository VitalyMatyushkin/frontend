const 	Morearty    = require('morearty'),
		React 		= require('react');

const CalendarYearView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return <div className="eCalendar_eYear">
		</div>;
	}
});


module.exports = CalendarYearView;
