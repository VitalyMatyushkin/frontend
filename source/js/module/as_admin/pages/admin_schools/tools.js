/**
 * Created by Vitaly on 10.08.17.
 */
/**
 * Created by Woland on 02.08.2017.
 */
const 	React 		= require('react'),
        Morearty	= require('morearty'),
        Immutable 	= require('immutable');

const 	RouterView 	= require('module/core/router'),
        Route 		= require('module/core/route'),
        SubMenu 	= require('module/ui/menu/sub_menu');

const 	ImportStudentsComponent	= require('module/as_admin/pages/admin_schools/import_students_module'),
        PostcodesComponent	    = require('module/as_admin/pages/admin_schools/postcodes/postcodes_page'),
        InvitesComponent	    = require('module/as_admin/pages/tools/tools');

const Tools = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function(){
        this.createSubMenu();
    },
    componentDidMount: function() {
        const globalBinding = this.getMoreartyContext().getBinding();

        this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
    },
    createSubMenu: function(){
        const	self	= this,
            binding	= self.getDefaultBinding();

        const _createSubMenuData = function(){
            let menuItems = [
                {
                    href:'/#tools/import_students',
                    name:'Import Students',
                    key:'import_students'
                },
				{
					href:'/#tools/postcodes',
					name:'Postcodes',
					key:'postcodes'
				},

                {
                    href:'/#school-invite/add-invite',
                    name: 'Invites',
                    key:'invites'
                }
            ];
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
    render:function(){
        const 	binding 	= this.getDefaultBinding(),
                global 		= this.getMoreartyContext().getBinding();

        return (
            <div>
                <SubMenu binding={{default: binding.sub('toolsRouting'), itemsBinding: binding.sub('subMenuItems')}} />
                {/*Display current school name, so admin knows what school he or she is operating on*/}
                <div className="bSchoolMaster">
                    <RouterView routes={binding.sub('toolsRouting')} binding={global}>
                        <Route
                            path 		= "/tools /tools/import_students"
                            binding 	= { binding.sub('importStudents') }
                            component 	= { ImportStudentsComponent }
                        />
                        <Route
                            path 		= "/tools/postcodes"
                            binding 	= { binding.sub('postcodes') }
                            component 	= { PostcodesComponent }
                        />
                        <Route
                            path 		= "/school-invite/add-invite"
                            binding 	= { binding.sub('invites') }
                            component 	= { InvitesComponent }
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});

module.exports = Tools;