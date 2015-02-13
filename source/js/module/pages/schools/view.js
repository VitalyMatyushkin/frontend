var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	SchoolListPage;

SchoolListPage = React.createClass({
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
			schooldId = routingData.id;

		if (schooldId) {
			window.Server.classes.get(schooldId).then(function (data) {
				binding.set('classes', Immutable.fromJS(data));
			});

			window.Server.houses.get(schooldId).then(function (data) {
				binding.set('houses', Immutable.fromJS(data));
			});

			window.Server.learners.get(schooldId).then(function (data) {
				binding.set('pupils', Immutable.fromJS(data));
			});

			window.Server.school.get(schooldId).then(function (data) {
				binding.set('schoolInfo', Immutable.fromJS(data));
			});
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			schoolInfo = binding.get('schoolInfo.name');

		return (
			<div className="bSchoolMaster">
				<h1><span className="eSchoolMaster_title">{schoolInfo}</span> control panel</h1>

				<List title="Classes" binding={binding.sub('classes')}>
					<ListField dataField="name" />
				</List>

				<List title="Homes" binding={binding.sub('houses')}>
					<ListField dataField="name" />
				</List>

				<Table title="Pupils" binding={binding.sub('pupils')}>
					<TableField dataField="firstName">First name</TableField>
					<TableField dataField="lastName">Last name</TableField>
					<TableField dataField="age">Age</TableField>
					<TableField dataField="phone">Phone</TableField>
					<TableField dataField="classId">Class</TableField>
				</Table>

			</div>
		)
	}
});


module.exports = SchoolListPage;
