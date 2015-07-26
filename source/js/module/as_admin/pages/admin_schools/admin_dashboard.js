var OneSchoolPage,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/menu/sub_menu');

OneSchoolPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
        //TODO: Test purpose get the number of new requests - refactoring needed
        window.Server.schools.get({
            filter:{
                include:{
                    relation:'permissions'
                }
            }
        }).then(function(results){
            binding
                .atomically()
                .set('permissionRequestCount', Immutable.fromJS(results))
                .set('sync',true)
                .commit();
        });
        self.menuItems = [
            {
                href:'/#admin_schools/permissions',
                name:'Users & Permissions',
                key:'Permissions'
            },
            {
                href:'/#admin_schools/admin_views/requests',
                name:'New Requests',
                key:'requests'
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
            }]
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            admin_views: {
                schools: [],
                schoolDetailPage: {},
                editSchoolPage: {},
                userList:{}
            },
            schoolInfo: '',
            schoolRouting: {}
        });
    },
    _countLiveRequests:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            num = 0,
            reqs = binding.toJS('permissionRequestCount');
        if(typeof reqs !== 'undefined'){
            reqs.forEach(function(req){
                if(req.permissions.length >=1){
                    for(var i=0; i < req.permissions.length; i++){
                        if(typeof req.permissions[i].accepted === 'undefined'){
                            num +=1;
                        }
                    }
                }
            });
        }
        return num;
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
        var badge = document.querySelectorAll('.eSubMenu_item')[1];
        if(badge !== undefined){
            badge.innerText = "New Requests ( "+self._countLiveRequests()+" )";
        }
        return (
            <div>
                <SubMenu binding={binding.sub('schoolRouting')} items={self.menuItems} />
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
                        <Route path="/admin_schools/admin_views/archive" binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_archive"/>
                        <Route path="/admin_schools/admin_views/logs" binding={binding.sub('logs')} component="module/as_admin/pages/admin_schools/admin_views/admin_activityLogs"/>
                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = OneSchoolPage;
