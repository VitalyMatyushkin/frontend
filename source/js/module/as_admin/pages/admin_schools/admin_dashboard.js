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
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        document.location.hash = 'admin_schools/admin_views/list';
        //if (!activeSchoolId) {
        //    document.location.hash = 'schools';
        //} else {
        //    window.Server.school.get(activeSchoolId).then(function (data) {
        //        binding.set('schoolInfo', Immutable.fromJS(data));
        //    });
        //}

        // Пункты подменю
        //self.menuItems = [{
        //    href: '/#admin_schools/list',
        //    name: 'List of Schools',
        //    key: 'List of Schools'
        //},{
        //    href: '/#admin_schools/students',
        //    name: 'Students',
        //    key: 'Students'
        //},{
        //    href: '/#school_admin/forms',
        //    name: 'Forms',
        //    key: 'Forms'
        //},{
        //    href: '/#school_admin/houses',
        //    name: 'Houses',
        //    key: 'Houses'
        //},{
        //    href: '/#school_admin/news',
        //    name: 'News',
        //    key: 'News'
        //},{
        //    href: '/#school_admin/coaches',
        //    name: 'Coaches',
        //    key: 'Coaches'
        //}];
        self.menuItems = [{
            href: '/#admin_schools/admin_views/list',
            name: 'schools',
            key: 'schools'
        }]
    },

    getDefaultState: function () {
        return Immutable.fromJS({
            admin_views: {
                schools: [],
                schoolDetailPage: {},
                editSchoolPage: {}
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
                        <Route path="/admin_schools/admin_views/edit /admin_schools/admin_views/edit:mode" binding={binding.sub('editSchoolPage')} component="module/as_admin/pages/admin_schools/admin_views/admin_edit"/>
                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = OneSchoolPage;
