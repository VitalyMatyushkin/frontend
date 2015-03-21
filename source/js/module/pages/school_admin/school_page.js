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
			href: '/#school_admin/summary',
			name: 'Summary',
			key: 'Summary'
		},{
			href: '/#school_admin/pupils',
			name: 'Pupils',
			key: 'Pupils'
		},{
			href: '/#school_admin/forms',
			name: 'Forms',
			key: 'Forms'
		},{
			href: '/#school_admin/houses',
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
						<Route path="/school_admin/summary" binding={binding.sub('summary')} component="module/pages/school_admin/summary/summary_page"  />
						<Route path="/school_admin/pupils /school_admin/pupils/:mode" binding={binding.sub('pupils')} component="module/pages/school_admin/pupils/pupils_page"  />
						<Route path="/school_admin/forms /school_admin/forms/:mode" binding={binding.sub('classes')} component="module/pages/school_admin/classes/classes_page"  />
						<Route path="/school_admin/houses /school_admin/houses/:mode" binding={binding.sub('houses')} component="module/pages/school_admin/houses/houses_page"  />
					</RouterView>
				</div>


			</div>
		)
	}
});


module.exports = OneSchoolPage;
