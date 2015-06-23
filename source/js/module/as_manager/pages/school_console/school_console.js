/**
 * Created by bridark on 19/06/15.
 */
var SchoolConsole,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/menu/sub_menu');

SchoolConsole = React.createClass({
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
            consoleRouting: {}
        });
    },
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        self.menuItems = [{
            href: '/#school_console/permissions',
            name: 'Permissions',
            key: 'Permissions'
        },{
            href: '/#school_console/requests',
            name: 'Live Requests',
            key: 'requests'
        },{
            href: '/#school_console/archive',
            name: 'request archive',
            key: 'archive'
        }];
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        return <div>
            <SubMenu binding={binding.sub('consoleRouting')} items={self.menuItems} />
            <div className='bSchoolMaster'>
                <RouterView routes={ binding.sub('consoleRouting') } binding={globalBinding}>
                    <Route path='/school_console' binding={binding.sub('permissions')} component='module/as_manager/pages/school_console/views/permissions'  />
                    <Route path='/school_console/permissions' binding={binding.sub('permissions')} component='module/as_manager/pages/school_console/views/permissions'  />
                    <Route path='/school_console/requests' binding={binding.sub('requests')} component='module/as_manager/pages/school_console/views/requests'  />
                    <Route path='/school_console/archive' binding={binding.sub('archives')} component='module/as_manager/pages/school_console/views/request_archive'  />
                    <Route path='/invites/:inviteId/accept' binding={binding.sub('accept')} component='module/as_manager/pages/invites/views/accept'  />
                    <Route path='/invites/:inviteId/decline' binding={binding.sub('decline')} component='module/as_manager/pages/invites/views/answer'  />
                    <Route path='/invites/:inviteId/cancel' binding={binding.sub('cancel')} component='module/as_manager/pages/invites/views/answer'  />
                </RouterView>
            </div>
        </div>;
    }
});


module.exports = SchoolConsole;
