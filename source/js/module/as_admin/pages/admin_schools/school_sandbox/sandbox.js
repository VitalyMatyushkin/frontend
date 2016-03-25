/**
 * Created by Bright on 25/03/2016.
 */
const   RouterView  = require('module/core/router'),
    Route       = require('module/core/route'),
    React       = require('react'),
    SubMenu     = require('module/ui/menu/sub_menu'),
    Immutable   = require('immutable');

const SchoolSandbox = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        const   self = this,
                binding = self.getDefaultBinding(),
                globalBinding = self.getMoreartyContext().getBinding(),
            menuItems = [
                {
                    href:'/#school_sandbox/forms',
                    name:'Forms',
                    key:'forms'
                },{
                    href:'/#school_sandbox/houses',
                    name:'Houses',
                    key:'houses'
                }
            ];
        binding.set('subMenuItems',Immutable.fromJS(menuItems));
        binding.set('selectedSchoolId',Immutable.fromJS(globalBinding.sub('routing.parameters').toJS().id));
        console.log(binding.get('selectedSchoolId'));
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            school_sandbox: {
                schools: []
            },
            schoolRouting: {},
            selectedSchoolId:null
        });
    },
    render:function(){
        const   self = this,
                binding = self.getDefaultBinding(),
                global  = self.getMoreartyContext().getBinding();
        return (
            <div>
                <SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
                <div className="bSchoolMaster">
                    <RouterView routes={binding.sub('schoolRouting')} binding={global}>
                        <Route
                            path="/school_sandbox"
                            binding={binding}
                            component="module/as_admin/pages/admin_schools/school_sandbox/classes/classes_page"
                        />
                        <Route
                            path="/school_sandbox/forms /school_sandbox/forms/:mode"
                            binding={binding}
                            component="module/as_admin/pages/admin_schools/school_sandbox/classes/classes_page"
                        />
                        <Route
                            path="/school_sandbox/houses /school_sandbox/houses/:mode"
                            binding={binding}
                            component="module/as_admin/pages/admin_schools/school_sandbox/houses/houses_page"
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});
module.exports = SchoolSandbox;