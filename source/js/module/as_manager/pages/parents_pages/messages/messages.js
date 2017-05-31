const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),

		RouterView	= require('module/core/router'),
		Route		= require('module/core/route'),
		SubMenu		= require('module/ui/menu/sub_menu'),

		Inbox		= require('module/as_manager/pages/parents_pages/messages/inbox/inbox'),
		Outbox		= require('module/as_manager/pages/parents_pages/messages/outbox/outbox'),
		Archive		= require('module/as_manager/pages/parents_pages/messages/archive/archive');

const Messages = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			messagesRouting:	{},
			menuItems:			{}
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
					<RouterView
						routes	= {binding.sub('messagesRouting')}
						binding	= {rootBinging}
					>
						<Route
							path		= '/messages/inbox'
							binding		= {binding}
							component	= {Inbox}
						/>
						<Route
							path		= '/messages/outbox'
							binding		= {binding}
							component	= {Outbox}
						/>
						<Route
							path		= '/messages/archive'
							binding		= {binding}
							component	= {Archive}
						/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = Messages;