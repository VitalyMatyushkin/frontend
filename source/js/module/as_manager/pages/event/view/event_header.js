var If = require('module/ui/if/if'),
	InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
	EventHeader;

EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	render: function() {
        var self = this,
			binding = self.getDefaultBinding();

		return <div className="bEventHeader">
			<div className="eEventHeader_date">{self.formatDate(binding.get('model.startTime'))}</div>
			<div className="eEventHeader_name">{binding.get('model.name')}</div>
			<div className="eEventHeader_buttons">{binding.get('model.type')}</div>
        </div>;
	}
});


module.exports = EventHeader;
