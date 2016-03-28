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
    getDefaultState: function () {
        return Immutable.fromJS({
            school_sandbox: {
                schools: []
            },
            schoolRouting: {},
            selectedSchoolId:null
        });
    },
    componentWillMount:function(){
        const   self            =   this,
                binding         =   self.getDefaultBinding(),
                globalBinding   =    self.getMoreartyContext().getBinding(),
                schoolId        =  globalBinding.sub('routing.parameters').toJS().id,
                menuItems       = [
                                    {
                                        href:'/#admin_schools/admin_views/list',
                                        name: '← school list',
                                        key:'back'
                                    },
                                    {
                                        href:'/#school_sandbox/forms',
                                        name:'Forms',
                                        key:'forms'
                                    },
                                    {
                                        href:'/#school_sandbox/houses',
                                        name:'Houses',
                                        key:'houses'
                                    }
                                ];
        //Set sub menu items in default binding
        binding.set('subMenuItems',Immutable.fromJS(menuItems));
        //Set active school id : there exist a key for it already in the global context
        globalBinding.set('userRules.activeSchoolId',Immutable.fromJS(schoolId));
    },
    componentDidMount:function(){
        const   self            =   this,
                binding         =   self.getDefaultBinding(),
                globalBinding   =   self.getMoreartyContext().getBinding();
        //Check if there exists an active school
        if(globalBinding.get('userRules.activeSchoolId')!==undefined){
            //Get school details so that we can display details on the current school in sandbox view
            window.Server.school.get({id:globalBinding.get('userRules.activeSchoolId')})
                .then((school)=>{
                    binding.set('schoolDetails',Immutable.fromJS(school));
                    //redirect to the forms page as the initial view
                    document.location.hash = 'school_sandbox/forms';
                    return school;
                })
                .catch(error=>console.log(error.errorThrown));
        }else{
            //Go back to school page to prevent errors and unpredictable results
            document.location.hash = 'admin_schools/admin_views/list';
        }
    },
    render:function(){
        const   self    = this,
                binding = self.getDefaultBinding(),
                global  = self.getMoreartyContext().getBinding();
        return (
            <div>
                <SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
                {/*Display current school name, so admin knows what school he or she is operating on*/}
                <div style={{margin:10+'px',fontWeight:'bold'}}>You are currently viewing:{binding.get('schoolDetails.name')}</div>
                <div className="bSchoolMaster">
                    <RouterView routes={binding.sub('schoolRouting')} binding={global}>
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
                        <Route
                            path="/admin_schools/admin_views/list /admin_schools/admin_views/list:mode"
                            binding={binding.sub('schools')}
                            component="module/as_admin/pages/admin_schools/admin_views/admin_list"
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});
module.exports = SchoolSandbox;