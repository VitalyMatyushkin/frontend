var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	ClassListPage;

ClassListPage = React.createClass({
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
			self.request = window.Server.schoolClasses.get(activeSchoolId).then(function (data) {
				binding.set(Immutable.fromJS(data));
			});
		}
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.abort();
	},
	_getAddFunction: function() {
		var self = this;

		return function(event) {
			//var pageBinding = self.getMoreartyContext().getBinding().sub(page).clear();

			document.location.hash = 'school/classes/add' ;
			event.stopPropagation();
		}
	},
	_getEditFunction: function() {
		var self = this;

		return function(data) {
		//	self.props.formBinding.set(Immutable.fromJS(data));

			document.location.hash = 'school/classes/edit?id='+data.id;
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title">Classes</h1>

				<Table title="Classes" binding={binding} onItemEdit={self._getEditFunction()} onAddNew={self._getAddFunction()}>
					<TableField dataField="name">First name</TableField>
					<TableField dataField="age">Age</TableField>
				</Table>

			</div>
		)
	}
});


module.exports = ClassListPage;
