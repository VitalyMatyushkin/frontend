var CalendarEventsPanelView;

CalendarEventsPanelView = React.createClass({
	mixins: [Morearty.Mixin],
    renderEvents: function () {
        var self = this,
            events = self.getDefaultBinding().sub('models');

        return events.get().map(function (event) {
            return <span className="eEventsPanel_event">{event.get('name')}</span>
        });
    },
	render: function() {
		var self = this;

		return <div className="eCalendar_eEventsPanel">{self.renderEvents()}</div>;
	}
});


module.exports = CalendarEventsPanelView;
