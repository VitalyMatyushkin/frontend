var Panel = require('./panel'),
    EventView;

EventView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();

		return <div className="bEvents">
			<h3>Team</h3>
            <div className="eEvent"></div>
		</div>;
	}
});


module.exports = EventView;
