var Panel = require('./panel'),
	InvitesView,
	SVG = require('module/ui/svg');

InvitesView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
            binding = this.getDefaultBinding();

		return <div className="bEvents">
            <Panel binding={binding} />
		</div>
	}
});


module.exports = InvitesView;
