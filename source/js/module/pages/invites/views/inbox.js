var InboxView,
	InvitesMixin = require('../mixins/invites_mixin');

InboxView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getInvites: function () {
		console.log(this.getDefaultBinding().toJS())
		var self = this,
			activeSchoolId = self.getActiveSchoolId(),
			binding = self.getDefaultBinding(),
			invites = self.getFilteredInvites(activeSchoolId, 'inbox', 'ask', true);

		console.log(invites.toJS())
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div>
			Inbox
			<div className="eInvites_filterPanel">
				filters
			</div>
			<div className="eInvites_list">{self.getInvites()}</div>
		</div>;
	}
});


module.exports = InboxView;
