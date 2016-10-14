/**
 * Created by Anatoly on 11.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		GenderIcon		= require('module/ui/icons/gender_icon'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * StudentListModel
 *
 * @param {object} page
 *
 * */
const StudentListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.title = 'Students';
	this.filters = {limit:20};
	this.setAddButton();
	this.setColumns();
};

StudentListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onView: function(student) {
		document.location.hash = 'school_admin/students/stats?id='+student.id;
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
	getParents: function(item) {
		const parents = item.parents;

		if (parents) {
			return parents ? parents.map( parent => {
				return (
					<div className="eDataList_parent">
						<span className="eDataList_parentGender"><GenderIcon gender={parent.gender}/></span>
						<span className="eDataList_parentName">{[parent.firstName, parent.lastName].join(' ')}</span>
					</div>
				);
			}) : null;
		}
	},
	getForms:function(){
		return window.Server.schoolForms.get({schoolId:this.activeSchoolId},{filter:{limit:100}});
	},
	getHouses:function(){
		return window.Server.schoolHouses.get({schoolId:this.activeSchoolId},{filter:{limit:100}});
	},
	getGenders:function(){
		return [
			{
				key:'MALE',
				value:'Boy'
			},
			{
				key:'FEMALE',
				value:'Girl'
			}
		];
	},
	setAddButton: function(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";

		/**Only school admin and manager can add new students. All other users should not see that button.*/
		this.btnAdd = changeAllowed ?
			(
				<div className="addButton bTooltip" data-description="Add Student" onClick={function(){document.location.hash += '/add';}}>
					<SVG icon="icon_add_student" />
				</div>
			) : null
	},
	setColumns: function(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";

		this.columns = [
			{
				text:'Gender',
				cell:{
					dataField:'gender',
					type:'gender'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getGenders(),
						hideFilter:true,
						hideButtons:true
					}
				}
			},
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'firstName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Surname',
				isSorted:true,
				cell:{
					dataField:'lastName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Form',
				cell:{
					dataField:'form.name'
				}
			},
			{
				text:'Form',
				hidden:true,
				cell:{
					dataField:'formId'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						getDataPromise: this.getForms(),
						valueField:'name',
						keyField:'id'
					}
				}
			},
			{
				text:'House',
				cell:{
					dataField:'house.name'
				}
			},
			{
				text:'House',
				hidden:true,
				cell:{
					dataField:'houseId'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						getDataPromise: this.getHouses(),
						valueField:'name',
						keyField:'id'
					}
				}
			},
			{
				text:'Birthday',
				isSorted:true,
				cell:{
					dataField:'birthday',
					type:'date'
				},
				filter:{
					type:'between-date'
				}
			},
			{
				text:'Parents',
				cell:{
					dataField:'parents',
					type:'custom',
					typeOptions:{
						parseFunction:this.getParents.bind(this)
					}
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						/**
						 * Only school admin and manager can edit or delete students.
						 * All other users should not see that button.
						 * */
						onItemEdit:		changeAllowed ? this.onEdit.bind(this) : null,
						onItemView:		this.onView.bind(this),
						onItemRemove:	changeAllowed ? this.onRemove.bind(this) : null
					}
				}
			}
		];
	},
	init: function(){
		this.grid = new GridModel({
			actionPanel:{
				title:this.title,
				showStrip:true,
				btnAdd:this.btnAdd
			},
			columns: this.columns,
			filters: this.filters
		});

		this.dataLoader = new DataLoader({
			serviceName:'schoolStudents',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});

		return this;
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.getDefaultBinding();

		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = StudentListModel;