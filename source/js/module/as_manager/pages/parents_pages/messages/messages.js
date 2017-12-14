const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	RouterView	= require('module/core/router'),
		Route		= require('module/core/route'),
		{SubMenu}	= require('module/ui/menu/sub_menu');

const	Inbox	= require('module/as_manager/pages/parents_pages/messages/inbox/inbox'),
		Outbox	= require('module/as_manager/pages/parents_pages/messages/outbox/outbox'),
		Archive	= require('module/as_manager/pages/parents_pages/messages/archive/archive');

const	MessageConsts = require('module/ui/message_list/message/const/message_consts');

const Messages = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			messagesRouting:	{},
			menuItems:			{},
			inbox:				{
				messages: [],
				isSync: false
			},
			outbox:				{
				messages: [],
				isSync: false
			},
			archive:			{
				messages: [],
				isSync: false
			}
		});
	},
	componentWillMount: function () {
		this.initMenuItems();
	},
	initMenuItems: function() {
		this.menuItems = [{
			href:	'/#messages/inbox',
			name:	'Inbox',
			key:	'Inbox'
		}, {
			href:	'/#messages/outbox',
			name:	'Outbox',
			key:	'Outbox'
		}, {
			href:	'/#messages/archive',
			name:	'Archive',
			key:	'Archive'
		}];

		this.addListeners();
	},
	addListeners: function() {
		this.addListenerToInboxMessagesCount();
	},
	/**
	 * Function adds listener to count of inbox invites.
	 * So, invites component listens count of inbox invites and update this value too.
	 * Yes, it's shitty way because child component should not update data from his parent.
	 * But there is no any other way to solve this problem while we don't have redux or something else from flux camp
	 * frameworks.
	 */
	addListenerToInboxMessagesCount: function() {
		const binding = this.getDefaultBinding();

		binding.sub('inbox.messages').addListener(descriptor => {
			const	currentModels	= descriptor.getCurrentValue().toJS(),
					prevModels		= descriptor.getPreviousValue().toJS();

			if(currentModels.length !== prevModels.length) {
				const	rootBinding		= this.getMoreartyContext().getBinding(),
						topMenuItems	= rootBinding.toJS('topMenuItems'),
						inviteItemIndex	= topMenuItems.findIndex(i => i.key === 'Messages');

				let		name			= '';
				if(currentModels.length > 0) {
					name =`Messages(${currentModels.length})`;
				} else {
					name ='Messages';
				}
				topMenuItems[inviteItemIndex].name = name;

				rootBinding.set('topMenuItems', Immutable.fromJS(topMenuItems));
			}
		});
	},
	render: function () {
		const	binding		= this.getDefaultBinding(),
				rootBinging	= this.getMoreartyContext().getBinding();

		return (
			<div className="bParentsPage">
				<SubMenu
					items	= {this.menuItems}
					binding	= {binding.sub('messagesRouting')}
				/>
				<div className='bSchoolMaster'>
					<div className="bInvites">
						<RouterView
							routes	= {binding.sub('messagesRouting')}
							binding	= {rootBinging}
						>
							<Route
								path		= '/messages/inbox'
								binding		= { binding.sub('inbox') }
								userType	= { MessageConsts.USER_TYPE.PARENT }
								component	= { Inbox }
							/>
							<Route
								path		= '/messages/outbox'
								binding		= { binding.sub('outbox') }
								userType	= { MessageConsts.USER_TYPE.PARENT }
								component	= { Outbox }
							/>
							<Route
								path		= '/messages/archive'
								binding		= { binding.sub('archive') }
								userType	= { MessageConsts.USER_TYPE.PARENT }
								component	= { Archive }
							/>
						</RouterView>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Messages;