/**
 * Created by Anatoly on 16.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * ClassListModel
 *
 * @param {object} page
 *
 * */
const ClassListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
		serviceName:'schoolForms',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});
};

ClassListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onChildren: function(data) {
		document.location.hash += `/students?id=${data.id}&name=${data.name}`;
	},
	onRemove:function(data){
		const 	self = this;

		if(typeof data !== 'undefined') {
			window.confirmAlert(
				`Are you sure you want to remove form ${data.name}?`,
				"Ok",
				"Cancel",
				() => window.Server.schoolForm
					.delete( {schoolId:self.activeSchoolId, formId:data.id} )
					.then(() => self.reloadData())
					.catch(() => {
						window.simpleAlert(
							'Sorry! You cannot perform this action. Please contact support',
							'Ok',
							() => {}
						);
					}),
				() => {}
			);
		}
	},
	getGrid: function(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";

		const columns = [
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'name'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Age group',
				isSorted:true,
				cell:{
					dataField:'age',
					type:'custom',
					typeOptions:{
						parseFunction: function(item) {return 'Y' + item.age;}
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
						onItemSelect:	this.onChildren.bind(this),
						onItemRemove:	changeAllowed ? this.onRemove.bind(this) : null
					}
				}
			}
		];

		return new GridModel({
			actionPanel:{
				title:'Forms',
				showStrip:true,

				/**Only school admin and manager can add new students. All other users should not see that button.*/
				btnAdd:changeAllowed ?
				(
					<div className="addButton bTooltip" data-description="Add Form" onClick={function(){document.location.hash += '/add';}}>
						<SVG icon="icon_add_form" />
					</div>
				) : null
			},
			columns:columns,
			handleClick: this.props.handleClick,
			filters:{limit:30}
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


module.exports = ClassListModel;
