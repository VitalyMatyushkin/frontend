/**
 * Created by Anatoly on 11.08.2016.
 */

const 	React 			= require('react'),
		SessionHelper	= require('module/helpers/session_helper'),
		{SVG} 			= require('module/ui/svg'),
		GenderIcon		= require('module/ui/icons/gender_icon'),
		{DataLoader} 	= require('module/ui/grid/data-loader'),
		{GridModel}		= require('module/ui/grid/grid-model'),
		schoolHelper 	= require('module/helpers/school_helper');

/**
 * StudentListModel
 *
 * @param {object} page
 *
 * */
class StudentListClass{
	constructor(page){
		this.getDefaultBinding 	= page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		this.rootBinding 	= this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		this.title 		= 'Students';
		this.filters 	= { limit:20 };
		this.setAddButton();
		this.setColumns();
	}

	reloadData(){
		this.dataLoader.loadData();
	}
	
	getParents(item){
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
	}
	
	getForms(){
		return window.Server.schoolForms.get(
			{ schoolId: 	this.activeSchoolId },
			{ filter: 		{ limit:100 } }
		);
	}
	
	getHouses(){
		return window.Server.schoolHouses.get(
			{ schoolId: 	this.activeSchoolId },
			{ filter: 		{ limit:100 } }
		);
	}
	
	getGenders(){
		return [
			{
				key: 	'MALE',
				value:	'Boy'
			},
			{
				key: 	'FEMALE',
				value: 	'Girl'
			}
		];
	}
	
	setAddButton(){
		const 	role 			= SessionHelper.getRoleFromSession(this.rootBinding.sub('userData')),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		/**Only school admin and manager can add new students. All other users should not see that button.*/
		this.btnAdd = changeAllowed ?
			(
				<div className="addButton bTooltip" data-description="Add Student" onClick={ () => {
					document.location.hash += '/add';
				}}>
					<SVG icon="icon_add_student" />
				</div>
			) : null
	}
	
	getActions(){
		const actionList = ['View']; // for all roles
		
		const 	role 			= SessionHelper.getRoleFromSession(this.rootBinding.sub('userData')),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		/**
		 * Only school admin and manager can edit, merge or delete students.
		 * All other users should not see that button.
		 * */
		if (changeAllowed) {
			//actionList.push('Edit', 'Merge', 'Remove');
			//we hide merge students (it available by superadmin)
			actionList.push('Edit', 'Remove');
		}
		
		return actionList;
	}
	
	_getQuickEditActionFunctions(studentId, action) {
		switch (action){
			case 'View':
				document.location.hash = 'school_admin/students/stats?id=' + studentId;
				break;
			case 'Edit':
				document.location.hash = 'school_admin/students/edit?id=' + studentId;
				break;
			case 'Merge':
				document.location.hash = 'school_admin/students/merge?id=' + studentId;
				break;
			case 'Remove':
				const showAlert = function() {
					window.simpleAlert(
						'Sorry! You cannot perform this action. Please contact support',
						'Ok',
						() => {
						}
					);
				};
				
				window.confirmAlert(
					`Are you sure you want to remove student?`,
					"Ok",
					"Cancel",
					() => window.Server.schoolStudent
					.delete( {schoolId: this.activeSchoolId, studentId: studentId} )
					.then(() => this.reloadData())
					.catch(() => showAlert()),
					() => {}
				);
				break;
			default :
				break;
		}
	}
	
	setColumns(){
		this.columns = [
			{
				text: 'Gender',
				cell: {
					dataField: 	'gender',
					type: 		'gender'
				},
				filter: {
					type: 	'multi-select',
					id: 	'find_student_gender',
					typeOptions: {
						items: 			this.getGenders(),
						hideFilter: 	true,
						hideButtons: 	true
					}
				}
			},
			{
				text: 			'Name',
				isSorted: 		true,
				cell: {
					dataField: 'firstName'
				},
				filter: {
					type: 	'string',
					id: 	'find_student_name'
				}
			},
			{
				text: 		'Surname',
				isSorted: 	true,
				cell: {
					dataField: 'lastName'
				},
				filter:{
					type: 	'string',
					id: 	'find_student_surname'
				}
			},
			{
				text: 'Form',
				cell: {
					dataField: 'form.name'
				}
			},
			{
				text: 	'Form',
				hidden:	true,
				cell: {
					dataField: 'formId'
				},
				filter: {
					type: 'multi-select',
					typeOptions: {
						getDataPromise: 	this.getForms(),
						valueField: 		'name',
						keyField: 			'id'
					},
					id: 'find_student_class'
				}
			},
			{
				text: 'House',
				cell: {
					dataField: 'house.name'
				}
			},
			{
				text: 	'House',
				hidden: true,
				cell: {
					dataField: 'houseId'
				},
				filter: {
					type: 'multi-select',
					typeOptions: {
						getDataPromise: this.getHouses(),
						valueField: 	'name',
						keyField: 		'id'
					},
					id: 'find_student_house'
				}
			},
			{
				text: 		'Birthday',
				isSorted: 	true,
				cell: {
					dataField: 'birthday',
					type: 		'date'
				},
				filter:{
					type: 	'between-date',
					id: 	'find_student_birthday'
				}
			},
			{
				text: 'Parents',
				cell: {
					dataField: 	'parents',
					type: 		'custom',
					typeOptions: {
						parseFunction:this.getParents.bind(this)
					}
				}
			},
			{
				text: 'Actions',
				cell: {
					type: 'action-list',
					typeOptions: {
						getActionList: this.getActions.bind(this),
						actionHandler: this._getQuickEditActionFunctions.bind(this)
					}
				}
			}
		];
	}
	

	//We add icon star only captain (flag isCaptain === true)
	getCaptainStar(item){
		//In service student we don't get field 'isCaptain', because we search it in playerData
		//Player MUST be always found
		const student = this.playerData.find(player => item.id === player.userId);
		//If field captain false or undefined, we return null (as react element), if field captain true, we draw star
		if (student && student.isCaptain) {
			return (
				<span className="eStar">
					<i className = "fa fa-star fa-lg" aria-hidden="true"></i>
				</span>
			);
		} else {
			return null;
		}
		
	}
	//For team view we want display column 'Captain'
	getColumnsCaptain(){
		this.columns.splice(1, 0,
			{
				text: 'Captain',
				cell: {
					dataField: 	'captain',
					type: 		'custom',
					typeOptions: {
						parseFunction: this.getCaptainStar.bind(this)
					}
				}
			}
		);
	}
	createGrid() {
		const 	self = this,
				binding = self.getDefaultBinding();
		
		schoolHelper.setSchoolSubscriptionPlanPromise(this).then(() => {
			if (schoolHelper.schoolSubscriptionPlanIsFull(this)) {
				//if we view team, we want display column 'Captain'
				if (this.isTeamView) {
					this.getColumnsCaptain();
				}
				this.grid = new GridModel({
					actionPanel: {
						title: 		this.title,
						showStrip: 	true,
						btnAdd: 	this.btnAdd
					},
					columns: 		this.columns,
					handleClick: 	this.props.handleClick,
					filters: 		this.filters
				});
				
				this.dataLoader = new DataLoader({
					serviceName: 	'schoolStudents',
					params: 		{ schoolId: this.activeSchoolId },
					grid: 			this.grid,
					onLoad: 		this.getDataLoadedHandle()
				});
			}
		});
		
		return this;
	}
	
	createGridFromExistingData(grid) {
		const 	self = this,
				binding = self.getDefaultBinding();
		
		schoolHelper.setSchoolSubscriptionPlanPromise(this).then(() => {
			if (schoolHelper.schoolSubscriptionPlanIsFull(this)) {
				//if we view team, we want display column 'Captain'
				if (this.isTeamView) {
					this.getColumnsCaptain();
				}
				this.grid = new GridModel({
					actionPanel: {
						title: 		this.title,
						showStrip: 	true,
						btnAdd: 	this.btnAdd
					},
					columns: 		this.columns,
					handleClick: 	this.props.handleClick,
					filters: {
						where: grid.filter.where,
						order: grid.filter.order
					},
					badges: 		grid.filterPanel.badgeArea
				});
				
				this.dataLoader = new DataLoader({
					serviceName: 	'schoolStudents',
					params: 		{ schoolId: this.activeSchoolId },
					grid: 			this.grid,
					onLoad: 		this.getDataLoadedHandle()
				});
			}
		});
		
		return this;
	}
	
	getDataLoadedHandle(data){
		const 	self 		= this,
				binding 	= self.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
}

module.exports = StudentListClass;
