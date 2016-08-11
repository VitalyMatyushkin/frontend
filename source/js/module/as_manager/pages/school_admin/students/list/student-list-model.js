/**
 * Created by Anatoly on 11.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * UsersActions
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

	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
		serviceName:'schoolStudents',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});
};

StudentListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onView: function(student) {
		document.location.hash = 'school_admin/student?id='+student.id;
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
	getGrid: function(){
		const columns = [
			{
				text:'Gender',
				cell:{
					dataField:'gender',
					type:'gender'
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
				text:'House',
				cell:{
					dataField:'house.name'
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
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						onItemEdit:		this.onEdit.bind(this),
						onItemView:		this.onView.bind(this),
						onItemRemove:	this.onRemove.bind(this)
					}
				}
			}
		];

		return new GridModel({
			actionPanel:{
				title:'Students',
				showStrip:true,
				btnAdd:(
					<div className="addButton" onClick={function(){document.location.hash += '/add';}}>
						<SVG icon="icon_add_student" />
					</div>
				)
			},
			columns:columns,
			filters:{limit:20}
		});
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
