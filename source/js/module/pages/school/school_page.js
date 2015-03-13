var OneSchoolPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	SubMenu = require('module/ui/sub_menu');

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}

		window.Server.school.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
		});

		// Пункты подменю
		self.menuItems = [{
			href: '/#school/summary',
			name: 'Summary',
			key: 'Summary'
		},{
			href: '/#school/pupils',
			name: 'Pupils',
			key: 'Pupils'
		},{
			href: '/#school/classes',
			name: 'Classes',
			key: 'Classes'
		},{
			href: '/#school/houses',
			name: 'Houses',
			key: 'Houses'
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
			pupils: {
				pupilsList: [],
				pupilsRouting: {},
				pupilForm: {}
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
						<Route path="/school/summary" binding={binding.sub('summary')} component="module/pages/school/summary/summary_page"  />
						<Route path="/school/pupils /school/pupils/:mode" binding={binding.sub('pupils')} component="module/pages/school/pupils/pupils_page"  />
						<Route path="/school/classes /school/classes/:mode" binding={binding.sub('classes')} component="module/pages/school/classes/classes_page"  />
						<Route path="/school/houses /school/houses/:mode" binding={binding.sub('houses')} component="module/pages/school/houses/houses_page"  />
					</RouterView>
				</div>


			</div>
		)
	}
});


module.exports = OneSchoolPage;
