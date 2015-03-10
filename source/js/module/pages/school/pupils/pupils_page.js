var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	OneSchoolPage;

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillUnmount: function() {
		var self = this;

	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			schoolId = '4bf6415a-568d-4815-91e4-7bf0c4575346';

		if (schoolId) {
			window.Server.learners.get(schoolId).then(function (data) {
				binding.set(Immutable.fromJS(data));
				self.isMounted() && self.forceUpdate();
			});

			self.schoolId = schoolId;
		}
	},
	_getAddFunction: function(page) {
		var self = this;

		return function(event) {
			var pageBinding = self.getMoreartyContext().getBinding().sub(page).clear();

			document.location.hash = page + '?mode=new&schoolId='+self.schoolId ;
			event.stopPropagation();
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
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title">Pupils</h1>

				<Table title="Pupils" binding={binding} onItemView={self._getViewFunction('leaner')} onItemEdit={self._getEditFunction('leaner')} onAddNew={self._getAddFunction('leaner')}>
					<TableField dataField="firstName">First name</TableField>
					<TableField dataField="lastName">Last name</TableField>
					<TableField dataField="age">Age</TableField>
					<TableField dataField="phone">Phone</TableField>
				</Table>

			</div>
		)
	}
});


module.exports = OneSchoolPage;
