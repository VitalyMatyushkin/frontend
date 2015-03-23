var If = require('module/ui/if/if'),
	InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
	EventHeader;

EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	RedirectTo: function (mode) {
		var self = this,
			binding = self.getDefaultBinding();

		mode = mode ? '/' + mode : '';

		document.location.hash = 'event/' + binding.get('model.id') + mode;
	},
	render: function() {
        var self = this,
			binding = self.getDefaultBinding();

		return <div className="bEventHeader">
			<div className="eEventHeader_date">{self.formatDate(binding.get('model.startTime'))}</div>
			<div className="eEventHeader_name">{binding.get('model.name')}</div>
			<div className="eEventHeader_buttons">
				
			</div>
        </div>;
	}
});


module.exports = EventHeader;
