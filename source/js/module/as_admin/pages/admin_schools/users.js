/**
 * Created by Vitaly on 09.08.17.
 */
const	React									= require('react'),
        Morearty								= require('morearty'),
        Immutable								= require('immutable'),
        RouterView								= require('module/core/router'),
        Route									= require('module/core/route'),
        SubMenu									= require('module/ui/menu/sub_menu'),
        SVG										= require('module/ui/svg');

const 	AdminUserListComponent 					= require('module/as_admin/pages/admin_schools/admin_views/admin_users_list'),
        AdminRequestsComponent					= require('module/shared_pages/permission_requests/request-list'),
        AdminArchiveComponent					= require('module/shared_pages/permission_requests/request-archive'),
	    AdminPermissionAcceptComponent			= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept'),
        UserComponent							= require('module/as_admin/pages/admin_add/user'),
        UserActivityComponent					= require('module/as_admin/pages/admin_schools/user_activity/user-activity');

const OneSchoolPage = React.createClass({
    mixins: [Morearty.Mixin],
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
            userActivity: {}
        });
    },
    createSubMenu: function(){
        const	self	= this,
                binding	= self.getDefaultBinding();

        const _createSubMenuData = function(count){
            let menuItems = [
                {
                    href:'/#users/users',
                    name:'Users & Permissions',
                    key:'Users'
                },
                {
                    href:'/#users/admin_views/requests',
                    name:'New Requests',
                    key:'requests',
                    num: '(' + count + ')'
                },
                {
                    href:'/#users/admin_views/archive',
                    name:'Requests Archive',
                    key:'archive'
                },{
                    href:'/#users/user_activity',
                    name:'User Activity',
                    key:'user-activity'
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
                globalBinding   = this.getMoreartyContext().getBinding();

        return (
            <div>
                <SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
                <div className="bSchoolMaster">
                    <RouterView routes={binding.sub('schoolRouting')} binding={globalBinding}>
                        <Route
                            path 				= "/users /users/users"
                            binding 			= { binding.sub('schools') }
                            component 			= { AdminUserListComponent }
                        />
                        <Route
                            path 				= "/users/admin_views/requests"
                            binding 			= { binding.sub('schools') }
                            component 			= { AdminRequestsComponent }
                        />
                        <Route
                            path 				= "/users/admin_views/archive"
                            binding 			= { binding.sub('schools') }
                            component 			= { AdminArchiveComponent }
                        />
                        <Route
                            path 				= "/users/user_activity"
                            binding 			= { binding.sub('userActivity') }
                            component 			= { UserActivityComponent }
                        />
                        <Route
                            path 				= "/users/admin_views/create_user"
                            binding 			= { binding.sub('userDetailPage') }
                            component 			= { UserComponent }
                        />
                        <Route
                            path 				= "/users/admin_views/requests/accept"
                            binding 			= { binding.sub('parentPermission') }
                            component 			= { AdminPermissionAcceptComponent }
                            afterSubmitPage 	= "/users/admin_views/requests"
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});

module.exports = OneSchoolPage;
