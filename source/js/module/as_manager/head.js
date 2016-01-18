var Logo = require('module/as_manager/head/logo'),
	TopMenu = require('module/ui/menu/top_menu'),
	UserBlock = require('module/as_manager/head/user_block'),
	If = require('module/ui/if/if'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	Head;

Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this;

		self.menuItems = [
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
				requiredData: 'userRules.activeSchoolId',
				authorization: true,
				verified: true
			},
			{
				href: '/#invites/inbox',
				icon: '',
				name: 'Invites',
				key: 'Invites',
				routes: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
				requiredData: 'userRules.activeSchoolId',
				authorization: true,
				verified: true
			}, {
				href: '/#school_console/permissions',
				icon: '',
				name: 'Console',
				key: 'Console',
				routes: ['/school_console/:subPage', '/school_console/:filter', '/school_console/:inviteId/:mode'],
				requiredData: 'userRules.activeSchoolId',
				authorization: true,
				verified: true
			}
		];
	},
	render: function() {
		var self = this,
			binding = this.getDefaultBinding();
		return (
			<div className="bTopPanel">
				<Logo />
                <If condition={document.location.hash.indexOf('general')!== 10}>
                    <If condition={document.location.hash.indexOf('lounge') === -1}>
                        <TopMenu items={self.menuItems} binding={binding.sub('routing')}/>
                    </If>
                </If>
				<If condition={document.location.hash.indexOf('login') === -1}>
					<UserBlock binding={binding.sub('userData')}/>
				</If>
			</div>
		)
	}
});

module.exports = Head;
