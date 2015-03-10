var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	OneSchoolPage;

OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (activeSchoolId) {
			self.request = window.Server.houses.get(activeSchoolId).then(function (data) {
				binding.set(Immutable.fromJS(data));
				self.isMounted() && self.forceUpdate();
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
				<h1 className="eSchoolMaster_title">Houses</h1>

				<Table title="Houses" binding={binding} onItemView={self._getViewFunction('house')} onItemEdit={self._getEditFunction('house')} onAddNew={self._getAddFunction('house')}>
					<TableField dataField="name">House name</TableField>
				</Table>
			</div>
		)
	}
});


module.exports = OneSchoolPage;
