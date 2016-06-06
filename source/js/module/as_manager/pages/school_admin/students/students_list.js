const Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	SVG = require('module/ui/svg'),
	ListPageMixin = require('module/mixins/list_page_mixin'),
	React = require('react');

const StudentsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	setPageTitle: 'Students',
	serviceName: 'schoolStudents',
    serviceCount:'schoolStudentsCount',
	_getViewFunction: function() {
		var self = this;

		return function(data) {
			//var pageBinding = self.getMoreartyContext().getBinding().sub(page);

			//pageBinding.set('data', Immutable.fromJS(data));
			document.location.hash = 'school_admin/student?id='+data.id;
			//document.location.hash = page + '?&schoolId='+data.schoolId+'&id='+data.id;
		}
	},
	getGender: function (gender) {
		var icon = gender === 'male' ? 'icon_man': 'icon_woman';

		return <SVG icon={icon} />;
	},
	getAgeFromBirthday: function(value) {
		var self = this;
        if(value !== undefined){
            var	birthday = new Date(value),
                date = self.zeroFill(birthday.getDate()),
                month = birthday.getMonth(),
                year = birthday.getFullYear();

            return [date, self.getMonthName(month), year].join(' ');
        }
	},
	getParents: function(parents) {
		var self = this;
        if(parents !== undefined){
            return parents ? parents.map(function(parent) {
                var iconGender = parent.gender === 'male' ? 'icon_man': 'icon_woman';

                return (<div className="eDataList_parent">
                    <span className="eDataList_parentGender"><SVG icon={iconGender} /></span>
                    <span className="eDataList_parentName">{[parent.firstName, parent.lastName].join(' ')}</span>
                </div>);
            }) : null;
        }
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Table title="Students" binding={binding} onItemView={self._getViewFunction()}
				   onItemEdit={self._getEditFunction()} isPaginated={true} filter={self.filter}
				   getDataPromise={self.getDataPromise} getTotalCountPromise={self.getTotalCountPromise} >
				<TableField dataField="gender" filterType="none" parseFunction={self.getGender}>Gender</TableField>
				<TableField dataField="firstName" >Name</TableField>
				<TableField dataField="lastName" >Surname</TableField>
				<TableField dataField="form" dataFieldKey="name" filterType="none" >Form</TableField>
				<TableField dataField="house" dataFieldKey="name" filterType="none" >Form</TableField>
				<TableField dataField="birthday" filterType="none" parseFunction={self.getAgeFromBirthday}>Birthday</TableField>
				<TableField dataField="parents" filterType="none" parseFunction={self.getParents}>Parents</TableField>
			</Table>
		)
	}
});


module.exports = StudentsListPage;
