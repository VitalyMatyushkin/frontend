const 	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		{SubMenu} 	= require('module/ui/menu/sub_menu'),
		SchoolInfo 	= require('module/as_school/pages/school/view/school_info'),
		React 		= require('react'),
		Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
		SchoolName 	= require('module/as_school/pages/school/view/school_name'),
		FixturesPageComponent 	= require("module/as_school/pages/school/fixtures/fixtures_page"),
		ResultsPageComponent 	= require("module/as_school/pages/school/results/results_page"),
		NewsPageComponent 		= require("module/as_school/pages/school/news/news_page"),
		ContactsPageComponent 	= require("module/as_school/pages/school/contacts/contacts_page");


const OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			news: [],
			fixturesPage: {
				fixtures: []
			},
			results: {},
			coaches: [],
			schoolInfo: '',
			schoolRouting: {}
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId');

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}

		window.Server.schoolInfo.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
		}, function() {
			window.localStorage.clear();
			document.location.reload();
		});

		// Пункты подменю
		self.menuItems = [{
			href: '/#school/fixtures',
			name: 'Fixtures',
			key: 'Fixtures',
			routes: ['/school', '/']
		},{
			href: '/#school/results',
			name: 'Results',
			key: 'Results'
		},{
			href: '/#school/news',
			name: 'News',
			key: 'News'
		},{
			href: '/#school/contacts',
			name: 'Contacts',
			key: 'Contacts'
		}];
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<div className="bUserColumn">
					<div className="bUserPhoto" ref="map">
						<img className="eUserPhoto_logoImage" src={binding.get('schoolInfo.pic')} />
					</div>

					<div className="eUserColumnData">
						<SchoolName binding={binding.sub('schoolInfo')} />
						<SchoolInfo binding={binding.sub('schoolInfo')} />
					</div>
				</div>

				<div className="bUserDataColumn">
					<SubMenu binding={binding.sub('schoolRouting')} items={self.menuItems} />

					<div className="eUserDataColumn_wrap" id="jsSubPage">

						<RouterView routes={ binding.sub('schoolRouting') } binding={globalBinding}>
							<Route path="/ /school /school/fixtures" binding={binding.sub('fixturesPage')} component={FixturesPageComponent}  />
							<Route path="/school/results" binding={binding.sub('results')} component={ResultsPageComponent}  />
							<Route path="/school/news" binding={binding.sub('news')} component={NewsPageComponent}  />
							<Route path="/school/contacts" binding={binding} component={ContactsPageComponent}  />
						</RouterView>

					</div>
				</div>
			</div>
		)
	}
});


module.exports = OneSchoolPage;
