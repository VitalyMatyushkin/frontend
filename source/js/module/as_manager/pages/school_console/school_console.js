/**
 * Created by bridark on 19/06/15.
 */
const   RouterView      = require('module/core/router'),
        Route           = require('module/core/route'),
        SubMenu         = require('module/ui/menu/sub_menu'),
        React           = require('react'),
        MoreartyHelper	= require('module/helpers/morearty_helper'),
        Immutable       = require('immutable');

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
    componentDidMount: function(){
        const self = this,
            globalBinding = self.getMoreartyContext().getBinding();
        self.addBindingListener(globalBinding, 'submenuNeedsUpdate', self.createSubMenu);
    },
    createSubMenu: function(){
        const self = this,
            binding = self.getDefaultBinding();

        const _createSubMenuData = function(count){
            let menuItems = [{
                href: '/#school_console/users',
                name: 'Users & Permissions',
                key: 'Users'
            },{
                href: '/#school_console/requests',
                name: 'New Requests',
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
        // TODO shitty way
        // server doesn't implement filters
        // so we should filter and count permissions by our hands
        return window.Server.permissionRequests.get(MoreartyHelper.getActiveSchoolId(self), {
                filter: {
                    limit: 1000
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
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        return <div>
            <SubMenu binding={{ default: binding.sub('consoleRouting'), itemsBinding: binding.sub('subMenuItems') }} />
            <div className='bSchoolMaster'>
                <RouterView routes={ binding.sub('consoleRouting') } binding={globalBinding || {}}>
                    <Route path='/school_console /school_console/users' binding={binding.sub('users')} component='module/as_manager/pages/school_console/views/users'  />
                    <Route path='/school_console/requests' binding={binding.sub('requests')} component='module/as_admin/pages/admin_schools/admin_views/admin_requests'  />
                    <Route path="/school_console/requests/accept" binding={binding.sub('parentPermission')} component="module/as_admin/pages/admin_schools/admin_views/admin_permission_accept"  afterSubmitPage="/school_console/requests"/>
                    <Route path='/school_console/archive' binding={binding.sub('archives')} component='module/as_manager/pages/school_console/views/request_archive'  />
                </RouterView>
            </div>
        </div>;
    }
});


module.exports = SchoolConsole;
