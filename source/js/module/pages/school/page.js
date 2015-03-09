var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	OneSchoolPage;

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
			binding = self.getDefaultBinding(),
			schoolInfo = binding.get('schoolInfo.name'),
			classSerivce;

		return (
			<div>
				<div className="bSubMenu mClearFix">
					<a href="#" className="eSubMenu_item mActive">Summary</a>
					<a href="#" className="eSubMenu_item">Pupils</a>
					<a href="#" className="eSubMenu_item">Classes</a>
					<a href="#" className="eSubMenu_item">Houses</a>
				</div>

				<div className="bSchoolMaster">
					<h1 className="eSchoolMaster_title">
						<span className="eSchoolMaster_titleName">{schoolInfo}</span> control panel

						<div className="eSchoolMaster_buttons">
							<div className="bButton">Set as default...</div>
							<a href="/#schools/list" className="bButton">Open my schools</a>
						</div>
					</h1>


					<Table title="Pupils" binding={binding.sub('leaners')} onItemView={self._getViewFunction('leaner')} onItemEdit={self._getEditFunction('leaner')} onAddNew={self._getAddFunction('leaner')}>
						<TableField dataField="firstName">First name</TableField>
						<TableField dataField="lastName">Last name</TableField>
						<TableField dataField="age">Age</TableField>
						<TableField dataField="phone">Phone</TableField>
					</Table>

					<Table title="Classes" binding={binding.sub('classes')} onItemView={self._getViewFunction('class')} onItemEdit={self._getEditFunction('class')} onAddNew={self._getAddFunction('class')}>
						<TableField dataField="name">First name</TableField>
						<TableField dataField="age">Age</TableField>
					</Table>

					<Table title="Houses" binding={binding.sub('houses')} onItemView={self._getViewFunction('house')} onItemEdit={self._getEditFunction('house')} onAddNew={self._getAddFunction('house')}>
						<TableField dataField="name">House name</TableField>
					</Table>
				</div>


			</div>
		)
	}
});


module.exports = OneSchoolPage;
