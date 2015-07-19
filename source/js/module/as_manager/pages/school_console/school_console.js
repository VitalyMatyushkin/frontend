/**
 * Created by bridark on 19/06/15.
 */
var SchoolConsole,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/menu/sub_menu'),
    liveRequestCount;
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
        //Get the total number of permissions (Notification badge) in submenu
        //TODO: filter this query down to active school and where accepted is equal to false
        window.Server.schoolPermissions.get({id:activeSchoolId}).then(function(count){binding.atomically().set('count', Immutable.fromJS(count)).commit();});
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
        var badge = document.querySelectorAll('.eSubMenu_item')[1];
        if(typeof  badge !== 'undefined'){
           var c = 0;
            if(typeof binding.toJS('count') !== 'undefined'){
                for(var i=0; i<binding.toJS('count').length; i++){
                    if(binding.toJS('count')[i].accepted === undefined){
                        c += 1;
                    }
                }
                badge.innerText = "Live Requests ( "+c+" )";
            }
        }
        return <div>
            <SubMenu binding={binding.sub('consoleRouting')} items={self.menuItems} />
            <div className='bSchoolMaster'>
                <RouterView routes={ binding.sub('consoleRouting') } binding={globalBinding}>
                    <Route path='/school_console' binding={binding.sub('permissions')} component='module/as_manager/pages/school_console/views/permissions'  />
                    <Route path='/school_console/permissions' binding={binding.sub('permissions')} component='module/as_manager/pages/school_console/views/permissions'  />
                    <Route path='/school_console/requests' binding={binding.sub('requests')} component='module/as_manager/pages/school_console/views/requests'  />
                    <Route path='/school_console/archive' binding={binding.sub('archives')} component='module/as_manager/pages/school_console/views/request_archive'  />
                </RouterView>
            </div>
        </div>;
    }
});


module.exports = SchoolConsole;
