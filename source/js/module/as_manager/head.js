const	Logo		= require('module/as_manager/head/logo'),
		TopMenu		= require('module/ui/menu/top_menu'),
		UserBlock	= require('module/shared_pages/head/user_block'),
		If			= require('module/ui/if/if'),
		Morearty	= require('morearty'),
		React		= require('react');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const self = this;
	},
	componentDidMount:function(){
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.createTopMenu();
	},
	_createMenuItems: function() {
		const 	self = this,
				role = self.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role');

		const menuItems = role ? [
			{
				href: '/#school_admin/summary',
				icon: '',
				name: 'School',
				key: 'School',
				routes: ['/school_admin/:subPage', '/school_admin/:subPage/:mode', '/schools/add', '/schools'],
				authorization: true,
				verified: true
			}, {
				href: '/#events/calendar',
				icon: '',
				name: 'Events',
				key: 'Events',
				routes: ['/events/:subPage'],
				authorization: true,
				verified: true
			},
			{
				href: '/#invites/inbox',
				icon: '',
				name: 'Invites',
				key: 'Invites',
				routes: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
				authorization: true,
				verified: true
			}
		]:[];

		// show console only for admin and manager
		if(role === "ADMIN" || role === "MANAGER") {
			menuItems.push({
				href: '/#school_console/users',
				icon: '',
				name: 'Console',
				key: 'Console',
				routes: ['/school_console/:subPage', '/school_console/:filter', '/school_console/:inviteId/:mode'],
				authorization: true,
				verified: true
			});
		}

		return menuItems;
	},
	createTopMenu: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		binding.set('topMenuItems', self._createMenuItems());
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="bTopPanel">
				<Logo/>
				<TopMenu binding={{default: binding.sub('routing'), itemsBinding: binding.sub('topMenuItems')}}/>
				<If condition={document.location.hash.indexOf('login') === -1}>
					<UserBlock binding={binding.sub('userData')}/>
				</If>
			</div>
		)
	}
});

module.exports = Head;
