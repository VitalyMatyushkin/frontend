var OneSchoolPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	SubMenu = require('module/ui/menu/sub_menu'),
	SchoolInfo = require('module/as_main/pages/school/view/school_info'),
	SchoolName = require('module/as_main/pages/school/view/school_name'),
	Map = require('module/as_main/pages/school/view/map');

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId');

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}

		window.Server.school.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
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





					</div>
				</div>
			</div>
		)
	}
});


module.exports = OneSchoolPage;
