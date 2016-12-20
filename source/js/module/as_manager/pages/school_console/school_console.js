/**
 * Created by bridark on 19/06/15.
 */
const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),

		RouterView						= require('module/core/router'),
		Route							= require('module/core/route'),
		SubMenu							= require('module/ui/menu/sub_menu'),

		UsersComponent					= require('module/as_manager/pages/school_console/views/users'),
		AdminRequestsComponent 			= require('./views/requests'),
		ImportStudents					= require('module/as_manager/pages/school_console/views/import_students'),
		RequestArchiveComponent			= require('./views/request_archive'),
		AdminPermissionAcceptComponent	= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept'),
		ModerationPage					= require('./views/moderation_page/moderation_page'),

		MoreartyHelper					= require('module/helpers/morearty_helper');

const SchoolConsole = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			permissions			: {},
			requests			: {},
			decline				: {
									type: 'decline'
								},
			cancel				: {
									type: 'cancel'
								},
			consoleRouting		: {},
			parentPermission	: {},
			moderation			: {
				moderationForm: {

				}
			}
		});
	},
	componentWillMount: function () {
		const	rootBinding		= this.getMoreartyContext().getBinding(),
				role 			= rootBinding.get('userData.authorizationInfo.role');

		if(role !== "ADMIN" && role !== "MANAGER") {
			document.location.hash = 'school_admin/summary';
		} else {
			this.createSubMenu();
		}
	},
	componentDidMount: function() {
		const globalBinding = this.getMoreartyContext().getBinding();

		this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
	},
	createSubMenu: function() {
		const	binding			= this.getDefaultBinding(),
				viewerRole		= this.getMoreartyContext().getBinding().get('userData.authorizationInfo.role'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(this);

		let		allowImportStudent  = false;

		binding.set('allowImportStudent', Immutable.fromJS(allowImportStudent));
		window.Server.school.get(activeSchoolId).then(schoolData => {
			allowImportStudent = typeof schoolData.studentImportForAdminAllowed === 'undefined' ? false : schoolData.studentImportForAdminAllowed;
			binding.set('allowImportStudent', Immutable.fromJS(allowImportStudent));
		});

		const _createSubMenuData = function(count){

			if (allowImportStudent) {
				let menuItems = [{
								href	: '/#school_console/users',
								name	: 'Users & Permissions',
								key		: 'Users'
							},{
								href	: '/#school_console/requests',
								name	: 'New Requests',
								key		: 'requests',
								num		: '(' + count + ')'
							},{
								href	: '/#school_console/archive',
								name	: 'Requests Archive',
								key		: 'archive'
							},{
								href	: '/#school_console/import_students',
								name	: 'Import Students',
								key		: 'import'
							}];

				binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
			} else {
				let menuItems = [{
						href	: '/#school_console/users',
						name	: 'Users & Permissions',
						key		: 'Users'
					},{
						href	: '/#school_console/requests',
						name	: 'New Requests',
						key		: 'requests',
						num		: '(' + count + ')'
					},{
						href	: '/#school_console/archive',
						name	: 'Requests Archive',
						key		: 'archive'
					},{
						href	: '/#school_console/moderation',
						name	: 'Moderation',
						key		: 'moderation'
					}];

				binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
			}
		}

		let requestFilter = {
			status: 'NEW'
		};

		// Manager cannot see admin permission requests
		if(viewerRole === 'MANAGER') {
			requestFilter['requestedPermission.preset'] = { $ne: 'ADMIN'};
		}

		// drawing placeholder
		_createSubMenuData('*');

		//Get the total number of permissions (Notification badge) in submenu
		return window.Server.permissionRequests.get(
			MoreartyHelper.getActiveSchoolId(this),
			{
				filter: {
					limit: 1000,
					where: requestFilter
				}
			}
		)
		.then(permissions => {
			_createSubMenuData(permissions.length);
			// yep, always i'm right
			return true;
		});
	},

	render: function() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={{ default: binding.sub('consoleRouting'), itemsBinding: binding.sub('subMenuItems') }} />
				<div className='bSchoolMaster'>
					<RouterView routes={ binding.sub('consoleRouting') } binding={globalBinding || {}}>
						<Route path='/school_console /school_console/users' binding={binding.sub('users')} component={UsersComponent}/>
						<Route path='/school_console/requests' binding={binding.sub('requests')} component={AdminRequestsComponent}/>
						<Route path="/school_console/requests/accept" binding={binding.sub('parentPermission')} component={AdminPermissionAcceptComponent}  afterSubmitPage="/school_console/requests"/>
						<Route path='/school_console/archive' binding={binding.sub('archives')} component={RequestArchiveComponent}/>
						<Route path='/school_console/import_students' binding={binding.sub('import')} component={ImportStudents}/>
						<Route path='/school_console/moderation' binding={binding.sub('moderation')} component={ModerationPage}/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = SchoolConsole;