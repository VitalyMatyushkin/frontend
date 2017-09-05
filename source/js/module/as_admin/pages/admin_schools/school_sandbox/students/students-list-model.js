/**
 * Created by vitaly on 23.08.17.
 */
const   DataLoader      = require('module/ui/grid/data-loader'),
		React           = require('react'),
		Morearty        = require('morearty'),
		GridModel       = require('module/ui/grid/grid-model');

/**
 * StudentsListModel
 *
 * @param {object} page
 *
 * */
const StudentsListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.setColumns();
	this.grid = new GridModel({
		actionPanel:{
			title:'Students',
			showStrip:true,
			btnAdd:this.props.addButton
		},
		columns:this.columns,
		filters:{limit: 100}
	});

	const   globalBinding   = this.getMoreartyContext().getBinding(),
			schoolId        = globalBinding.get('routing.pathParameters.0');

	this.dataLoader =   new DataLoader({
		serviceName:    'schoolStudents',
		params:         {schoolId:schoolId},
		grid:           this.grid,
		onLoad:         this.getDataLoadedHandle()
	});

};

StudentsListModel.prototype.getActions = function(){
	const actionList = ['Edit'];
	return actionList;
};

StudentsListModel.prototype.getQuickEditAction = function(itemId, action){
	const actionKey = action;
	//For future extension, maybe will appear new actions
	switch (actionKey){
		case 'Edit':
			this.getEditFunction(itemId);
			break;
		default :
			break;
	}

};

StudentsListModel.prototype.getEditFunction = function(itemId){
	const   globalBinding   = this.getMoreartyContext().getBinding(),
			schoolId        = globalBinding.get('routing.pathParameters.0'),
			studentId       = itemId;

	document.location.hash = `school_sandbox/${schoolId}/students/edit/${studentId}`;
};

StudentsListModel.prototype.getGenders = function(){
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
};

StudentsListModel.prototype.getForms = function(){
	const   globalBinding   = this.getMoreartyContext().getBinding(),
			schoolId        = globalBinding.get('routing.pathParameters.0');
	return window.Server.schoolForms.get({schoolId:schoolId},{filter:{limit:100}});
};

StudentsListModel.prototype.getHouses = function(){
	const   globalBinding   = this.getMoreartyContext().getBinding(),
			schoolId        = globalBinding.get('routing.pathParameters.0');
	return window.Server.schoolHouses.get({schoolId:schoolId},{filter:{limit:100}});
};

StudentsListModel.prototype.setColumns = function(){
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
				},
				id:'find_student_gender'
			}
		},
		{
			text:'Name',
			isSorted:true,
			cell:{
				dataField:'firstName'
			},
			filter:{
				type:'string',
				id:'find_student_name'
			}
		},
		{
			text:'Surname',
			isSorted:true,
			cell:{
				dataField:'lastName'
			},
			filter:{
				type:'string',
				id:'find_student_surname'
			}
		},
		{
			text:'Form',
			cell: {
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
				},
				id:'find_student_class'
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
				},
				id:'find_student_house'
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
				type:'between-date',
				id:'find_student_birthday'
			}
		}
	]
};

StudentsListModel.prototype.getDataLoadedHandle = function(){
	const binding = this.getDefaultBinding();

	return function(data){
		binding.set('data', this.grid.table.data);
	};
};

module.exports = StudentsListModel;