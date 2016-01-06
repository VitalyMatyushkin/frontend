var InvitesView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	SubMenu = require('module/ui/menu/sub_menu');

InvitesView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			outbox: {},
			inbox: {},
			decline: {
				type: 'decline'
			},
			cancel: {
				type: 'cancel'
			},
			invitesRouting: {}
		});
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId');

		self.menuItems = [{
			href: '/#invites/inbox',
			name: 'Inbox',
			key: 'Inbox'
		},{
			href: '/#invites/outbox',
			name: 'Outbox',
			key: 'Outbox'
		},{
			href: '/#invites/archive',
			name: 'Archive',
			key: 'Archive'
		}];
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return <div>
			<SubMenu binding={binding.sub('invitesRouting')} items={self.menuItems} />
			<div className='bSchoolMaster'>
				<div className='bInvites'>
					<RouterView routes={ binding.sub('invitesRouting') } binding={globalBinding}>
						<Route path='/invites' binding={binding.sub('inbox')} component='module/as_manager/pages/invites/views/inbox'  />
						<Route path='/invites/inbox' binding={binding.sub('inbox')} component='module/as_manager/pages/invites/views/inbox'  />
						<Route path='/invites/outbox' binding={binding.sub('outbox')} component='module/as_manager/pages/invites/views/outbox'  />
						<Route path='/invites/archive' binding={binding.sub('outbox')} component='module/as_manager/pages/invites/views/archive'  />
						<Route path='/invites/:inviteId/accept' binding={binding.sub('accept')} component='module/as_manager/pages/invites/views/accept'  />
						<Route path='/invites/:inviteId/decline' binding={binding.sub('decline')} component='module/as_manager/pages/invites/views/answer'  />
						<Route path='/invites/:inviteId/cancel' binding={binding.sub('cancel')} component='module/as_manager/pages/invites/views/answer'  />
					</RouterView>
				</div>
			</div>
        </div>;
	}
});


module.exports = InvitesView;
