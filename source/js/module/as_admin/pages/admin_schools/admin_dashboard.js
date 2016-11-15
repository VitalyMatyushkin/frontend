const   RouterView  					= require('module/core/router'),
        Route       					= require('module/core/route'),
        React       					= require('react'),
        SubMenu     					= require('module/ui/menu/sub_menu'),
        Morearty    					= require('morearty'),
        Immutable   					= require('immutable'),
        AdminUserListComponent 			= require('module/as_admin/pages/admin_schools/admin_views/admin_users_list'),
		UserViewComponent 				= require('module/shared_pages/users/user_view'),
		AdminListComponent 				= require('module/as_admin/pages/admin_schools/admin_views/admin_list'),
		AdminAddComponent 				= require('module/as_admin/pages/admin_schools/admin_views/admin_add'),
		AdminEditComponent 				= require('module/as_admin/pages/admin_schools/admin_views/admin_edit'),
		AdminRequestsComponent 			= require('module/shared_pages/permission_requests/request-list'),
		AdminPermissionAcceptComponent 	= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept'),
		AdminArchiveComponent			= require('module/shared_pages/permission_requests/request-archive'),
		UserComponent 					= require('module/as_admin/pages/admin_add/user'),
		SportsPageComponent 			= require('module/as_admin/pages/admin_schools/sports/sports_page'),
		ImportStudentsComponent 		= require('module/as_admin/pages/admin_schools/import_students_module'),
		UserActivityComponent 			= require('module/as_admin/pages/admin_schools/user_activity/user_activity');

const OneSchoolPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        this.createSubMenu();
    },
    componentDidMount: function(){
        const   self            = this,
                globalBinding   = self.getMoreartyContext().getBinding();
        self.addBindingListener(globalBinding, 'submenuNeedsUpdate', self.createSubMenu);
    },
    getDefaultState: function () {
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
            importStudents: {}
        });
    },
    createSubMenu: function(){
        const   self    = this,
                binding = self.getDefaultBinding();

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
                    key:'user_activity'
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
        const   self            = this,
                binding         = self.getDefaultBinding(),
                globalBinding   = self.getMoreartyContext().getBinding();
        return (
            <div>
                <SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
                <div className="bSchoolMaster">
                    <RouterView routes={binding.sub('schoolRouting')} binding={globalBinding}>
                        <Route
                            path="/admin_schools /admin_schools/users"
                            binding={binding.sub('schools')}
                            component={AdminUserListComponent}
                        />
                        <Route
                            path="/user/view"
                            binding={binding.sub('userDetailPage')}
                            component={UserViewComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/list /admin_schools/admin_views/list:mode"
                            binding={binding.sub('schools')}
                            component={AdminListComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/add /admin_schools/admin_views/add:mode"
                            binding={binding.sub('addSchoolPage')}
                            component={AdminAddComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/edit /admin_schools/admin_views/edit:mode"
                            binding={binding.sub('editSchoolPage')}
                            component={AdminEditComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/requests"
                            binding={binding.sub('schools')}
                            component={AdminRequestsComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/requests/accept"
                            binding={binding.sub('parentPermission')}
                            component={AdminPermissionAcceptComponent}
                            afterSubmitPage="/admin_schools/admin_views/requests"
                        />
                        <Route
                            path="/admin_schools/admin_views/archive"
                            binding={binding.sub('schools')}
                            component={AdminArchiveComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/create_user"
                            binding={binding.sub('userDetailPage')}
                            component={UserComponent}
                        />
                        <Route
                            path="/admin_schools/admin_views/sports /admin_schools/admin_views/sports/:mode"
                            binding={binding.sub('sports')}
                            component={SportsPageComponent}
                        />
                        <Route
                            path="/admin_schools/import_students"
                            binding={binding.sub('importStudents')}
                            component={ImportStudentsComponent}
                        />
                        <Route
                            path="/admin_schools/user_activity"
                            binding={binding.sub('userActivity')}
                            component={UserActivityComponent}
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});

module.exports = OneSchoolPage;
