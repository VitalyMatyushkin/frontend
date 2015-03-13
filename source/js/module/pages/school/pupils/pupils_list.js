var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	OneSchoolPage;

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		formBinding: React.PropTypes.any.isRequired
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (activeSchoolId) {
			self.request = window.Server.learners.get(activeSchoolId).then(function (data) {
				binding.set(Immutable.fromJS(data));
			});
		}
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.abort();
	},
	_getAddFunction: function(page) {
		var self = this;

		return function(event) {
			var pageBinding = self.getMoreartyContext().getBinding().sub(page).clear();

			document.location.hash = 'school/pupils/add' ;
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
		//	self.props.formBinding.set(Immutable.fromJS(data));

			document.location.hash = 'school/pupils/edit?id='+data.id;
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
