const 	RouterView 			= require('module/core/router'),
		Route 				= require('module/core/route'),
		React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty			= require('morearty'),
		SubMenu 			= require('module/ui/menu/sub_menu'),
		InboxComponent 		= require('module/as_manager/pages/invites/views/inbox'),
		OutboxComponent 	= require('module/as_manager/pages/invites/views/outbox'),
		ArchiveComponent 	= require('module/as_manager/pages/invites/views/archive'),
		AcceptComponent 	= require('module/as_manager/pages/invites/views/accept'),
		AnswerComponent 	= require('module/as_manager/pages/invites/views/answer');

const InvitesView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			inbox: {},
			outbox: {},
			archive: {},
			decline: {
				type: 'decline'
			},
			cancel: {
				type: 'cancel'
			},
			invitesRouting: {},
			selectedRivalIndex: 0
		});
	},
	componentWillMount: function () {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

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
		const 	self 			= this,
				binding	 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return <div>
			<SubMenu binding={binding.sub('invitesRouting')} items={self.menuItems} />
			<div className='bSchoolMaster'>
				<div className='bInvites'>
					<RouterView routes={ binding.sub('invitesRouting') } binding={globalBinding}>
						<Route path='/invites /invites/inbox' 		binding={binding.sub('inbox')} 		component={InboxComponent} />
						<Route path='/invites/outbox' 				binding={binding.sub('outbox')} 	component={OutboxComponent} />
						<Route path='/invites/archive' 				binding={binding.sub('archive')} 	component={ArchiveComponent} />
						<Route path='/invites/:inviteId/accept' 	binding={binding.sub('accept')} 	component={AcceptComponent} />
						<Route path='/invites/:inviteId/decline' 	binding={binding.sub('decline')} 	component={AnswerComponent}  />
						<Route path='/invites/:inviteId/cancel' 	binding={binding.sub('cancel')} 	component={AnswerComponent}  />
					</RouterView>
				</div>
			</div>
        </div>;
	}
});


module.exports = InvitesView;
