// @flow

const	Logo			= require('module/as_manager/head/logo'),
		TopMenu			= require('module/ui/menu/top_menu'),
		UserBlock		= require('module/shared_pages/head/user_block'),
		If				= require('module/ui/if/if'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		React			= require('react'),
		Immutable		= require('immutable'),
		TopNavStyle 	= require('styles/main/b_top_nav.scss'),
		Bootstrap  		= require('styles/bootstrap-custom.scss'),

		RoleHelper		= require('../helpers/role_helper');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount:function(){
		this.createTopMenu();
		this.getMoreartyContext().getBinding().sub('userData.roleList.activePermission').addListener(() => {
			this.createTopMenu();
			this.initData();
		});
	},
	initData: function() {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				kindSchool	= RoleHelper.getActiveSchoolKind(this);

		if(
			role !== RoleHelper.USER_ROLES.PARENT &&
			role !== RoleHelper.USER_ROLES.STUDENT &&
			kindSchool === 'School'
		) {
			this.setInvitesCountToMenu();
		}
	},
	/**
	 * Function get's count of inbox invites from server and set it to Invites menu item.
	 * Also invite-list component listens count of inbox invites and update this value too.
	 * Yes, it's shitty way because child component should not update data from his parent.
	 * But there is no any other way to solve this problem while we don't have redux or something else from flux camp
	 * frameworks.
	 */
	setInvitesCountToMenu: function() {
		window.Server.schoolInboxInvites.get(MoreartyHelper.getActiveSchoolId(this)).then(data => {
			if(data.length > 0) {
				const	rootBinding		= this.getMoreartyContext().getBinding(),
						topMenuItems	= rootBinding.toJS('topMenuItems');

				const inviteItemIndex = topMenuItems.findIndex(i => i.key === 'Invites');
				topMenuItems[inviteItemIndex].name = `Invites(${data.length})`;

				rootBinding.set('topMenuItems', Immutable.fromJS(topMenuItems));
			}
		});
	},
	getMenuItems: function() {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				kindSchool	= RoleHelper.getActiveSchoolKind(this);

		let menuItems = [];
		switch (true) {
			case typeof role === "undefined":
				return menuItems;
			case role === RoleHelper.USER_ROLES.ADMIN && kindSchool === 'SchoolUnion':
				menuItems = this.getMainMenuItemsForSchoolUnionAdmin();
				menuItems.push(this.getSchoolUnionConsoleMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.ADMIN && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getConsoleMenuItem());
				menuItems.push(this.getHelpMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.MANAGER && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getConsoleMenuItem());
				menuItems.push(this.getHelpMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.TEACHER && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getHelpMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.TRAINER && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getHelpMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.PARENT && kindSchool === 'School':
				return this.getMainMenuItemsForParent();
			case role === RoleHelper.USER_ROLES.STUDENT && kindSchool === 'School':
				return this.getMainMenuItemsForStudent();
		}
	},
	getMainMenuItemsForSchoolUnionAdmin: function() {
		return [
			{
				href			: '/#school_union_admin/summary',
				icon			: '',
				name			: 'School Union',
				key				: 'SchoolUnion',
				routes			: ['/school_union_admin/:subPage'],
				authorization	: true,
				verified		: true
			}
		];
	},
	/**
	 * Return main menu items for school worker roles:
	 * ADMIN, MANAGER, TEACHER, COACH
	 * @returns {*[]}
	 */
	getMainMenuItemsForSchoolWorker: function() {
		return [
			{
				href			: '/#school_admin/summary',
				icon			: '',
				name			: 'School',
				key				: 'School',
				routes			: ['/school_admin/:subPage', '/school_admin/:subPage/:mode', '/schools/add', '/schools'],
				authorization	: true,
				verified		: true
			}, {
				href			: '/#events/calendar',
				icon			: '',
				name			: 'Events',
				key				: 'Events',
				routes			: ['/events/:subPage'],
				authorization	: true,
				verified		: true
			},
			{
				href			: '/#invites/inbox',
				icon			: '',
				name			: 'Invites',
				key				: 'Invites',
				routes			: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
				authorization	: true,
				verified		: true
			}
		];
	},
	/**
	 * Return main menu items for PARENT role.
	 * @returns {*[]}
	 */
	getMainMenuItemsForParent: function() {
		return [
			{
				href: '/#events/calendar/all',
				name: 'Calendar',
				key: 'Calendar',
				authorization: true,
				routes: ['/events/calendar/:userId']
			}, {
				href: '/#events/fixtures/all',
				name: 'Fixtures',
				key: 'Fixtures',
				authorization: true,
				routes: ['/events/fixtures/:userId']
			}, {
				href: '/#events/achievement/all',
				name: 'Achievements',
				key: 'Achievements',
				authorization: true,
				routes: ['/events/achievement/:userId']
			}, {
				href: '/#help',
				name: 'Help',
				key: 'Help'
			}
		];
	},
	/**
	 * Return main menu items for STUDENT role.
	 * @returns {*[]}
	 */
	getMainMenuItemsForStudent: function() {
		return [
			{
				href: '/#events/calendar/all',
				name: 'Calendar',
				key: 'Calendar',
				authorization: true,
				routes: ['/events/calendar/:schoolId']
			}, {
				href: '/#events/fixtures/all',
				name: 'Fixtures',
				key: 'Fixtures',
				authorization: true,
				routes: ['/events/fixtures/:schoolId']
			}, {
				href: '/#events/achievement/all',
				name: 'Achievements',
				key: 'Achievements',
				authorization: true,
				routes: ['/events/achievement/:schoolId']
			}, {
				href: '/#help',
				name: 'Help',
				key: 'Help'
			}
		];
	},
	getSchoolUnionConsoleMenuItem: function() {
		return {
			href			: '/#school_union_console/users',
			icon			: '',
			name			: 'Console',
			key				: 'Console',
			routes			: ['/school_union_console/:subPage', '/school_union_console/:filter', '/school_union_console/:inviteId/:mode'],
			authorization	: true,
			verified		: true
		};
	},
	getConsoleMenuItem: function() {
		return {
			href			: '/#school_console/users',
			icon			: '',
			name			: 'Console',
			key				: 'Console',
			routes			: ['/school_console/:subPage', '/school_console/:filter', '/school_console/:inviteId/:mode'],
			authorization	: true,
			verified		: true
		};
	},
	getHelpMenuItem: function() {
		return {
			href	: '/#help',
			name	: 'Help',
			key		: 'Help'
		};
	},
	createTopMenu: function() {
		const binding = this.getDefaultBinding();

		binding.set('topMenuItems', this.getMenuItems());
	},
	render: function() {
		const binding = this.getDefaultBinding();
		if (document.location.hash != '#login') {
			return (
				<div className="bTopPanel container">
					<div className="row">
						<div className="col-md-2 col-sm-2">
							<Logo/>
						</div>
						<div className="col-md-10 col-sm-10 bTopNav">
							<TopMenu
								binding={{default: binding.sub('routing'), itemsBinding: binding.sub('topMenuItems')}}/>
							<If condition={document.location.hash.indexOf('login') === -1}>
								<UserBlock binding={binding.sub('userData')}/>
							</If>
						</div>
					</div>

				</div>
			)
		} else {
			return (<div></div>)
		}
	}
});

module.exports = Head;
