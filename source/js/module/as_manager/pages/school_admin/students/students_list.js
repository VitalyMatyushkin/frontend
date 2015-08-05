var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	SVG = require('module/ui/svg'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
	StudentsListPage;

StudentsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	serviceName: 'students',
	filters: {
		include: ['user','form', 'parents']
	},
	_getViewFunction: function() {
		var self = this;

		return function(data) {
			//var pageBinding = self.getMoreartyContext().getBinding().sub(page);

			//pageBinding.set('data', Immutable.fromJS(data));
			document.location.hash = 'student?id='+data.id;
			//document.location.hash = page + '?&schoolId='+data.schoolId+'&id='+data.id;
		}
	},
	getForm: function (value) {
		return value.name;
	},
	getGender: function (user) {
		var self = this,
			icon = user.gender === 'male' ? 'icon_man': 'icon_woman';

		return <SVG icon={icon} />;
	},
	getBirthday: function(user) {
		var self = this;

		return self.getAgeFromBirthday(user.birthday);
	},
	getAgeFromBirthday: function(value) {
		var self = this,
			birthday = new Date(value),
			date = self.zeroFill(birthday.getDate()),
			month = birthday.getMonth(),
			year = birthday.getFullYear();

		return [date, self.getMonthName(month), year].join(' ');
	},
	getParents: function(parents) {
		var self = this;

		return parents ? parents.map(function(parent) {
			var iconGender = parent.gender === 'male' ? 'icon_man': 'icon_woman';

			return (<div className="eDataList_parent">
				<span className="eDataList_parentGender"><SVG icon={iconGender} /></span>
				<span className="eDataList_parentName">{[parent.firstName, parent.lastName].join(' ')}</span>
			</div>);
		}) : null;
	},
	getFirstName: function(user) {
		return user.firstName;
	},
	getLastName: function(user) {
		return user.lastName;
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Table title="Students" binding={binding} onItemView={self._getViewFunction()} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
				<TableField width="3%" dataField="user" filterType="none" parseFunction={self.getGender}>Gender</TableField>
				<TableField width="15%" dataField="user" parseFunction={self.getFirstName}>First name</TableField>
				<TableField width="15%" dataField="user" parseFunction={self.getLastName}>Last name</TableField>
				<TableField width="5%" dataField="form" filterType="none" parseFunction={self.getForm}>Form</TableField>
				<TableField width="15%" dataField="user" filterType="range" parseFunction={self.getBirthday}>Birthday</TableField>
				<TableField width="20%" dataField="parents" filterType="none" parseFunction={self.getParents}>Parents</TableField>
			</Table>
		)
	}
});


module.exports = StudentsListPage;
