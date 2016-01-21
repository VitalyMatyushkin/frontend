/**
 * Created by bridark on 19/06/15.
 */
const   RouterView  = require('module/core/router'),
        Route       = require('module/core/route'),
        SubMenu     = require('module/ui/menu/sub_menu'),
        React       = require('react'),
        Immutable   = require('immutable');

let liveRequestCount;

const SchoolConsole = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            permissions: {},
            requests: {},
            decline: {
                type: 'decline'
            },
            cancel: {
                type: 'cancel'
            },
            consoleRouting: {},
            parentPermission: {}
        });
    },
    componentWillMount: function () {
        this.createSubMenu();
    },
    createSubMenu: function(){
        const self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            serviceCount = 'schoolPermissionsCount',
            where = {and:[{accepted:{neq:true}},{accepted:{neq:false}}]};

        const _createSubMenuData = function(count){
            let menuItems = [{
                href: '/#school_console/permissions',
                name: 'Permissions',
                key: 'Permissions'
            },{
                href: '/#school_console/requests',
                name: 'Live Requests',
                key: 'requests',
                num: '(' + count + ')'
            },{
                href: '/#school_console/archive',
                name: 'request archive',
                key: 'archive'
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

        return <div>
            <SubMenu binding={{ default: binding.sub('consoleRouting'), itemsBinding: binding.sub('subMenuItems') }} />
            <div className='bSchoolMaster'>
                <RouterView routes={ binding.sub('consoleRouting') } binding={globalBinding || {}}>
                    <Route path='/school_console' binding={binding.sub('permissions')} component='module/as_manager/pages/school_console/views/permissions'  />
                    <Route path='/school_console/permissions' binding={binding.sub('permissions')} component='module/as_manager/pages/school_console/views/permissions'  />
                    <Route path='/school_console/requests' binding={binding.sub('requests')} component='module/as_manager/pages/school_console/views/requests'  />
                    <Route path="/school_console/requests/accept" binding={binding.sub('parentPermission')} component="module/as_admin/pages/admin_schools/admin_views/admin_permission_accept"  afterSubmitPage="/school_console/requests"/>
                    <Route path='/school_console/archive' binding={binding.sub('archives')} component='module/as_admin/pages/admin_schools/admin_views/admin_archive'  />
                </RouterView>
            </div>
        </div>;
    }
});


module.exports = SchoolConsole;
