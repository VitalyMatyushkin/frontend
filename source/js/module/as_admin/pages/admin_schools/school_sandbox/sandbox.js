/**
 * Created by Bright on 25/03/2016.
 */
const   RouterView  			= require('module/core/router'),
        Route       			= require('module/core/route'),
        React       			= require('react'),
        SubMenu     			= require('module/ui/menu/sub_menu'),
        Morearty    			= require('morearty'),
        Immutable   			= require('immutable'),
        ClassesPageComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/classes/classes_page'),
		HousePageComponent 		= require('module/as_admin/pages/admin_schools/school_sandbox/houses/houses_page');

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
        const   self            = this,
                binding         = self.getDefaultBinding(),
                globalBinding   = self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0'),
                menuItems       = [
                                    {
                                        href:'/#admin_schools/admin_views/list',
                                        name: '← school list',
                                        key:'back'
                                    },
                                    {
                                        href:`/#school_sandbox/${schoolId}/forms`,
                                        name:'Forms',
                                        key:'forms',
                                        routes:[`/school_sandbox/${schoolId}/forms`]
                                    },
                                    {
                                        href:`/#school_sandbox/${schoolId}/houses`,
                                        name:'Houses',
                                        key:'houses',
                                        routes:[`/school_sandbox/${schoolId}/houses`]
                                    }
                                ];
        //Set sub menu items in default binding
        binding.set('subMenuItems',Immutable.fromJS(menuItems));
    },
    componentDidMount:function(){
        const   self            = this,
                binding         = self.getDefaultBinding(),
                globalBinding   = self.getMoreartyContext().getBinding(),
                schoolId        = globalBinding.get('routing.pathParameters.0');

        //Get school details so that we can display details on the current school in sandbox view
        window.Server.school.get(schoolId)
            .then((school)=>{
                binding.set('schoolDetails',Immutable.fromJS(school));
                return school;
            })
            .catch(error=>console.log(error.errorThrown));
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                subBinding  = binding.sub('schoolSandboxRouting'),
                global      = self.getMoreartyContext().getBinding();
        return (
            <div>
                <SubMenu binding={{default: subBinding.sub('routing'), itemsBinding: binding.sub('subMenuItems')}} />
                {/*Display current school name, so admin knows what school he or she is operating on*/}
                <div style={{margin:10+'px',fontWeight:'bold'}}>You are currently viewing:{binding.get('schoolDetails.name')}</div>
                <div className="bSchoolMaster">
                    <RouterView routes={subBinding.sub('routing')} binding={global}>
                        <Route
                            path="/school_sandbox/:schoolId/forms /school_sandbox/:schoolId/forms/:mode /school_sandbox/:schoolId/forms/:mode/:id"
                            binding={subBinding}
                            component={ClassesPageComponent}
                        />
                        <Route
                            path="/school_sandbox/:schoolId/houses /school_sandbox/:schoolId/houses/:mode /school_sandbox/:schoolId/houses/:mode/:id"
                            binding={subBinding}
                            component={HousePageComponent}
                        />
                    </RouterView>
                </div>
            </div>
        )
    }
});
module.exports = SchoolSandbox;