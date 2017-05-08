/**
 * Created by Bright on 25/03/2016.
 */
const 	RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		React 					= require('react'),
		SubMenu 				= require('module/ui/menu/sub_menu'),
		Morearty 				= require('morearty'),
		Immutable 				= require('immutable'),
		ClassesPageComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/classes/classes_page'),
		EventsPageComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/events/events_page'),
		SummaryPageComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/summary/summary_page'),
		HousePageComponent		= require('module/as_admin/pages/admin_schools/school_sandbox/houses/houses_page'),
		SportsComponent			= require('./favorite_sports/sports_page');

const	SandboxHeaderStyle		= require('../../../../../../styles/ui/b_sandbox_header.scss');

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
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0'),
				menuItems 		= [
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
									},
									{
										href:`/#school_sandbox/${schoolId}/events`,
										name:'Events',
										key:'events',
										routes:[`/school_sandbox/${schoolId}/events`]
									},
									{
										href:`/#school_sandbox/${schoolId}/summary`,
										name:'Summary',
										key:'summary',
										routes:[`/school_sandbox/${schoolId}/summary`]
                                    },
									{
										href:`/#school_sandbox/${schoolId}/sports`,
										name:'Sports',
										key:'sports',
										routes:[`/school_sandbox/${schoolId}/sports`]
									}
								];
		//Set sub menu items in default binding
		binding.set('subMenuItems',Immutable.fromJS(menuItems));
	},
	componentDidMount:function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');

		//Get school details so that we can display details on the current school in sandbox view
		window.Server.school.get(schoolId)
			.then((school)=>{
				binding.set('schoolDetails',Immutable.fromJS(school));
				return school;
			})
			.catch(error=>console.log(error.errorThrown));
	},
	render:function(){
		const 	binding 	= this.getDefaultBinding(),
				subBinding 	= binding.sub('schoolSandboxRouting'),
				global 		= this.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={{default: subBinding.sub('routing'), itemsBinding: binding.sub('subMenuItems')}} />
				{/*Display current school name, so admin knows what school he or she is operating on*/}
				<div className="bSchoolMaster">
					<div className="bSandboxHeader">
						{binding.get('schoolDetails.name')}
					</div>
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
						<Route
							path="/school_sandbox/:schoolId/events"
							binding={subBinding}
							component={EventsPageComponent}
						/>
						<Route
							path="/school_sandbox/:schoolId/summary"
							binding={binding}
							component={SummaryPageComponent}
                        />
                        <Route
                            path="/school_sandbox/:schoolId/sports"
                            binding={binding}
                            component={SportsComponent}
                        />
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = SchoolSandbox;