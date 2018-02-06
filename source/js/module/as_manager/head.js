// @flow

const	Logo			= require('module/as_manager/head/logo'),
		{TopMenu}		= require('module/ui/menu/top_menu'),
		UserBlock		= require('module/shared_pages/head/user_block'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		SchoolHelper	= require('module/helpers/school_helper'),
		React			= require('react'),
		Immutable		= require('immutable'),
		RoleHelper		= require('module/helpers/role_helper'),
		SessionHelper	= require('module/helpers/session_helper'),
		{Avatar} 		= require('module/ui/avatar/avatar'),
		TopNavStyle 	= require('styles/main/b_top_nav.scss'),
		Bootstrap 		= require('styles/bootstrap-custom.scss');

const Head = React.createClass({
	role: undefined,
	mixins: [Morearty.Mixin],
	listeners: [],
	componentDidMount: function() {
		this.createTopMenu();

		this.getMoreartyContext().getBinding().sub('userData.roleList.activePermission').addListener(() => {
			this.createTopMenu();
			this.initData();
			this.addListeners();
		});
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	getAndSetSchoolInfo: function() {
		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		if(typeof activeSchoolId !== 'undefined') {
			window.Server.school.get({schoolId: activeSchoolId}).then(school => {
				this.activeSchoolInfo = school;
			});
		}
	},
	initData: function() {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				kindSchool	= RoleHelper.getActiveSchoolKind(this);

		this.role = role;

		if(kindSchool === 'School') {
			this.getDefaultBinding().set('isInvitesCountNeedUpdate', false);
			this.getDefaultBinding().set('isMessagesCountNeedUpdate', false);

			if(
				role !== RoleHelper.USER_ROLES.PARENT &&
				role !== RoleHelper.USER_ROLES.STUDENT
			) {
				this.getAndSetSchoolInfo();
			}

			if(
				role !== RoleHelper.USER_ROLES.PARENT &&
				role !== RoleHelper.USER_ROLES.STUDENT
			) {
				this.setInvitesCountToMenu();
			}

			if(
				role !== RoleHelper.USER_ROLES.STUDENT
			) {
				this.setMessagesCountToMenu();
			}
		}
	},
	addListeners: function () {
		const binding = this.getDefaultBinding();

		this.listeners.push(
			binding.sub('isInvitesCountNeedUpdate')
				.addListener(eventDescriptor => {
					const isInvitesCountNeedUpdate = eventDescriptor.getCurrentValue();

					if(isInvitesCountNeedUpdate) {
						this.setInvitesCountToMenu();
						this.getDefaultBinding().set('isInvitesCountNeedUpdate', false);
					}
				})
		);

		this.listeners.push(
			binding.sub('isMessagesCountNeedUpdate')
				.addListener(eventDescriptor => {
					const isMessagesCountNeedUpdate = eventDescriptor.getCurrentValue();

					if(isMessagesCountNeedUpdate) {
						this.setMessagesCountToMenu();
						this.getDefaultBinding().set('isMessagesCountNeedUpdate', false);
					}
				})
		);
	},
	/**
	 * Function get's count of inbox invites from server and set it to Invites menu item.
	 * Also invite-list component listens count of inbox invites and update this value too.
	 * Yes, it's shitty way because child component should not update data from his parent.
	 * But there is no any other way to solve this problem while we don't have redux or something else from flux camp
	 * frameworks.
	 */
	setInvitesCountToMenu: function() {
		window.Server.inviteInboxCount.get(MoreartyHelper.getActiveSchoolId(this)).then(data => {
			if(data.count > 0) {
				const	rootBinding		= this.getMoreartyContext().getBinding(),
						topMenuItems	= rootBinding.toJS('topMenuItems');

				const inviteItemIndex = topMenuItems.findIndex(i => i.key === 'Invites');
				if(inviteItemIndex !== -1) {
					topMenuItems[inviteItemIndex].name = `Invites(${data.count})`;

					rootBinding.set('topMenuItems', Immutable.fromJS(topMenuItems));
				}
			}
		});
	},
	setMessagesCountToMenu: function() {
		const role = RoleHelper.getLoggedInUserRole(this);

		let service, params, filter;

		if(role === 'PARENT') {
			service	= window.Server.childMessageInboxCount;
			params = {};
			filter = {};
		} else {
			service = window.Server.schoolEventsMessagesInboxCount;
			params = MoreartyHelper.getActiveSchoolId(this);
			filter = {
				filter: { where: {allMessageTypes: true} }
			};
		}
		
		service.get(params ,filter).then(data => {
			if(data.count > 0) {
				const rootBinding = this.getMoreartyContext().getBinding();
				const topMenuItems = rootBinding.toJS('topMenuItems');

				const inviteItemIndex = topMenuItems.findIndex(i => i.key === 'Messages');
				if(inviteItemIndex !== -1) {
					topMenuItems[inviteItemIndex].name = `Messages(${data.count})`;

					rootBinding.set('topMenuItems', Immutable.fromJS(topMenuItems));
				}
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
				menuItems.push(this.getDemoMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.MANAGER && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getConsoleMenuItem());
				menuItems.push(this.getHelpMenuItem());
				menuItems.push(this.getDemoMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.TEACHER && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getHelpMenuItem());
				menuItems.push(this.getDemoMenuItem());
				return menuItems;
			case role === RoleHelper.USER_ROLES.COACH && kindSchool === 'School':
				menuItems = this.getMainMenuItemsForSchoolWorker();
				menuItems.push(this.getHelpMenuItem());
				menuItems.push(this.getDemoMenuItem());
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
			},
			{
				href			: '/#events/calendar',
				icon			: '',
				name			: 'Events',
				key				: 'Events',
				routes			: ['/events/:subPage'],
				authorization	: true,
				verified		: true
			},
			{
				href			: '/#invites/outbox',
				icon			: '',
				name			: 'Invites',
				key				: 'Invites',
				routes			: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
				authorization	: true,
				verified		: true
			},
			{
				href			: '/#tournaments',
				icon			: '',
				name			: 'Tournaments',
				key				: 'Tournaments',
				routes			: ['/tournaments/:subPage'],
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
			}, {
				href			: '/#clubs/clubList',
				icon			: '',
				name			: 'Clubs',
				key				: 'Clubs',
				routes			: ['/clubs/:subPage'],
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
			},
			{
				href:			'/#messages/inbox',
				name:			'Messages',
				key:			'Messages',
				authorization:	true,
				routes:			['/messages/:subPage']
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
				href:			'/#events/calendar/all',
				name:			'Calendar',
				key:			'Calendar',
				authorization:	true,
				routes:			['/events/calendar/:userId']
			},
			{
				href:			'/#events/fixtures/all',
				name:			'Fixtures',
				key:			'Fixtures',
				authorization:	true,
				routes:			['/events/fixtures/:userId']
			},
			{
				href:			'/#events/achievement/all',
				name:			'Achievements',
				key:			'Achievements',
				authorization:	true,
				routes:			['/events/achievement/:userId']
			},
			{
				href:			'/#messages/inbox',
				name:			'Messages',
				key:			'Messages',
				authorization:	true,
				routes:			['/messages/:subPage']
			},
			{
				href:	'/#help',
				name:	'Help',
				key:	'Help'
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
				href:			'/#messages/inbox',
				name:			'Messages',
				key:			'Messages',
				authorization:	true,
				routes:			['/messages/:subPage']
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
	getDemoMenuItem: function()  {
		return {
			href: '/#demo',
			name: 'Demo',
			key: 'Demo',
			authorization: true,
			routes: ['/Demo']
		}
	},
	createTopMenu: function() {
		const binding = this.getDefaultBinding();

		binding.set('topMenuItems', this.getMenuItems());
	},
	handleClickTopMenuButton: function(name, href) {
		let result = true;

		switch(name) {
			case 'Clubs': {
				result = this.activeSchoolInfo.isClubsEnabled;
				if(!result) {
					SchoolHelper.showSubscriptionPlanAlert();
				}
				break;
			}
		}

		return result;
	},
	logout:function(){
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				sessionKey 		= SessionHelper.getSessionId(globalBinding.sub('userData'));
		
		window.Server.sessionKey.delete({ key: sessionKey }).then(() => {
			window.location.hash = 'logout';
		});
	},
	render: function() {
		const	binding = this.getDefaultBinding(),
				loginSession = SessionHelper.getLoginSession(binding.sub('userData')),
				roleSession = SessionHelper.getRoleSession(binding.sub('userData'));

		if (typeof loginSession !== 'undefined') {
			return (
				<div className="bTopPanel container">
					<div className="row">
						<div className="col-md-2 col-sm-2">
							{
								roleSession ?
								<Logo/> :
								<div
									className	= "bTopLogo"
								>
									<img src="images/logo.svg"/>
								</div>
							}
						</div>
						<div className="col-md-10 col-sm-10 bTopNav">
							{
								roleSession ?
								<div>
									<TopMenu
										binding={{default: binding.sub('routing'), itemsBinding: binding.sub('topMenuItems')}}
										handleClick={(name, href) => this.handleClickTopMenuButton(name, href)}
									/>
									<UserBlock binding={binding.sub('userData')}/>
								</div>:
								<div className="bTopMenu mRight">
									<div className="bRoleList mLogout">
										<a onClick = { this.logout } className="eTopMenu_item">Log Out</a>
									</div>
									<div className="eTopMenu_photo">
										<Avatar pic={binding.get('userData.userInfo.avatar')} minValue={50} />
									</div>
								</div>
							}
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
