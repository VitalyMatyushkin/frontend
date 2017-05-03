const 	RouterView 			= require('module/core/router'),
		Route 				= require('module/core/route'),
		React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty			= require('morearty'),
		SubMenu 			= require('module/ui/menu/sub_menu'),
		InboxComponent 		= require('module/as_manager/pages/invites/views/inbox'),
		OutboxComponent 	= require('module/as_manager/pages/invites/views/outbox'),
		ArchiveComponent 	= require('module/as_manager/pages/invites/views/archive'),
		AcceptComponent 	= require('module/as_manager/pages/invites/views/accept');


const InvitesView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			subMenuKey: this.getRandomString(),
			inbox: {
				models: [],
				sync: false
			},
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

		this.addListeners();
	},
	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	addListeners: function() {
		this.addListenerToInboxInviteCount();
	},
	addListenerToInboxInviteCount: function() {
		const binding = this.getDefaultBinding();

		binding.sub('inbox.models').addListener(descriptor => {
			const	currentModels	= descriptor.getCurrentValue().toJS(),
					prevModels		= descriptor.getPreviousValue().toJS();

			if(currentModels.length !== prevModels.length) {
				this.menuItems[0].name = `Inbox(${currentModels.length})`
				binding.set('subMenuKey', Immutable.fromJS(this.getRandomString()));
			}
		});
	},
	render: function() {
		const 	self 			= this,
				binding	 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return <div>
			<SubMenu
				key		= {binding.toJS('subMenuKey')}
				binding	= {binding.sub('invitesRouting')}
				items	= {self.menuItems}
			/>
			<div className='bSchoolMaster'>
				<div className='bInvites'>
					<RouterView routes={ binding.sub('invitesRouting') } binding={globalBinding}>
						<Route path='/invites /invites/inbox'		binding={binding.sub('inbox')}		component={InboxComponent} />
						<Route path='/invites/outbox' 				binding={binding.sub('outbox')} 	component={OutboxComponent} />
						<Route path='/invites/archive' 				binding={binding.sub('archive')} 	component={ArchiveComponent} />
						<Route path='/invites/:inviteId/accept' 	binding={binding.sub('accept')} 	component={AcceptComponent} />
					</RouterView>
				</div>
			</div>
        </div>;
	}
});


module.exports = InvitesView;
