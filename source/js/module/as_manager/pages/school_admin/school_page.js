const 	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		React 		= require('react'),
		Immutable 	= require('immutable'),
		SubMenu 	= require('module/ui/menu/sub_menu');

const OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const 	self 			= this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				role 			= globalBinding.get('userData.authorizationInfo.role');

        if(!role)
            document.location.hash = 'no_role';

		// SubMenu items
		self.menuItems = [{
			href: '/#school_admin/summary',
			name: 'Summary',
			key: 'Summary'
		},{
			href: '/#school_admin/students',
			name: 'Students',
			key: 'Students'
		},{
			href: '/#school_admin/forms',
			name: 'Forms',
			key: 'Forms'
		},{
			href: '/#school_admin/houses',
			name: 'Houses',
			key: 'Houses'
		},{
			href: '/#school_admin/teams',
			name: 'Teams',
			key: 'Teams'
		},{
			href: '/#school_admin/news',
			name: 'News',
			key: 'News'
		}];
		if(role === "ADMIN" || role === "MANAGER"){
			self.menuItems.push(
			{
				href:'/#school_admin/gallery',
				name:'Gallery',
				key:'Gallery'
			});
		}
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			classes: {
				classesList: {},
				classesRouting: {},
				classesForm: {}
			},
			houses: {
				housesList: {},
				housesRouting: {},
				housesForm: {}
			},
			students: {
				studentsList: {},
				studentsRouting: {},
				studentForm: {}
			},
			news: {
				newsList: {},
				newsRouting: {},
				newsForm: {}
			},
			gallery:{
				galleryList:[]
			},
			teams:{
				teamsList: {},
				teamEdit: {},
				teamAdd: {},
				teamsRouting: {}
			},
			schoolInfo: '',
			schoolRouting: {}
		});
	},
	render: function() {
		const self        = this,
			binding       = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={binding.sub('schoolRouting')} items={self.menuItems} />
				<div className="bSchoolMaster">
					<RouterView routes={ binding.sub('schoolRouting') } binding={globalBinding}>
						<Route path="/school_admin/summary"
							   binding={binding.sub('summary')}
							   component="module/as_manager/pages/school_admin/summary/summary_page"/>

						<Route path="/school_admin/students /school_admin/students/:mode"
							   binding={binding.sub('students')}
							   component="module/as_manager/pages/school_admin/students/students_page"/>

						<Route path="/school_admin/forms /school_admin/forms/:mode"
							   binding={binding.sub('classes')}
							   component="module/as_manager/pages/school_admin/classes/classes_page"/>

						<Route path="/school_admin/houses /school_admin/houses/:mode"
							   binding={binding.sub('houses')}
							   component="module/as_manager/pages/school_admin/houses/houses_page"/>

						<Route path="/school_admin/teams /school_admin/teams/:mode"
							   binding={binding.sub('teams')}
							   component="module/as_manager/pages/school_admin/teams/teams_page"/>

						<Route path="/school_admin/news /school_admin/news/:mode"
							   binding={binding.sub('news')}
							   component="module/as_manager/pages/school_admin/news/news_page"/>

                        <Route path="/school_admin/gallery /school_admin/gallery/:mode"
							   binding={binding.sub('gallery')}
							   component="module/as_manager/pages/school_admin/gallery/gallery_page"/>

						<Route path="/school_admin/student"
							   binding={binding}
							   component="module/as_manager/pages/student/student_page"/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = OneSchoolPage;