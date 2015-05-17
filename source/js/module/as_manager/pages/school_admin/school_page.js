var OneSchoolPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	SubMenu = require('module/ui/menu/sub_menu');

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		} else {
			window.Server.school.get(activeSchoolId).then(function (data) {
				binding.set('schoolInfo', Immutable.fromJS(data));
			});
		}

		// Пункты подменю
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
			href: '/#school_admin/news',
			name: 'News',
			key: 'News'
		},{
			href: '/#school_admin/coaches',
			name: 'Coaches',
			key: 'Coaches'
		}];
	},

	getDefaultState: function () {
		return Immutable.fromJS({
			classes: {
				classesList: [],
				classesRouting: {},
				classesForm: {}
			},
			houses: {
				housesList: [],
				housesRouting: {},
				housesForm: {}
			},
			students: {
				studentsList: [],
				studentsRouting: {},
				studentForm: {}
			},
			news: {
				newsList: [],
				newsRouting: {},
				newsForm: {}
			},
			coaches: {
				coachesList: [],
				coachesRouting: {},
				coachesForm: {}
			},
			schoolInfo: '',
			schoolRouting: {}
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={binding.sub('schoolRouting')} items={self.menuItems} />

				<div className="bSchoolMaster">
					<RouterView routes={ binding.sub('schoolRouting') } binding={globalBinding}>
						<Route path="/school_admin/summary" binding={binding.sub('summary')} component="module/as_manager/pages/school_admin/summary/summary_page"  />
						<Route path="/school_admin/students /school_admin/students/:mode" binding={binding.sub('students')} component="module/as_manager/pages/school_admin/students/students_page"  />
						<Route path="/school_admin/forms /school_admin/forms/:mode" binding={binding.sub('classes')} component="module/as_manager/pages/school_admin/classes/classes_page"  />
						<Route path="/school_admin/houses /school_admin/houses/:mode" binding={binding.sub('houses')} component="module/as_manager/pages/school_admin/houses/houses_page"  />
						<Route path="/school_admin/news /school_admin/news/:mode" binding={binding.sub('news')} component="module/as_manager/pages/school_admin/news/news_page"  />
						<Route path="/school_admin/coaches /school_admin/coaches/:mode" binding={binding.sub('coaches')} component="module/as_manager/pages/school_admin/coaches/coaches_page"  />
					</RouterView>
				</div>


			</div>
		)
	}
});


module.exports = OneSchoolPage;
