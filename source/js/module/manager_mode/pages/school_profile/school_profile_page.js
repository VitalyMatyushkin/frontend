var OneSchoolPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	SubMenu = require('module/ui/menu/sub_menu'),
	SVG = require('module/ui/svg'),
	SchoolInfo = require('module/manager_mode/pages/school_profile/view/school_info'),
	UserButtons = require('module/manager_mode/pages/school_profile/view/user_buttons'),
	SchoolName = require('module/manager_mode/pages/school_profile/view/school_name'),
	Map = require('module/manager_mode/pages/school_profile/view/map');

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routerParameters = globalBinding.toJS('routing.pathParameters'),
			activeSchoolId = routerParameters[0];

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}

		window.Server.school.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
		});

		// Пункты подменю
		self.menuItems = [{
			href: '/#profile/summary',
			name: 'Summary',
			key: 'Summary'
		},{
			href: '/#profile/pupils',
			name: 'Teams',
			key: 'Teams'
		},{
			href: '/#profile/forms',
			name: 'Forms',
			key: 'Forms'
		},{
			href: '/#profile/houses',
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
				<div className="bUserColumn">
					<Map binding={binding} />

					<div className="eUserColumnData">
						<SchoolName binding={binding} />
						<SchoolInfo binding={binding} />
					</div>
				</div>

				<div className="bUserDataColumn">
					<SubMenu binding={binding.sub('schoolProfileRouting')} items={self.menuItems} />

					<div className="eUserDataColumn_wrap" id="jsSubPage">


						<UserButtons />



					</div>
				</div>
			</div>
		)
	}
});


module.exports = OneSchoolPage;
