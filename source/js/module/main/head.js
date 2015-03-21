var Logo = require('module/main/head/logo'),
	TopMenu = require('module/ui/menu/top_menu'),
	UserBlock = require('module/main/head/user_block'),
	Head;

Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			menuItems;

		self.menuItems = [{
			href: '/#school_admin/summary',
			icon: 'icon_teams',
			name: 'School',
			key: 'School',
			routes: ['/school_admin/:subPage', '/school_admin/:subPage/:mode', '/schools/add', '/schools'],
			authorization: true
		},{
			href: '/#events/calendar',
			icon: 'icon_calendar',
			name: 'Events',
			key: 'Events',
			routes: ['/events/:subPage'],
			requiredData: 'userRules.activeSchoolId',
			authorization: true
		},
			{
				href: '/#invites/inbox',
				icon: 'icon_shot',
				name: 'Invites',
				key: 'Invites',
				routes: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
				requiredData: 'userRules.activeSchoolId',
				authorization: true
			}];
	},
	render: function() {
		var self = this,
			binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel">
				<Logo />
				<TopMenu items={self.menuItems} binding={binding.sub('routing')} />
				<UserBlock binding={binding.sub('userData')} />
			</div>
		)
	}
});

module.exports = Head;
