const	React									= require('react'),
		Morearty								= require('morearty'),
		Immutable								= require('immutable'),
		RouterView								= require('module/core/router'),
		Route									= require('module/core/route'),
		SubMenu									= require('module/ui/menu/sub_menu'),
		{SVG}									= require('module/ui/svg');

const 	AdminUserListComponent 					= require('module/as_admin/pages/admin_schools/admin_views/admin_user_list/admin_users_list'),
		UserViewComponent						= require('module/shared_pages/users/user_view'),
		AdminListComponent						= require('module/as_admin/pages/admin_schools/admin_views/admin_schools_list'),
		SchoolUnionListWrapper					= require('./school_union_list/school_union_list_wrapper'),
		SchoolUnionEdit							= require('./school_union_list/school_union_edit/school_union_edit'),
		SchoolUnionCreate						= require('./school_union_list/school_union_add/school_union_add'),
		AdminAddComponent						= require('module/as_admin/pages/admin_schools/admin_views/admin_add'),
		AdminEditComponent						= require('module/as_admin/pages/admin_schools/admin_views/admin_edit'),
		AdminRequestsComponent					= require('module/shared_pages/permission_requests/request-list'),
		AdminPermissionAcceptComponent			= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept'),
		AdminPermissionAcceptStudentComponent	= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept_student'),
		AdminArchiveComponent					= require('module/shared_pages/permission_requests/request-archive'),
		UserComponent							= require('module/as_admin/pages/admin_add/user'),
		SportsPageComponent						= require('module/as_admin/pages/admin_schools/sports/sports_page'),
		ImportStudentsComponent					= require('module/as_admin/pages/admin_schools/import_students_module'),
		UserActivityComponent					= require('module/as_admin/pages/admin_schools/user_activity/user-activity'),
		ToolsComponent							= require('module/as_admin/pages/tools/tools');

const OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	createNewSchool: function() {
		document.location.hash = 'admin_schools/admin_views/add';
	},
	//The function, which will call when user click on <Row> in Grid
	getViewFunction: function(itemId){
		document.location.hash = `school_sandbox/${itemId}/forms`;
	},
	componentWillMount: function() {
		this.createSubMenu();
	},
	componentDidMount: function() {
		const globalBinding = this.getMoreartyContext().getBinding();

		this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
	},
	getDefaultState: function() {
		return Immutable.fromJS({
			admin_views: {
				schools: [],
				schoolDetailPage: {},
				editSchoolPage: {},
				userList: {},
				parentPermission: {}
			},
			schoolInfo: '',
			schoolRouting: {},
			sports: {},
			userActivity: {},
			importStudents: {},
			schoolUnions: {},
			schoolUnionView: {},
			schoolUnionEdit: {},
			schoolUnionCreate: {form: {}}
		});
	},
	createSubMenu: function(){
		const	self	= this,
				binding	= self.getDefaultBinding();

		const _createSubMenuData = function(count){
			let menuItems = [
				{
					href:'/#admin_schools/users',
					name:'Users & Permissions',
					key:'Users'
				},
				{
					href:'/#admin_schools/admin_views/requests',
					name:'New Requests',
					key:'requests',
					num: '(' + count + ')'
				},
				{
					href:'/#admin_schools/admin_views/archive',
					name:'Requests Archive',
					key:'archive'
				},
				{
					href: '/#admin_schools/admin_views/list',
					name: 'Schools',
					key: 'schools'
				},{
					href: '/#admin_schools/school_unions',
					name: 'School Unions',
					key: 'school_unions'
				},{
				   href:'/#admin_schools/admin_views/sports',
					name:'Sports',
					key:'sports'
				},{
					href:'/#admin_schools/import_students',
					name:'Import Students',
					key:'import_students'
				},{
					href:'/#admin_schools/user_activity',
					name:'User Activity',
					key:'user-activity'
				},
				{
					href:'/#tools',
					name:'Tools',
					key:'tools'
				}
			];
			binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
		};

		_createSubMenuData('*');	// drawing placeholder

		//Get the total number of permissions (Notification badge) in submenu
		// TODO shitty way
		// server doesn't implement filters
		// so we should filter and count permissions by our hands
		return window.Server.permissionRequests.get({
				filter: {
					limit: 1000 //TODO: holy crap
				}
			})
			.then(permissions => permissions.filter(permission => permission.status === "NEW"))
			.then(permissions => {
				_createSubMenuData(permissions.length);
				// yep, always i'm right
				return true;
			});
	},
	render: function() {
		const   binding         = this.getDefaultBinding(),
				globalBinding   = this.getMoreartyContext().getBinding(),
				addButton = <div className="addButtonShort" onClick={this.createNewSchool}><SVG icon="icon_add_school" /></div>;

		return (
			<div>
				<SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
				<div className="bSchoolMaster">
					<RouterView routes={binding.sub('schoolRouting')} binding={globalBinding}>
						<Route
							path 				= "/admin_schools /admin_schools/users"
							binding 			= { binding.sub('schools') }
							component 			= { AdminUserListComponent }
						/>
						<Route
							path 				= "/admin_schools/admin_views/list /admin_schools/admin_views/list:mode"
							binding 			= { binding.sub('schools') }
							component 			= { AdminListComponent }
							addButton 			= { addButton }
							handleClick 		= { this.getViewFunction }
						/>
						<Route
							path 				= "/admin_schools/school_unions"
							binding 			= { binding.sub('schoolUnions') }
							component 			= { SchoolUnionListWrapper }
						/>
						<Route
							path 				= "/admin_schools/school_unions/add"
							binding 			= { binding.sub('schoolUnionCreate') }
							component 			= { SchoolUnionCreate }
						/>
						<Route
							path 				= "/admin_schools/school_union /admin_schools/school_union/:schoolId"
							binding 			= { binding.sub('schoolUnionEdit') }
							component 			= { SchoolUnionEdit }
						/>
						<Route
							path 				= "/admin_schools/admin_views/add /admin_schools/admin_views/add:mode"
							binding 			= { binding.sub('addSchoolPage') }
							component 			= { AdminAddComponent }
						/>
						<Route
							path 				= "/admin_schools/admin_views/edit /admin_schools/admin_views/edit:mode"
							binding 			= { binding.sub('editSchoolPage') }
							component 			= { AdminEditComponent }
						/>
						<Route
							path 				= "/admin_schools/admin_views/requests"
							binding 			= { binding.sub('schools') }
							component 			= { AdminRequestsComponent }
						/>
						<Route
							path 				= "/admin_schools/admin_views/requests/accept"
							binding 			= { binding.sub('parentPermission') }
							component 			= { AdminPermissionAcceptComponent }
							afterSubmitPage 	= "/admin_schools/admin_views/requests"
						/>
						<Route
							path 				= "/admin_schools/admin_views/requests/accept-student"
							binding 			= { binding.sub('studentPermission') }
							component 			= { AdminPermissionAcceptStudentComponent }
							afterSubmitPage 	= "/admin_schools/admin_views/requests"
						/>
						<Route
							path 				= "/admin_schools/admin_views/archive"
							binding 			= { binding.sub('schools') }
							component 			= { AdminArchiveComponent }
						/>
						<Route
							path 				= "/admin_schools/admin_views/create_user"
							binding 			= { binding.sub('userDetailPage') }
							component 			= { UserComponent }
						/>
						<Route
							path 				= "/admin_schools/admin_views/sports /admin_schools/admin_views/sports/:mode"
							binding 			= { binding.sub('sports') }
							component 			= { SportsPageComponent }
						/>
						<Route
							path 				= "/admin_schools/import_students"
							binding 			= { binding.sub('importStudents') }
							component 			= { ImportStudentsComponent }
						/>
						<Route
							path 				= "/admin_schools/user_activity"
							binding 			= { binding.sub('userActivity') }
							component 			= { UserActivityComponent }
						/>
						<Route
							path 				= "/tools"
							binding 			= { binding.sub('tools') }
							component 			= { ToolsComponent }
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = OneSchoolPage;
