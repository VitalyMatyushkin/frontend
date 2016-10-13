/**
 * Created by bridark on 19/06/15.
 */
const   RouterView      				= require('module/core/router'),
        Route           				= require('module/core/route'),
        SubMenu         				= require('module/ui/menu/sub_menu'),
        React           				= require('react'),
        MoreartyHelper					= require('module/helpers/morearty_helper'),
        Morearty	    				= require('morearty'),
        Immutable       				= require('immutable'),
		UsersComponent 					= require('module/as_manager/pages/school_console/views/users'),
		AdminRequestsComponent 			= require('./views/requests'),
		RequestArchiveComponent 		= require('./views/request_archive'),
		AdminPermissionAcceptComponent 	= require("module/as_admin/pages/admin_schools/admin_views/admin_permission_accept");

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
		const 	rootBinding 	= this.getMoreartyContext().getBinding(),
				role 			= rootBinding.get('userData.authorizationInfo.role');

		if(role !== "ADMIN" && role !== "MANAGER")
			document.location.hash = 'school_admin/summary';
		else
			this.createSubMenu();
    },
    componentDidMount: function(){
        const globalBinding = this.getMoreartyContext().getBinding();
        this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
    },
    createSubMenu: function(){
        const 	binding		= this.getDefaultBinding(),
				viewerRole	= this.getMoreartyContext().getBinding().get('userData.authorizationInfo.role');


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
                name: 'Requests Archive',
                key: 'archive'
            }];
            binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
        };

        let requestFilter = {
			status: 'NEW'
		};

		// Manager cannot see admin permission requests
		if(viewerRole === 'MANAGER') {
			requestFilter['requestedPermission.preset'] = { $ne: 'ADMIN'}
		}

		_createSubMenuData('*');	// drawing placeholder

        //Get the total number of permissions (Notification badge) in submenu
        return window.Server.permissionRequests.get( MoreartyHelper.getActiveSchoolId(this), {filter:{limit: 1000, where: requestFilter}} )
            .then(permissions => {
                _createSubMenuData(permissions.length);
                // yep, always i'm right
                return true;
            });
    },

    render: function() {
        const 	binding			= this.getDefaultBinding(),
            	globalBinding	= this.getMoreartyContext().getBinding();

        return <div>
            <SubMenu binding={{ default: binding.sub('consoleRouting'), itemsBinding: binding.sub('subMenuItems') }} />
            <div className='bSchoolMaster'>
                <RouterView routes={ binding.sub('consoleRouting') } binding={globalBinding || {}}>
                    <Route path='/school_console /school_console/users' binding={binding.sub('users')} component={UsersComponent}/>
                    <Route path='/school_console/requests' binding={binding.sub('requests')} component={AdminRequestsComponent}/>
                    <Route path="/school_console/requests/accept" binding={binding.sub('parentPermission')} component={AdminPermissionAcceptComponent}  afterSubmitPage="/school_console/requests"/>
                    <Route path='/school_console/archive' binding={binding.sub('archives')} component={RequestArchiveComponent}/>
                </RouterView>
            </div>
        </div>;
    }
});


module.exports = SchoolConsole;
