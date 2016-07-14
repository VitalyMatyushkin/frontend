const 	Table 			= require('module/ui/list/table'),
		TableField 		= require('module/ui/list/table_field'),
		DateTimeMixin 	= require('module/mixins/datetime'),
		SVG 			= require('module/ui/svg'),
		ListPageMixin 	= require('module/mixins/list_page_mixin'),
		Service 		= require('module/core/service2'),
		React 			= require('react');

const StudentsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	setPageTitle: 'Students',
	serviceName: 'schoolStudents',
    serviceCount:'schoolStudentsCount',
	onView: function(data) {
		document.location.hash = 'school_admin/student?id='+data.id;
	},
	onRemove: function(student) {
		const 	self 		= this,
				rootBinding = self.getMoreartyContext().getBinding(),
				schoolId 	= rootBinding.get('userRules.activeSchoolId'),
				cf 			= confirm(`Are you sure you want to remove student ${student.firstName} ${student.lastName}?`);

		if(cf === true){
			window.Server.schoolStudent.delete({schoolId:schoolId, studentId:student.id})
				.then(function(){
					self.reloadData();
				});
		}
	},
	getGender: function (gender) {
		var icon = gender === 'MALE' ? 'icon_man': 'icon_woman';

		return <SVG classes="bIcon-gender" icon={icon} />;
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
	/**
	 * only for service2 testing
	 * */
	_getDataPromise:function(filter){
		const 	self 		= this,
				rootBinding = self.getMoreartyContext().getBinding(),
				sessionId 	= rootBinding.get('userData.authorizationInfo.id'),
				options 	= 	{
									authHeader:'usid',
									authKey:sessionId,
									timeout:3000
								},
				service 	= new Service('/i/schools/{schoolId}/students', options);
		console.log('service2 started...');
		return service.get(self.activeSchoolId, { filter: filter });
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Table title="Students" binding={binding} onItemView={self.onView} onItemEdit={self._getEditFunction()}
				   onItemRemove={self.onRemove} isPaginated={true} filter={self.filter}
				   getDataPromise={self._getDataPromise} getTotalCountPromise={self.getTotalCountPromise} >
				<TableField dataField="gender" filterType="none" parseFunction={self.getGender}>Gender</TableField>
				<TableField dataField="firstName" >Name</TableField>
				<TableField dataField="lastName" >Surname</TableField>
				<TableField dataField="form" dataFieldKey="name" filterType="none" >Form</TableField>
				<TableField dataField="house" dataFieldKey="name" filterType="none" >House</TableField>
				<TableField dataField="birthday" filterType="none" parseFunction={self.getAgeFromBirthday}>Birthday</TableField>
				<TableField dataField="parents" filterType="none" parseFunction={self.getParents}>Parents</TableField>
			</Table>
		)
	}
});


module.exports = StudentsListPage;
