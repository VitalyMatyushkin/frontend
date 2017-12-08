const	React			= require('react'),
		MoreartyHelper	= require('../../../../../../helpers/morearty_helper'),
		{SVG}			= require('module/ui/svg'),
		{DataLoader}	= require('module/ui/grid/data-loader'),
		{GridModel}		= require('module/ui/grid/grid-model');

const SchoolUnionSchoolListModel = function(page, handleClickAddButton){
	this.page = page;
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.setColumns();
	this.setAddButton(handleClickAddButton);

	this.grid = new GridModel({
		actionPanel	: {
			title		: 'Schools',
			showStrip	: true,
			btnAdd		: this.btnAdd
		},
		columns		: this.columns,
		filters		: {
			limit: 20
		}
	});

	this.dataLoader = new DataLoader({
		serviceName	:'schoolUnionSchools',
		params		: {
			schoolUnionId: MoreartyHelper.getActiveSchoolId(page)
		},
		grid		: this.grid,
		onLoad		: this.getDataLoadedHandle()
	});
};

SchoolUnionSchoolListModel.prototype.setAddButton = function(handleClickAddButton) {
	this.btnAdd = (
		<div	className			="addButton bTooltip"
				data-description	="Add School"
				onClick				={handleClickAddButton}
		>
			<SVG icon="icon_add_school"/>
		</div>
	);
};

SchoolUnionSchoolListModel.prototype.getActions = function(){
	return ['View', 'Delete'];
};

SchoolUnionSchoolListModel.prototype.getQuickEditAction = function(itemId, action){
	const actionKey = action;

	switch (actionKey){
		case 'View':
			this.getViewFunction(itemId);
			break;
		case 'Delete':
			this.getDeleteFunction(itemId);
			break;
		default :
			break;
	}

};

SchoolUnionSchoolListModel.prototype.getViewFunction = function(schoolId){
	document.location.hash = `school_union_admin/school/${schoolId}`;
};

SchoolUnionSchoolListModel.prototype.getDeleteFunction = function(itemId){
	const self = this;

	const binding = self.getDefaultBinding();

	window.confirmAlert(
		"Do you really want to remove this item?",
		"Ok",
		"Cancel",
		() => {
			window.Server.schoolUnionSchool.delete(
				{
					schoolUnionId	: MoreartyHelper.getActiveSchoolId(this.page),
					schoolId		: itemId
				}
			).then(() => {
				binding.sub('data').update(function(result) {
					return result.filter(function(res) {
						return res.id !== itemId;
					});
				});
				self.reloadData();
			});
		},
		() => {}
	);
};

SchoolUnionSchoolListModel.prototype.reloadData = function(){
	this.dataLoader.loadData();
};

SchoolUnionSchoolListModel.prototype.getSchoolList = function(){
	return window.Server.schools.get({filter:{limit:1000}});
};

SchoolUnionSchoolListModel.prototype.getStatusList = function(){
	return [
		{
			key:'ACTIVE',
			value:'Active'
		},
		{
			key:'INACTIVE',
			value:'Inactive'
		},
		{
			key:'SUSPENDED',
			value:'Suspended'
		},
		{
			key:'EMAIL_NOTIFICATIONS',
			value:'Email Notifications'
		}
	];
};

SchoolUnionSchoolListModel.prototype.setColumns = function(){
	this.columns = [
		{
			text:'Logo',
			isSorted:false,
			cell:{
				dataField:'pic',
				type:'image'
			}
		},
		{
			text:'School',
			isSorted:true,
			cell:{
				dataField:'name',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Phone',
			isSorted:false,
			cell:{
				dataField:'phone',
				type:'general'
			}
		},
		{
			text:'Address',
			isSorted:true,
			cell:{
				dataField:'address',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Domain',
			isSorted:true,
			cell:{
				dataField:'domain',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Status',
			isSorted:true,
			cell:{
				dataField:'status',
				type:'general'
			},
			filter:{
				type:'multi-select',
				typeOptions:{
					items: this.getStatusList()
				}
			}
		},
		{
			text:'Actions',
			width:'150px',
			cell:{
				type:'action-list',
				typeOptions:{
					getActionList:this.getActions.bind(this),
					actionHandler:this.getQuickEditAction.bind(this)
				}
			}
		}
	];
};

SchoolUnionSchoolListModel.prototype.getDataLoadedHandle = function(){
	const binding = this.getDefaultBinding();

	return function(data){
		binding.set('data', this.grid.table.data);
	};
};

module.exports = SchoolUnionSchoolListModel;