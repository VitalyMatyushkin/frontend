/**
 * Created by bridark on 19/06/15.
 */
const	React									= require('react'),
		Morearty								= require('morearty'),
		Immutable								= require('immutable'),

		RouterView								= require('module/core/router'),
		Route									= require('module/core/route'),
		SubMenu									= require('module/ui/menu/sub_menu'),

		UsersComponent							= require('module/as_manager/pages/school_console/views/users'),
		AdminRequestsComponent 					= require('./views/requests'),
		ImportStudents							= require('module/as_manager/pages/school_console/views/import_students'),
		RequestArchiveComponent					= require('./views/request_archive'),
		AdminPermissionAcceptComponent			= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept'),
		AdminPermissionAcceptStudentComponent 	= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept_student'),
		ModerationPage							= require('./views/moderation_page/moderation_page'),
		IntegrationPage							= require('./views/integration-page/integration-page'),
		SportsPage								= require('./views/sports_page/sport_page_wrapper'),
		PlacesPage								= require('./views/places_page/places_page'),

		MoreartyHelper							= require('module/helpers/morearty_helper');

const SchoolConsole = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			permissions: {},
			requests: {},
			decline: {type: 'decline'},
			cancel: {type: 'cancel'},
			consoleRouting: {},
			parentPermission: {},
			moderation: {moderationForm: {}},
			sports: {},
			places: {
				placesRouting: {},
				placeList: {},
				placeView: {},
				placeAdd: {
					placeForm: {
						form: {}
					}
				},
				placeEdit: {
					placeForm: {
						form: {}
					}
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
			window.Server.school.get(MoreartyHelper.getActiveSchoolId(this)).then(school => {
				this.activeSchoolInfo = school;

				if(typeof this.activeSchoolInfo.studentImportForAdminAllowed === 'undefined') {
					this.activeSchoolInfo.studentImportForAdminAllowed = false;
				}

				this.createSubMenu();
			});
		}
	},
	componentDidMount: function() {
		const globalBinding = this.getMoreartyContext().getBinding();

		this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
	},
	createSubMenu: function() {
		const viewerRole = this.getMoreartyContext().getBinding().get('userData.authorizationInfo.role');

		let requestFilter = {
			status: 'NEW'
		};

		// Manager cannot see admin permission requests
		if(viewerRole === 'MANAGER') {
			requestFilter['requestedPermission.preset'] = { $ne: 'ADMIN'};
		}

		// drawing placeholder
		this.createSubMenuData('*');

		//Get the total number of permissions (Notification badge) in submenu
		return window.Server.permissionRequests.get(
			this.activeSchoolInfo.id,
			{
				filter: {
					limit: 1000,
					where: requestFilter
				}
			}
		).then(permissions => {
			this.createSubMenuData(permissions.length);
			// yep, always i'm right
			return true;
		});
	},
	createSubMenuData: function(count) {
		const	binding		= this.getDefaultBinding(),
				viewerRole	= this.getMoreartyContext().getBinding().get('userData.authorizationInfo.role');

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
		},{
			href	: '/#school_console/places',
			name	: 'Places',
			key		: 'places'
		}];
		//we must show link with import only school with allowImportStudent flag === true
		if (this.activeSchoolInfo.allowImportStudent) {
			menuItems.push({
				href: '/#school_console/import_students',
				name: 'Import Students',
				key: 'import'
			});
		}
		//we must show link integration only admin of school
		if (viewerRole === 'ADMIN') {
			menuItems.push({
				href: '/#school_console/integration',
				name: 'Integration',
				key: 'integration'
			});
		}
		if (viewerRole === 'ADMIN' && this.activeSchoolInfo.canEditFavoriteSports) {
			menuItems.push({
				href: '/#school_console/sports',
				name: 'Sports',
				key: 'sports'
			});
		}

		binding.set('subMenuItems', Immutable.fromJS(menuItems));
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
						<Route path="/school_console/requests/accept-student" binding={binding.sub('studentPermission')} component={AdminPermissionAcceptStudentComponent}  afterSubmitPage="/school_console/requests"/>
						<Route path='/school_console/archive' binding={binding.sub('archives')} component={RequestArchiveComponent}/>
						<Route path='/school_console/import_students' binding={binding.sub('import')} component={ImportStudents}/>
						<Route path='/school_console/moderation' binding={binding.sub('moderation')} component={ModerationPage}/>
						<Route path='/school_console/integration' binding={binding.sub('integration')} component={IntegrationPage}/>
						<Route path='/school_console/sports' binding={binding.sub('sports')} component={SportsPage}/>
						<Route path='/school_console/places' binding={binding.sub('places')} component={PlacesPage}/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = SchoolConsole;