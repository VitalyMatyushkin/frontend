var OneSchoolPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			classes: [],
			houses: [],
			pupils: [],
			schoolInfo: ''
		});
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			schoolId = routingData.id;

		if (schoolId) {
            globalBinding.set('activeSchoolId', schoolId);
			window.Server.classes.get(schoolId).then(function (data) {
				binding.set('classes', Immutable.fromJS(data));
			});

			window.Server.houses.get(schoolId).then(function (data) {
				binding.set('houses', Immutable.fromJS(data));
			});

			window.Server.learners.get(schoolId).then(function (data) {
				binding.set('leaners', Immutable.fromJS(data));
			});

			window.Server.school.get(schoolId).then(function (data) {
				binding.set('schoolInfo', Immutable.fromJS(data));
			});

			self.schoolId = schoolId;
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<div className="bSubMenu mClearFix">
					<a href="#" className="eSubMenu_item mActive">Summary</a>
					<a href="#" className="eSubMenu_item">Pupils</a>
					<a href="#" className="eSubMenu_item">Classes</a>
					<a href="#" className="eSubMenu_item">Houses</a>
				</div>
				1
				<RouterView routes={ globalBinding.sub('schoolRouting') } binding={globalBinding}>
					<Route path="/schools/:schoolId/view" binding={globalBinding.sub('school')} component="module/pages/school/test"  />
					<Route path="/schools/view2" binding={globalBinding.sub('school')} component="module/pages/school/test"  />
				</RouterView>
				 2

			</div>
		)
	}
});


module.exports = OneSchoolPage;
