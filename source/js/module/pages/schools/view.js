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
				binding.set('leaners', Immutable.fromJS(data));
			});

			window.Server.school.get(schoolId).then(function (data) {
				binding.set('schoolInfo', Immutable.fromJS(data));
			});

			self.schoolId = schoolId;
		}
	},
	_getAddFunction: function(page) {
		var self = this;

		return function() {
			var pageBinding = self.getMoreartyContext().getBinding().sub(page).clear();

			document.location.hash = page + '?mode=new&schoolId='+self.schoolId ;
		}
	},
	_getViewFunction: function(page) {
		var self = this;

		return function(data) {
			var pageBinding = self.getMoreartyContext().getBinding().sub(page);

			pageBinding.set('data', Immutable.fromJS(data));
			document.location.hash = page + '?&schoolId='+data.schoolId+'&id='+data.id;
		}
	},
	_getEditFunction: function(page) {
		var self = this;

		return function(data) {
			var pageBinding = self.getMoreartyContext().getBinding().sub(page);

			pageBinding.set('data', Immutable.fromJS(data));
			document.location.hash = page + '?mode=edit&schoolId='+data.schoolId+'&id='+data.id;
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			schoolInfo = binding.get('schoolInfo.name'),
			classSerivce;

		/*
		 <List title="Houses" binding={binding.sub('houses')} onItemEdit={self._getEditFunction('house')} onAddNew={self._getAddFunction('house')}>
		 <ListField dataField="name" />
		 </List>
		 */

		return (
			<div className="bSchoolMaster">
				<h1><span className="eSchoolMaster_title">{schoolInfo}</span> control panel</h1>

				<Table title="Classes" binding={binding.sub('classes')} onItemEdit={self._getEditFunction('class')} onAddNew={self._getAddFunction('class')}>
					<TableField dataField="name">First name</TableField>
					<TableField dataField="age">Age</TableField>
				</Table>

				<Table title="Houses" binding={binding.sub('houses')} onItemEdit={self._getEditFunction('houses')} onAddNew={self._getAddFunction('houses')}>
					<TableField dataField="name">House name</TableField>
				</Table>

				<Table title="Pupils" binding={binding.sub('leaners')} onItemView={self._getViewFunction('leaner')} onItemEdit={self._getEditFunction('leaner')} onAddNew={self._getAddFunction('leaner')}>
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
