const   RouterView  = require('module/core/router'),
        Route       = require('module/core/route'),
        React       = require('react'),
        SubMenu     = require('module/ui/menu/sub_menu'),
        Immutable   = require('immutable');

const OneSchoolPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        this.createSubMenu();
    },
    componentDidMount: function(){
        var self = this,
            globalBinding = self.getMoreartyContext().getBinding();
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
            schoolRouting: {}
        });
    },
    createSubMenu: function(){
        const self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            serviceCount = 'PermissionCount',
            where = {and:[{accepted:{neq:true}},{accepted:{neq:false}}]};

        const _createSubMenuData = function(count){
            let menuItems = [
                {
                    href:'/#admin_schools/permissions',
                    name:'Users & Permissions',
                    key:'Permissions'
                },
                {
                    href:'/#admin_schools/admin_views/requests',
                    name:'New Requests',
                    key:'requests',
                    num: '(' + count + ')'
                },
                {
                    href:'/#admin_schools/admin_views/archive',
                    name:'Request Archive',
                    key:'archive'
                },
                {
                    href: '/#admin_schools/admin_views/list',
                    name: 'schools',
                    key: 'schools'
                },{
                    href:'/#admin_schools/admin_views/logs',
                    name:'Activity Log',
                    key:'Log'
                }];
            binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
        };

        //Get the total number of permissions (Notification badge) in submenu
        window.Server[serviceCount].get(activeSchoolId, { where: where }).then(function(data){
            const count = data && data.count ? data.count : 0;
            _createSubMenuData(count);
        });
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
        return (
            <div>
                <SubMenu binding={{ default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems') }} />
                <div className="bSchoolMaster">
                    <RouterView routes={ binding.sub('schoolRouting') } binding={globalBinding}>
                        <Route path="/admin_schools " binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_permissionList"/>
                        <Route path="/admin_schools/admin_views/list /admin_schools/admin_views/list:mode" binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_list"/>
                        <Route path="/admin_schools/admin_views/detail /admin_schools/admin_views/detail:mode" binding={binding.sub('SchoolDetailPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_detail" />
                        <Route path="/admin_schools/admin_views/add /admin_schools/admin_views/add:mode" binding={binding.sub('addSchoolPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_add"/>
                        <Route path="/admin_schools/admin_views/users /admin_schools/admin_views/users:mode" binding={binding.sub('userList')} component="module/as_admin/pages/admin_schools/admin_views/admin_users"/>
                        <Route path="/admin_schools/admin_views/edit /admin_schools/admin_views/edit:mode" binding={binding.sub('editSchoolPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_edit"/>
                        <Route path="/admin_schools/admin_views/user /admin_schools/admin_views/user:mode" binding={binding.sub('userDetailPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_user"/>
                        <Route path="/admin_schools/admin_views/modify /admin_schools/admin_views/modify:mode" binding={binding.sub('userEditPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_modify"/>
                        <Route path="/admin_schools/permissions" binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_permissionList"/>
                        <Route path="/admin_schools/admin_views/requests" binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_requests"/>
                        <Route path="/admin_schools/admin_views/requests/accept" binding={binding.sub('parentPermission')} component="module/as_admin/pages/admin_schools/admin_views/admin_permission_accept" afterSubmitPage="/admin_schools/admin_views/requests"/>
                        <Route path="/admin_schools/admin_views/archive" binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_archive"/>
                        <Route path="/admin_schools/admin_views/logs" binding={binding.sub('logs')} component="module/as_admin/pages/admin_schools/admin_views/admin_activityLogs"/>
                    </RouterView>
                </div>
            </div>
        )
    }
});

module.exports = OneSchoolPage;
