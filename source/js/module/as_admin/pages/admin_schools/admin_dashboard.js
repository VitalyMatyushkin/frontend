var OneSchoolPage,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/menu/sub_menu');

OneSchoolPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('routing.parameters.id');
        if (!activeSchoolId) {
            document.location.hash = 'admin_schools/admin_views/list';
        }
        self.menuItems = [{
                href: '/#admin_schools/admin_views/list',
                name: 'schools',
                key: 'schools'
            },
            {
                href:'/#admin_schools/admin_views/users',
                name:'users',
                key:'users'
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
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        return (
            <div>
                <SubMenu binding={binding.sub('schoolRouting')} items={self.menuItems} />
                <div className="bSchoolMaster">
                    <RouterView routes={ binding.sub('schoolRouting') } binding={globalBinding}>
                        <Route path="/admin_schools/admin_views/list /admin_schools/admin_views/list:mode" binding={binding.sub('schools')} component="module/as_admin/pages/admin_schools/admin_views/admin_list"/>
                        <Route path="/admin_schools/admin_views/detail /admin_schools/admin_views/detail:mode" binding={binding.sub('SchoolDetailPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_detail" />
                        <Route path="/admin_schools/admin_views/add /admin_schools/admin_views/add:mode" binding={binding.sub('addSchoolPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_add"/>
                        <Route path="/admin_schools/admin_views/users /admin_schools/admin_views/users:mode" binding={binding.sub('userList')} component="module/as_admin/pages/admin_schools/admin_views/admin_users"/>
                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = OneSchoolPage;
