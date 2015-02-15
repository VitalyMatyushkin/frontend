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
			schoolId = routingData.id;

		if (schoolId) {
			window.Server.classes.get(schoolId).then(function (data) {
				binding.set('classes', Immutable.fromJS(data));
			});

			window.Server.houses.get(schoolId).then(function (data) {
				binding.set('houses', Immutable.fromJS(data));
			});

			window.Server.learners.get(schoolId).then(function (data) {
				binding.set('pupils', Immutable.fromJS(data));
			});

			window.Server.school.get(schoolId).then(function (data) {
				binding.set('schoolInfo', Immutable.fromJS(data));
			});

			self.schoolId = schoolId;
		}
	},
	addNewClass: function() {
		var self = this;

		document.location.hash = 'class?mode=new&schoolId='+self.schoolId ;
	},
	editClass: function(classInfo) {
		var self = this;

		document.location.hash = 'class?mode=edit&schoolId='+classInfo.schoolId+'&id='+classInfo.id;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			schoolInfo = binding.get('schoolInfo.name'),
			classSerivce;

		return (
			<div className="bSchoolMaster">
				<h1><span className="eSchoolMaster_title">{schoolInfo}</span> control panel</h1>

				<List title="Classes" binding={binding.sub('classes')} onItemEdit={self.editClass} onAddNew={self.addNewClass}>
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
				</Table>

			</div>
		)
	}
});


module.exports = SchoolListPage;
