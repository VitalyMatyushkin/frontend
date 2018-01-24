/**
 * Created by vitaly on 23.08.17.
 */
import * as	React from 'react';

import {DataLoader} from 'module/ui/grid/data-loader';

import {GridModel} from 'module/ui/grid/grid-model';
import {AdminServiceList} from "module/core/service_list/admin_service_list";

/**
 * StudentsListClass
 *
 * @param {object} page
 *
 * */
export class StudentListModel {

    getDefaultBinding: any;
    getMoreartyContext: any;
    props: any;
    state: any;
    grid: GridModel;
    columns: any[];
    dataLoader: DataLoader;

	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		this.setColumns();
		this.grid = new GridModel({
			actionPanel:{
				title:      'Students',
				showStrip:  true,
				btnAdd:     this.props.addButton
			},
			columns:    this.columns,
			filters:    { limit: 100 }
		});
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
		
		this.dataLoader = new DataLoader({
			serviceName: 	'schoolStudents',
			params: 		{schoolId:schoolId},
			grid: 			this.grid,
			onLoad: 		this.getDataLoadedHandle()
		});
	}
	
	getActions(){
		return ['Merge'];
	}
	
	getQuickEditAction(itemId, action){
		const actionKey = action;
		//For future extension, maybe will appear new actions
		switch (actionKey){
			case 'Merge':
				this.getMergeFunction(itemId);
				break;
			default :
				break;
		}
	}
	
	getMergeFunction(studentId){
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
		
		document.location.hash = `school_sandbox/${schoolId}/students/merge/${studentId}`;
	}
	
	getGenders(){
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
	}
	
	getForms(){
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
		return (window.Server as AdminServiceList).schoolForms.get({schoolId:schoolId},{filter:{limit:100}});
	}
	
	getHouses(){
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
		return (window.Server as AdminServiceList).schoolHouses.get({schoolId:schoolId},{filter:{limit:100}});
	}
	
	setColumns(){
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
			},
			{
				text:'Actions',
				cell:{
					type:'action-list',
					typeOptions:{
						getActionList:this.getActions.bind(this),
						actionHandler:this.getQuickEditAction.bind(this)
					}
				}
			}
		]
	}
	
	getDataLoadedHandle(){
		const binding = this.getDefaultBinding();
		
		return function(data){
			binding.set('data', this.grid.table.data);
		};
	}
}