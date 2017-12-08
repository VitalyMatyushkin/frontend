/**
 * Created by Vitaly on 09.08.17.
 */
const	React									= require('react'),
        Morearty								= require('morearty'),
        Immutable								= require('immutable'),
        RouterView								= require('module/core/router'),
        Route									= require('module/core/route'),
        SubMenu									= require('module/ui/menu/sub_menu'),
	    {SVG}									= require('module/ui/svg');

const 	SportsPageComponent						= require('module/as_admin/pages/admin_schools/sports/sports_page');

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
            sports: {}
        });
    },
    createSubMenu: function(){
        const	self	= this,
                binding	= self.getDefaultBinding();

        const _createSubMenuData = function(){
            let menuItems = [];
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
                            path 				= "/sports /sports/admin_views/sports /sports/admin_views/sports/:mode"
                            binding 			= { binding.sub('sports') }
                            component 			= { SportsPageComponent }
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});

module.exports = OneSchoolPage;
