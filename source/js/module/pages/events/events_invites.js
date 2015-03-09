var Panel = require('./panel'),
    SVG = require('module/ui/svg'),
    InvitesList = require('module/pages/invites/list'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
            binding = self.getDefaultBinding();

        return <div className="bEvents">
            <Panel binding={binding} />
            <h2>Invites</h2>
            <InvitesList binding={binding} />
        </div>;
	}
});


module.exports = EventsView;
