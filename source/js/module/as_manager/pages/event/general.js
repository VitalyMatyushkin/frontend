var EventHeader = require('./view/event_header'),
	EventRivals = require('./view/event_rivals'),
    EventButtons = require('./view/event_buttons'),
	EventTeams = require('./view/event_teams'),
	EventGeneralView;

EventGeneralView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();

		return <div className="bEvent">
            <EventButtons binding={binding} />
            <EventHeader binding={binding} />
			<EventRivals binding={binding} />
			<EventTeams binding={binding} />
        </div>;
	}
});


module.exports = EventGeneralView;
